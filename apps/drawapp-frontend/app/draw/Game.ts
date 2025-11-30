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

            if(messageData.type === "chat") {
                const parseMessage = JSON.parse(messageData.message);
                this.existingShapes.push(parseMessage);
                this.clearCanvas();
            }
        };
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            if(shape.type === "rect") {
                this.context.strokeStyle = "white";
                this.context.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if(shape.type === "circle") {
                this.context.strokeStyle = "white";
                this.context.beginPath();
                this.context.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, 2 * Math.PI);
                this.context.stroke();
            }
        });
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        // implement other shapes later
        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        if(selectedTool === "rect") {
            shape = {
                type: "rect", 
                x: this.startX, 
                y: this.startY, 
                width, 
                height
            }
        } else if(selectedTool === "circle") {
            const radius = Math.max(width,height)/2;
            shape = {
                type: "circle",
                centerX: this.startX + radius,
                centerY: this.startY + radius,
                radius
            }
        }

        if(!shape) return;

        this.existingShapes.push(shape);


        this.socket.send(JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            message: JSON.stringify(shape) 
        }));
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if(this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            this.context.strokeStyle = "white";

            const selectedTool = this.selectedTool;
            if(selectedTool === "rect") {
                this.context.strokeRect(this.startX, this.startY, width, height);
            } else if(selectedTool === "circle") {
                const radius = Math.max(width,height)/2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.context.beginPath();
                this.context.arc(centerX, centerY, Math.abs(radius), 0, 2 * Math.PI);
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