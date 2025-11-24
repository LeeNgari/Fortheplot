import React, { useState } from 'react';
import { Globe, Lock, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Room } from '@/types/api';
import RoomList from '@/components/rooms/RoomList';
import CreateRoomDialog from '@/components/rooms/CreateRoomDialog';
import { useNavigate } from 'react-router-dom';

const Rooms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);
  const navigate = useNavigate();

  const { data: publicRooms, isLoading: publicRoomsLoading, error: publicRoomsError } = useQuery<Room[], Error>({
    queryKey: ['publicRooms'],
    queryFn: () => apiClient.get('/rooms?public=true').then(res => res.data.content),
  });

  const handleJoinRoom = (roomId: number) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Watch Together</h1>
          <p className="text-gray-300 text-lg mb-8">Join friends and watch movies or TV shows together in real-time</p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('public')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'public'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Globe className="w-5 h-5 inline mr-2" />
              Public Rooms
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'private'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Lock className="w-5 h-5 inline mr-2" />
              My Rooms
            </button>
            <button
              onClick={() => setShowCreateRoomDialog(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 ml-auto"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Room
            </button>
          </div>
        </div>

        {activeTab === 'public' && (
          <div>
            {publicRoomsLoading && <p className="text-white">Loading public rooms...</p>}
            {publicRoomsError && <p className="text-red-500">Error loading public rooms: {publicRoomsError.message}</p>}
            {publicRooms && publicRooms.length > 0 ? (
              <RoomList rooms={publicRooms} onJoinRoom={handleJoinRoom} />
            ) : (
              !publicRoomsLoading && <p className="text-white">No public rooms found.</p>
            )}
          </div>
        )}

        <CreateRoomDialog open={showCreateRoomDialog} onOpenChange={setShowCreateRoomDialog} />
      </div>
    </div>
  );
};

export default Rooms;