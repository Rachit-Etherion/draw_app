import { LineChart } from "lucide-react";
import { ReactNode } from "react";


export function IconButton({icone, onClick, activated}: {
    icone: ReactNode,
    onClick: () => void
    activated: boolean
}) {
    return <div className={`m-2 pointer rounded-full border p-2 bg-black hover:bg-gray-500 
    ${activated ? "text-blue-400" : "text-white"}`} onClick={onClick}>
        {icone }
    </div>
}