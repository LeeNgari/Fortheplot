
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Movie } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';

interface MovieFormProps {
  editingMovie: Movie | null;
  onClose: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ editingMovie, onClose }) => {
  const queryClient = useQueryClient();
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    releaseDate: '',
    durationSeconds: '',
    genre: '',
    posterPath: '',
    movieFile: null as File | null,
  });

  useEffect(() => {
    if (editingMovie) {
      setMovieForm({
        title: editingMovie.title,
        description: editingMovie.description,
        releaseDate: editingMovie.releaseDate,
        durationSeconds: editingMovie.durationSeconds.toString(),
        genre: editingMovie.genre,
        posterPath: editingMovie.posterPath,
        movieFile: null,
      });
    } else {
      setMovieForm({
        title: '',
        description: '',
        releaseDate: '',
        durationSeconds: '',
        genre: '',
        posterPath: '',
        movieFile: null,
      });
    }
  }, [editingMovie]);

  const createMovieMutation = useMutation<Movie, Error, FormData>({
    mutationFn: (newMovie) => apiClient.post('/movies', newMovie, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      onClose();
    },
  });

  const updateMovieMutation = useMutation<Movie, Error, { id: number, data: FormData }>({
    mutationFn: ({ id, data }) => apiClient.put(`/movies/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      onClose();
    },
  });

  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('metadata', JSON.stringify({
      title: movieForm.title,
      description: movieForm.description,
      releaseDate: movieForm.releaseDate,
      durationSeconds: parseInt(movieForm.durationSeconds),
      genre: movieForm.genre,
      posterPath: movieForm.posterPath,
    }));
    if (movieForm.movieFile) {
      formData.append('file', movieForm.movieFile);
    }

    if (editingMovie) {
      updateMovieMutation.mutate({ id: editingMovie.id, data: formData });
    } else {
      createMovieMutation.mutate(formData);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">
        {editingMovie ? 'Edit Movie' : 'Add New Movie'}
      </h3>
      <form onSubmit={handleMovieSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="movie-title" className="text-white">Title</Label>
          <Input
            id="movie-title"
            value={movieForm.title}
            onChange={(e) => setMovieForm({...movieForm, title: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="movie-duration" className="text-white">Duration (seconds)</Label>
          <Input
            id="movie-duration"
            type="number"
            value={movieForm.durationSeconds}
            onChange={(e) => setMovieForm({...movieForm, durationSeconds: e.target.value})}
            placeholder="e.g., 6540 (seconds)"
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="movie-release" className="text-white">Release Date</Label>
          <Input
            id="movie-release"
            type="date"
            value={movieForm.releaseDate}
            onChange={(e) => setMovieForm({...movieForm, releaseDate: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="movie-genre" className="text-white">Genre</Label>
          <Input
            id="movie-genre"
            value={movieForm.genre}
            onChange={(e) => setMovieForm({...movieForm, genre: e.target.value})}
            placeholder="e.g., Action, Thriller"
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="movie-description" className="text-white">Description</Label>
          <Textarea
            id="movie-description"
            value={movieForm.description}
            onChange={(e) => setMovieForm({...movieForm, description: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            rows={3}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="movie-file" className="text-white">Movie File</Label>
          <Input
            id="movie-file"
            type="file"
            onChange={(e) => setMovieForm({...movieForm, movieFile: e.target.files ? e.target.files[0] : null})}
            className="bg-gray-700 border-gray-600 text-white"
            required={!editingMovie}
          />
        </div>
        
        <div>
          <Label htmlFor="movie-poster" className="text-white">Poster Image URL</Label>
          <Input
            id="movie-poster"
            value={movieForm.posterPath}
            onChange={(e) => setMovieForm({...movieForm, posterPath: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div className="md:col-span-2 flex gap-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            {editingMovie ? 'Update Movie' : 'Add Movie'}
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

export default MovieForm;
