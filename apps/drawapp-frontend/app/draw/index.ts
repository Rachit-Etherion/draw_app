import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";

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

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const context = canvas.getContext("2d");

    let existingShapes: Shape[] = await getExistingShapes(roomId);

    if(!context) {
        return;
    }

    socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);

        if(messageData.type === "chat") {
            const parseMessage = JSON.parse(messageData.message);
            existingShapes.push(parseMessage);
            clerarCanvas(context, existingShapes, canvas);
        }
    };

    clerarCanvas(context, existingShapes, canvas); 

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        const shape: Shape = {
            type: "rect", 
            x: startX, 
            y: startY, 
            width, 
            height
        }
        existingShapes.push(shape);


        socket.send(JSON.stringify({
            type: "chat",
            roomId: roomId,
            message: JSON.stringify(shape) 
        }));
    });
    canvas.addEventListener("mousemove", (e) => {
        if(clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clerarCanvas(context, existingShapes, canvas);
            context.strokeStyle = "white";
            context.strokeRect(startX, startY, width, height);
        }
    });
}

function clerarCanvas(context: CanvasRenderingContext2D, existingShapes: Shape[], canvas: HTMLCanvasElement) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if(shape.type === "rect") {
            context.strokeStyle = "white";
            context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    });

}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND_URL}/chat/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    });

    return shapes;
}