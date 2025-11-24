
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TvShow } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';

interface TVShowFormProps {
  editingTV: TvShow | null;
  onClose: () => void;
}

const TVShowForm: React.FC<TVShowFormProps> = ({ editingTV, onClose }) => {
  const queryClient = useQueryClient();
  const [tvForm, setTVForm] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    posterPath: '',
    episodes: '' as string | File[],
  });

  useEffect(() => {
    if (editingTV) {
      setTVForm({
        title: editingTV.title,
        description: editingTV.description,
        releaseDate: editingTV.releaseDate,
        genre: editingTV.genre,
        posterPath: editingTV.posterPath,
        episodes: [], // Cannot pre-populate file input for security reasons
      });
    } else {
      setTVForm({
        title: '',
        description: '',
        releaseDate: '',
        genre: '',
        posterPath: '',
        episodes: '',
      });
    }
  }, [editingTV]);

  const createTvShowMutation = useMutation<TvShow, Error, FormData>({
    mutationFn: (newTvShow) => apiClient.post('/tvshows', newTvShow, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tvshows'] });
      onClose();
    },
  });

  const updateTvShowMutation = useMutation<TvShow, Error, { id: number, data: FormData }>({
    mutationFn: ({ id, data }) => apiClient.put(`/tvshows/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tvshows'] });
      onClose();
    },
  });

  const handleTVSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const episodesArray = (tvForm.episodes as File[]).map((file, index) => ({
      title: `Episode ${index + 1}`,
      episodeNumber: index + 1,
      durationSeconds: 1800, // Default to 30 minutes
    }));

    formData.append('metadata', JSON.stringify({
      title: tvForm.title,
      description: tvForm.description,
      releaseDate: tvForm.releaseDate,
      genre: tvForm.genre,
      posterPath: tvForm.posterPath,
      episodes: episodesArray,
    }));

    if (Array.isArray(tvForm.episodes)) {
      tvForm.episodes.forEach(file => {
        formData.append('files', file);
      });
    }

    if (editingTV) {
      updateTvShowMutation.mutate({ id: editingTV.id, data: formData });
    } else {
      createTvShowMutation.mutate(formData);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">
        {editingTV ? 'Edit TV Show' : 'Add New TV Show'}
      </h3>
      <form onSubmit={handleTVSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tv-title" className="text-white">Title</Label>
          <Input
            id="tv-title"
            value={tvForm.title}
            onChange={(e) => setTVForm({...tvForm, title: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="tv-release" className="text-white">Release Date</Label>
          <Input
            id="tv-release"
            type="date"
            value={tvForm.releaseDate}
            onChange={(e) => setTVForm({...tvForm, releaseDate: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="tv-genre" className="text-white">Genre</Label>
          <Input
            id="tv-genre"
            value={tvForm.genre}
            onChange={(e) => setTVForm({...tvForm, genre: e.target.value})}
            placeholder="e.g., Comedy, Drama"
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="tv-description" className="text-white">Description</Label>
          <Textarea
            id="tv-description"
            value={tvForm.description}
            onChange={(e) => setTVForm({...tvForm, description: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            rows={3}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="tv-image" className="text-white">Poster Image URL</Label>
          <Input
            id="tv-image"
            value={tvForm.posterPath}
            onChange={(e) => setTVForm({...tvForm, posterPath: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="tv-episodes" className="text-white">Episode Files</Label>
          <Input
            id="tv-episodes"
            type="file"
            multiple
            onChange={(e) => setTVForm({...tvForm, episodes: Array.from(e.target.files || [])})}
            className="bg-gray-700 border-gray-600 text-white"
            required={!editingTV}
          />
        </div>
        
        <div className="md:col-span-2 flex gap-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            {editingTV ? 'Update TV Show' : 'Add TV Show'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TVShowForm;
