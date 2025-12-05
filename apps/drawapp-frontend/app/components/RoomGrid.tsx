import { RoomCard } from "./RoomCard";

interface Room {
  id: string;
  slug: string;
  createdAt: string;
  admin: {
    name: string;
  };
}

interface RoomGridProps {
  rooms: Room[];
  loading: boolean;
  onJoinRoom: (roomId: string) => void;
}

export function RoomGrid({ rooms, loading, onJoinRoom }: RoomGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full p-8 bg-white rounded-2xl shadow text-center">
          Loading rooms...
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full p-8 bg-white rounded-2xl shadow text-center">
          No rooms yet. Create one to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onJoin={() => onJoinRoom(room.id)}
        />
      ))}
    </div>
  );
}
