import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Movie, TVShow } from '@/types/content';
import MovieList from '@/components/admin/MovieList';
import TVShowList from '@/components/admin/TVShowList';
import MovieForm from '@/components/admin/MovieForm';
import TVShowForm from '@/components/admin/TVShowForm';

const Admin: React.FC = () => {
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [showTVForm, setShowTVForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingTV, setEditingTV] = useState<TVShow | null>(null);

  const { data: moviesData, isLoading: moviesLoading, error: moviesError } = useQuery<Movie[], Error>({
    queryKey: ['movies'],
    queryFn: () => apiClient.get('/movies').then(res => res.data.content),
  });

  const { data: tvShowsData, isLoading: tvShowsLoading, error: tvShowsError } = useQuery<TVShow[], Error>({
    queryKey: ['tvshows'],
    queryFn: () => apiClient.get('/tvshows').then(res => {
      return res.data.content}),
  });

  console.log(tvShowsData)
  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setShowMovieForm(true);
  };

  const handleEditTV = (tvShow: TVShow) => {
    setEditingTV(tvShow);
    setShowTVForm(true);
  };

  const handleCloseForms = () => {
    setShowMovieForm(false);
    setEditingMovie(null);
    setShowTVForm(false);
    setEditingTV(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-10">Admin Panel</h1>
        
        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-800 mb-8">
            <TabsTrigger value="movies" className="data-[state=active]:bg-red-600">Movies</TabsTrigger>
            <TabsTrigger value="tv" className="data-[state=active]:bg-red-600">TV Shows</TabsTrigger>
          </TabsList>
          
          <TabsContent value="movies" className="space-y-6 p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Movies</h2>
              <Button 
                onClick={() => {
                  setEditingMovie(null);
                  setShowMovieForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {showMovieForm && (
              <MovieForm 
                editingMovie={editingMovie}
                onClose={handleCloseForms}
              />
            )}

            {moviesLoading && <p className="text-white">Loading movies...</p>}
            {moviesError && <p className="text-red-500">Error loading movies: {moviesError.message}</p>}
            {moviesData && moviesData.length > 0 ? (
              <MovieList movies={moviesData} onEdit={handleEditMovie} />
            ) : (
              !moviesLoading && <p className="text-white">No movies found.</p>
            )}
          </TabsContent>
          
          <TabsContent value="tv" className="space-y-6 p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage TV Shows</h2>
              <Button 
                onClick={() => {
                  setEditingTV(null);
                  setShowTVForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {showTVForm && (
              <TVShowForm 
                editingTV={editingTV}
                onClose={handleCloseForms}
              />
            )}

            {tvShowsLoading && <p className="text-white">Loading TV shows...</p>}
            {tvShowsError && <p className="text-red-500">Error loading TV shows: {tvShowsError.message}</p>}
            {tvShowsData && tvShowsData.length > 0 ? (
              <TVShowList tvShows={tvShowsData} onEdit={handleEditTV} />
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