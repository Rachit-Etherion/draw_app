interface Room {
  id: string;
  slug: string;
  createdAt: string;
  admin: {
    name: string;
  };
}

interface RoomCardProps {
  room: Room;
  onJoin: () => void;
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold truncate">{room.slug}</h4>
        </div>
        <div className="text-xs text-gray-500 mt-1">by {room.admin.name || "—"}</div>
      </div>

        <div className="mt-3 text-sm text-gray-600">
            <div className="mt-1">Created: <span className="text-gray-400">{new Date(room.createdAt).toLocaleString()}</span></div>
        </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={onJoin}
          className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Join
        </button>
      </div>
    </div>
  );
}
