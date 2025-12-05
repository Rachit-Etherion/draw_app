import { Tool } from "../components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
} | {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
} | {
  type: "line";           // straight line from a->b
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} | {
  type: "pencil";         // freehand: list of points
  points: { x: number; y: number }[];
}

export class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX: number = 0;
  private startY: number = 0;
  private selectedTool: Tool = "circle";
  private pencilPoints: { x: number; y: number }[] = [];
  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  distroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);

      if (messageData.type === "chat") {
        const parseMessage = JSON.parse(messageData.message);
        this.existingShapes.push(parseMessage);
        this.clearCanvas();
      }
    };
  }

  // Convert client coords to canvas-local coords
  private getCanvasPos(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // redraw all existing shapes
    this.existingShapes.forEach((shape) => {
        this.context.strokeStyle = "white";
        if (shape.type === "rect") {
            this.context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            this.context.beginPath();
            this.context.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, 2 * Math.PI);
            this.context.stroke();
            this.context.closePath();
        } else if (shape.type === "line") {
            this.context.beginPath();
            this.context.moveTo(shape.x1, shape.y1);
            this.context.lineTo(shape.x2, shape.y2);
            this.context.stroke();
            this.context.closePath();
        } else if (shape.type === "pencil") {
            if (shape.points.length > 0) {
            this.context.beginPath();
            this.context.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
                this.context.lineTo(shape.points[i].x, shape.points[i].y);
            }
            this.context.stroke();
            this.context.closePath();
            }
        }
    });
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    const pos = this.getCanvasPos(e);
    this.startX = pos.x;
    this.startY = pos.y;

    if (this.selectedTool === "pencil") {
        this.pencilPoints = [{ x: pos.x, y: pos.y }];
    }
  }

  mouseUpHandler = (e: MouseEvent) => {
    if (!this.clicked) return;
    this.clicked = false;

    const pos = this.getCanvasPos(e);
    const width = pos.x - this.startX;
    const height = pos.y - this.startY;

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      // normalize so x,y are top-left and width/height are positive
      const x = width >= 0 ? this.startX : this.startX + width;
      const y = height >= 0 ? this.startY : this.startY + height;
      shape = {
        type: "rect",
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height)
      };
    } else if (selectedTool === "circle") {
      // change this to Math.min(...) if you want the circle inscribed in the drag box
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;

      shape = {
        type: "circle",
        centerX,
        centerY,
        radius
      };
    } else if (selectedTool === "line") {
        shape = { type: "line", x1: this.startX, y1: this.startY, x2: pos.x, y2: pos.y };
    } else if (selectedTool === "pencil") {
        // finalize pencil path
        shape = { type: "pencil", points: this.pencilPoints.slice() };
        this.pencilPoints = [];
    }

    if (!shape) return;

    this.existingShapes.push(shape);

    this.socket.send(JSON.stringify({
      type: "chat",
      roomId: this.roomId,
      message: JSON.stringify(shape)
    }));

    this.clearCanvas();
  }

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;

    const pos = this.getCanvasPos(e);
    const width = pos.x - this.startX;
    const height = pos.y - this.startY;

    this.clearCanvas();
    this.context.strokeStyle = "white";

    const selectedTool = this.selectedTool;
    if (selectedTool === "rect") {
      // strokeRect accepts negative width/height and draws correctly, but if you prefer preview normalized:
      const x = width >= 0 ? this.startX : this.startX + width;
      const y = height >= 0 ? this.startY : this.startY + height;
      const w = Math.abs(width);
      const h = Math.abs(height);
      this.context.strokeRect(x, y, w, h);
    } else if (selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2; // use Math.min for inscribed
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;

      this.context.beginPath();
      this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.context.stroke();
      this.context.closePath();
    } else if (selectedTool === "line") {
    // preview a straight line from start -> current pos
        this.context.beginPath();
        this.context.moveTo(this.startX, this.startY);
        this.context.lineTo(pos.x, pos.y);
        this.context.stroke();
        this.context.closePath();
    } else if (selectedTool === "pencil") {
        // freehand: add point and draw the path so far
        this.pencilPoints.push({ x: pos.x, y: pos.y });
        if (this.pencilPoints.length > 1) {
        this.context.beginPath();
        this.context.moveTo(this.pencilPoints[0].x, this.pencilPoints[0].y);
        for (let i = 1; i < this.pencilPoints.length; i++) {
            this.context.lineTo(this.pencilPoints[i].x, this.pencilPoints[i].y);
        }
        this.context.stroke();
        this.context.closePath();
        }
    }
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
