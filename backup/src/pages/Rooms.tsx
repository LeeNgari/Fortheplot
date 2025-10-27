
import React, { useState } from 'react';
import { Users, Plus, Play, Clock, Globe, Lock } from 'lucide-react';
import apiClient from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Room } from '@/types/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

interface RoomsProps {
  onNavigate?: (section: string, roomId?: string) => void;
}

const Rooms: React.FC<RoomsProps> = ({ onNavigate }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomIsPublic, setNewRoomIsPublic] = useState(true);
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [newRoomMovieId, setNewRoomMovieId] = useState('');

  const { data: publicRooms, isLoading: publicRoomsLoading, error: publicRoomsError } = useQuery<Room[], Error>({
    queryKey: ['publicRooms'],
    queryFn: () => apiClient.get('/rooms?public=true').then(res => res.data.content),
  });

  const createRoomMutation = useMutation<Room, Error, { name: string, public: boolean, password?: string, movieId?: number }>({
    mutationFn: (roomData) => apiClient.post('/rooms', roomData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicRooms'] });
      setShowCreateRoomDialog(false);
      setNewRoomName('');
      setNewRoomIsPublic(true);
      setNewRoomPassword('');
      setNewRoomMovieId('');
    },
  });

  const handleJoinRoom = (roomId: number) => {
    if (onNavigate) {
      onNavigate('room', roomId.toString());
    }
  };

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoomMutation.mutate({
      name: newRoomName,
      public: newRoomIsPublic,
      password: newRoomPassword || undefined,
      movieId: newRoomMovieId ? parseInt(newRoomMovieId) : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Watch Together</h1>
          <p className="text-gray-300 text-lg mb-8">Join friends and watch movies or TV shows together in real-time</p>
          
          {/* Tab Navigation */}
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

        {/* Public Rooms List */}
        {activeTab === 'public' && (
          <div>
            {publicRoomsLoading && <p className="text-white">Loading public rooms...</p>}
            {publicRoomsError && <p className="text-red-500">Error loading public rooms: {publicRoomsError.message}</p>}
            {publicRooms && publicRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicRooms.map((room) => (
                  <div key={room.id} className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">Host: {room.host.username}</p>
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <Users className="w-4 h-4" />
                      <span>{room.playbackState.playing ? 'Playing' : 'Paused'}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">Watching: {room.movie?.title || 'N/A'}</p>
                    <Button 
                      onClick={() => handleJoinRoom(room.id)}
                      className="mt-auto bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Join Room
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              !publicRoomsLoading && <p className="text-white">No public rooms found.</p>
            )}
          </div>
        )}

        {/* Create Room Dialog */}
        <Dialog open={showCreateRoomDialog} onOpenChange={setShowCreateRoomDialog}>
          <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
              <DialogDescription>Fill in the details for your new watch party room.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRoomSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="movieId" className="text-right">Movie ID (Optional)</Label>
                <Input
                  id="movieId"
                  value={newRoomMovieId}
                  onChange={(e) => setNewRoomMovieId(e.target.value)}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="public" className="text-right">Public</Label>
                <Checkbox
                  id="public"
                  checked={newRoomIsPublic}
                  onCheckedChange={(checked) => setNewRoomIsPublic(checked as boolean)}
                  className="col-span-3"
                />
              </div>
              {!newRoomIsPublic && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newRoomPassword}
                    onChange={(e) => setNewRoomPassword(e.target.value)}
                    className="col-span-3 bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
              )}
              <DialogFooter>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  Create Room
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Rooms;
