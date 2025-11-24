
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { TvShow } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { format } from 'date-fns';

interface TVShowListProps {
  tvShows: TvShow[];
  onEdit: (tvShow: TvShow) => void;
}

const TVShowList: React.FC<TVShowListProps> = ({ tvShows, onEdit }) => {
  const queryClient = useQueryClient();

  const deleteTvShowMutation = useMutation<void, Error, number>({
    mutationFn: (id) => apiClient.delete(`/tvshows/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tvshows'] });
    },
  });

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-white">Title</TableHead>
            <TableHead className="text-white">Episodes</TableHead>
            <TableHead className="text-white">Release Date</TableHead>
            <TableHead className="text-white">Genres</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tvShows.map((show) => (
            <TableRow key={show.id} className="border-gray-700">
              <TableCell className="text-white">{show.title}</TableCell>
              <TableCell className="text-gray-300">{show.episodes.length}</TableCell>
              <TableCell className="text-gray-300">{format(new Date(show.releaseDate), 'PPP')}</TableCell>
              <TableCell className="text-gray-300">{show.genre}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(show)}
                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTvShowMutation.mutate(show.id)}
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

export default TVShowList;
