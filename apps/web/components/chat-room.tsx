import axios from "axios"
import { BACKEND_URL } from "../app/config"
import ChatRoomClient from "./chat-room-client";


async function getChat(roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
    return response.data.messages;
}

export async function ChatRoom({id}: {
    id: string
}) {
    const messages = await getChat(id);

    return <ChatRoomClient messages={messages} id={id} />
}