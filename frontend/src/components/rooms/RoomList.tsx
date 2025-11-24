
import React from 'react';
import { Play, Users } from 'lucide-react';
import { Room } from '@/types/api';
import { Button } from '@/components/ui/button';

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (roomId: number) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onJoinRoom }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div key={room.id} className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
          <p className="text-gray-400 text-sm mb-4">Host: {room.host.username}</p>
          <div className="flex items-center gap-2 text-gray-300 mb-4">
            <Users className="w-4 h-4" />
            <span>{room.playbackState.playing ? 'Playing' : 'Paused'}</span>
          </div>
          <p className="text-gray-300 text-sm mb-4">Watching: {room.movie?.title || 'N/A'}</p>
          <Button 
            onClick={() => onJoinRoom(room.id)}
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Join Room
          </Button>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
