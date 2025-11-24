
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Movie } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { format } from 'date-fns';

interface MovieListProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onEdit }) => {
  const queryClient = useQueryClient();

  const deleteMovieMutation = useMutation<void, Error, number>({
    mutationFn: (id) => apiClient.delete(`/movies/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-white">Title</TableHead>
            <TableHead className="text-white">Duration</TableHead>
            <TableHead className="text-white">Release Date</TableHead>
            <TableHead className="text-white">Genres</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id} className="border-gray-700">
              <TableCell className="text-white">{movie.title}</TableCell>
              <TableCell className="text-gray-300">{`${Math.floor(movie.durationSeconds / 60)}m`}</TableCell>
              <TableCell className="text-gray-300">{format(new Date(movie.releaseDate), 'PPP')}</TableCell>
              <TableCell className="text-gray-300">{movie.genre}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(movie)}
                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMovieMutation.mutate(movie.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MovieList;
