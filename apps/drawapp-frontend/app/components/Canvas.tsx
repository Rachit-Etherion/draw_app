"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconeButton";
import { Circle, Pencil, RectangleEllipsis, RectangleHorizontal } from "lucide-react";
import { Game } from "../draw/Game";

export type Tool = "rect" | "pencil" | "circle"


export function Canvas({roomId, socket}: {roomId: string, socket: WebSocket}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle");

    useEffect(() => {
        game?.setTool(selectedTool)
    }, [selectedTool, game]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.distroy()
            };
        }

    },[canvasRef]);


    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}

function TopBar({selectedTool, setSelectedTool}: {
    selectedTool: Tool
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
        position: "fixed",
        top: 10,
        left: 10
    }}>
        <div className="flex">
            <IconButton icone = {<Pencil/>} onClick={() => {setSelectedTool("pencil")}} activated={selectedTool === "pencil"} />
            <IconButton icone = {<RectangleHorizontal/>} onClick={() => {setSelectedTool("rect")}} activated={selectedTool === "rect"} />
            <IconButton icone = {<Circle/>} onClick={() => {setSelectedTool("circle")}} activated={selectedTool === "circle"} />
        </div>
    </div>
}