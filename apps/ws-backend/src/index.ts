import { WebSocketServer, WebSocket } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client'; 

const wss = new WebSocketServer({ port: 8080 });

interface user {
    ws: WebSocket,
    userId: string,
    rooms: string[]
}

const users: user[] = [];

function checkuser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string") {
            return null;
        }
        if (!decoded || !(decoded as JwtPayload).userId) {
            return null;
        }
        return (decoded as JwtPayload).userId;
    } catch (err) {
        return null;
    }
}

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if(!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get("token") ||  "";
    const userId = checkuser(token);

    if(!userId) {
        ws.close();
        return;
    }

    users.push({
         ws, 
        userId, 
        rooms: []
    });

    ws.on('message', async function message(data) {   
        const paresData = JSON.parse(data.toString());

        if(paresData.type === "join_room") {
            const user = users.find(u => u.ws === ws);
            if(user && !user.rooms.includes(paresData.roomId)) {
                user.rooms.push(paresData.roomId);
            }
        } 

        if(paresData.type === "leave_room") {
            const user = users.find(u => u.ws === ws);
            if(user) {
                user.rooms = user.rooms.filter(r => r !== paresData.roomId);
            } 
        }

        if(paresData.type === "chat") {
            const roomId = paresData.roomId;
            const message = paresData.message;
            await prismaClient.chat.create({
                data: {
                    userId: userId,
                    roomId: paresData.roomId,
                    message: paresData.message
                } 
            });

            users.forEach(user => {
                if(user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        roomId,
                        message
                    }))
                }
            })
        }
     })



});