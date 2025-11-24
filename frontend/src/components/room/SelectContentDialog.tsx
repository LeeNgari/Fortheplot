import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Movie } from '@/types/api';

interface SelectContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectContent: (contentId: number) => void;
}

const SelectContentDialog: React.FC<SelectContentDialogProps> = ({
  open,
  onOpenChange,
  onSelectContent,
}) => {
  const { data: allMovies, isLoading } = useQuery<Movie[], Error>({
    queryKey: ['allMovies'],
    queryFn: () => apiClient.get('/movies').then(res => res.data.content),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Movie or TV Show</DialogTitle>
          <DialogDescription>
            Select content to watch in this room.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto py-4">
          {isLoading && <p>Loading movies...</p>}
          {allMovies?.map((movie) => (
            <div 
              key={movie.id} 
              className="flex items-center space-x-4 p-2 border rounded-md cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectContent(movie.id)}
            >
              <img src={movie.posterPath} alt={movie.title} className="w-16 h-24 object-cover rounded-sm" />
              <div>
                <p className="font-medium">{movie.title}</p>
                <p className="text-sm text-gray-500">{movie.releaseDate}</p>
              </div>
            </div>
          ))}
          {!isLoading && allMovies?.length === 0 && (
            <p className="col-span-2 text-center text-gray-500">No movies found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectContentDialog;
