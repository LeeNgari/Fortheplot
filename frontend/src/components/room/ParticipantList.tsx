
import React from 'react';
import { User } from '@/types/room';

interface ParticipantListProps {
  participants: User[];
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-xl font-light text-white mb-6">
        Participants ({participants.length})
      </h2>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {participant.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-light">
                {participant.name}
              </span>
              {participant.isHost && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  Host
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantList;
