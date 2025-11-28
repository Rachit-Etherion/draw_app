import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMzkyMGFjYy03OGUzLTQwYzktOWE4Ny03ODlkYjVhNWY0MDgiLCJpYXQiOjE3NjQyNjY4OTQsImV4cCI6MTc2NDg3MTY5NH0.FudrywrQd7M2i3qpDGk8pXataQiCbV8f6PcYpoblMsI`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    },[]);

    return {
        socket,
        loading
    }
}