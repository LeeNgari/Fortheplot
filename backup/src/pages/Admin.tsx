
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit } from 'lucide-react';
import apiClient from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Movie, TvShow } from '@/types/api';

const Admin: React.FC = () => {
  const queryClient = useQueryClient();
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [showTVForm, setShowTVForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingTV, setEditingTV] = useState<TvShow | null>(null);

  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    releaseDate: '',
    durationSeconds: '',
    genre: '',
    posterPath: '',
    movieFile: null as File | null,
  });

  const [tvForm, setTVForm] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    posterPath: '',
    episodes: '' as string | File[],
  });

  const { data: moviesData, isLoading: moviesLoading, error: moviesError } = useQuery<Movie[], Error>({
    queryKey: ['movies'],
    queryFn: () => apiClient.get('/movies').then(res => res.data.content),
  });

  const { data: tvShowsData, isLoading: tvShowsLoading, error: tvShowsError } = useQuery<TvShow[], Error>({
    queryKey: ['tvshows'],
    queryFn: () => apiClient.get('/tvshows').then(res => res.data.content),
  });

  const createMovieMutation = useMutation<Movie, Error, FormData>({
    mutationFn: (newMovie) => apiClient.post('/movies', newMovie, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      setShowMovieForm(false);
      setEditingMovie(null);
      setMovieForm({
        title: '',
        description: '',
        releaseDate: '',
        durationSeconds: '',
        genre: '',
        posterPath: '',
        movieFile: null,
      });
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
      setShowMovieForm(false);
      setEditingMovie(null);
      setMovieForm({
        title: '',
        description: '',
        releaseDate: '',
        durationSeconds: '',
        genre: '',
        posterPath: '',
        movieFile: null,
      });
    },
  });

  const deleteMovieMutation = useMutation<void, Error, number>({
    mutationFn: (id) => apiClient.delete(`/movies/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });

  const createTvShowMutation = useMutation<TvShow, Error, FormData>({
    mutationFn: (newTvShow) => apiClient.post('/tvshows', newTvShow, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tvshows'] });
      setShowTVForm(false);
      setEditingTV(null);
      setTVForm({
        title: '',
        description: '',
        releaseDate: '',
        genre: '',
        posterPath: '',
        episodes: '',
      });
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
      setShowTVForm(false);
      setEditingTV(null);
      setTVForm({
        title: '',
        description: '',
        releaseDate: '',
        genre: '',
        posterPath: '',
        episodes: '',
      });
    },
  });

  const deleteTvShowMutation = useMutation<void, Error, number>({
    mutationFn: (id) => apiClient.delete(`/tvshows/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tvshows'] });
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

  const editMovie = (movie: Movie) => {
    setMovieForm({
      title: movie.title,
      description: movie.description,
      releaseDate: movie.releaseDate,
      durationSeconds: movie.durationSeconds.toString(),
      genre: movie.genre,
      posterPath: movie.posterPath,
      movieFile: null,
    });
    setEditingMovie(movie);
    setShowMovieForm(true);
  };

  const editTV = (show: TvShow) => {
    setTVForm({
      title: show.title,
      description: show.description,
      releaseDate: show.releaseDate,
      genre: show.genre,
      posterPath: show.posterPath,
      episodes: [], // Cannot pre-populate file input for security reasons
    });
    setEditingTV(show);
    setShowTVForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Panel</h1>
        
        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-800">
            <TabsTrigger value="movies" className="data-[state=active]:bg-red-600">Movies</TabsTrigger>
            <TabsTrigger value="tv" className="data-[state=active]:bg-red-600">TV Shows</TabsTrigger>
          </TabsList>
          
          <TabsContent value="movies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Movies</h2>
              <Button 
                onClick={() => setShowMovieForm(!showMovieForm)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </div>

            {showMovieForm && (
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
                      onClick={() => {
                        setShowMovieForm(false);
                        setEditingMovie(null);
                        setMovieForm({
                          title: '',
                          description: '',
                          releaseDate: '',
                          durationSeconds: '',
                          genre: '',
                          posterPath: '',
                          movieFile: null,
                        });
                      }}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {moviesLoading && <p className="text-white">Loading movies...</p>}
            {moviesError && <p className="text-red-500">Error loading movies: {moviesError.message}</p>}
            {moviesData && moviesData.length > 0 ? (
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
                    {moviesData.map((movie) => (
                      <TableRow key={movie.id} className="border-gray-700">
                        <TableCell className="text-white">{movie.title}</TableCell>
                        <TableCell className="text-gray-300">{`${Math.floor(movie.durationSeconds / 60)}m`}</TableCell>
                        <TableCell className="text-gray-300">{movie.releaseDate}</TableCell>
                        <TableCell className="text-gray-300">{movie.genre}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => editMovie(movie)}
                              className="border-gray-600 text-white hover:bg-gray-700"
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
            ) : (
              !moviesLoading && <p className="text-white">No movies found.</p>
            )}
          </TabsContent>
          
          <TabsContent value="tv" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage TV Shows</h2>
              <Button 
                onClick={() => setShowTVForm(!showTVForm)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add TV Show
              </Button>
            </div>

            {showTVForm && (
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
                      onClick={() => {
                        setShowTVForm(false);
                        setEditingTV(null);
                        setTVForm({
                          title: '',
                          description: '',
                          releaseDate: '',
                          genre: '',
                          posterPath: '',
                          episodes: '',
                        });
                      }}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {tvShowsLoading && <p className="text-white">Loading TV shows...</p>}
            {tvShowsError && <p className="text-red-500">Error loading TV shows: {tvShowsError.message}</p>}
            {tvShowsData && tvShowsData.length > 0 ? (
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
                    {tvShowsData.map((show) => (
                      <TableRow key={show.id} className="border-gray-700">
                        <TableCell className="text-white">{show.title}</TableCell>
                        <TableCell className="text-gray-300">{show.episodes.length}</TableCell>
                        <TableCell className="text-gray-300">{show.releaseDate}</TableCell>
                        <TableCell className="text-gray-300">{show.genre}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => editTV(show)}
                              className="border-gray-600 text-white hover:bg-gray-700"
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
            ) : (
              !tvShowsLoading && <p className="text-white">No TV shows found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
