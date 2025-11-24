
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Movie, Room } from '@/types/api';
import { Film } from 'lucide-react';

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateRoomDialog: React.FC<CreateRoomDialogProps> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomIsPublic, setNewRoomIsPublic] = useState(true);
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | undefined>(undefined);

  const { data: allMovies, isLoading: moviesLoading } = useQuery<Movie[], Error>({
    queryKey: ['allMovies'],
    queryFn: () => apiClient.get('/movies').then(res => res.data.content),
  });

  const createRoomMutation = useMutation<Room, Error, { name: string, public: boolean, password?: string, movieId?: number }>({
    mutationFn: (roomData) => apiClient.post('/rooms', roomData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicRooms'] });
      onOpenChange(false);
      setNewRoomName('');
      setNewRoomIsPublic(true);
      setNewRoomPassword('');
      setSelectedMovieId(undefined);
    },
  });

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoomMutation.mutate({
      name: newRoomName,
      public: newRoomIsPublic,
      password: newRoomPassword || undefined,
      movieId: selectedMovieId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>Fill in the details for your new watch party room.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateRoomSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Room Name</Label>
            <Input
              id="name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="col-span-3 bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Select Movie (Optional)</Label>
            <div className="col-span-3 max-h-[200px] overflow-y-auto border border-gray-700 rounded-md p-2">
              {moviesLoading && <p>Loading movies...</p>}
              {allMovies?.length === 0 && !moviesLoading && (
                <p className="text-gray-400">No movies available.</p>
              )}
              {allMovies?.map((movie) => (
                <div 
                  key={movie.id} 
                  className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-700 mb-1 ${
                    selectedMovieId === movie.id ? 'bg-blue-600 hover:bg-blue-500' : ''
                  }`}
                  onClick={() => setSelectedMovieId(movie.id)}
                >
                  <img src={movie.posterPath} alt={movie.title} className="w-12 h-18 object-cover rounded-sm" />
                  <p className="font-medium text-white">{movie.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="public" className="text-right">Public Room</Label>
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
  );
};

export default CreateRoomDialog;
