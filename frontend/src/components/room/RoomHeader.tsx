
import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { Room as ApiRoom } from '@/types/api';

interface RoomHeaderProps {
  room: ApiRoom;
  participantCount: number;
  onLeave: () => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ room, participantCount, onLeave }) => {
  return (
    <div className="flex items-center justify-between p-6 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-4">
        <button
          onClick={onLeave}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-light">Leave Room</span>
        </button>
        <div className="h-6 w-px bg-white/20"></div>
        <h1 className="text-xl font-light text-white">
          Room #{room.id} - {room.name}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white/60">
          <Users className="w-5 h-5" />
          <span className="font-light">{participantCount}</span>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
