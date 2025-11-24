
import React, { useState, useMemo } from 'react';
import ContentCard from '@/components/ContentCard';
import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Movie, TVShow, Episode } from '@/types/content';
import { ContentItem } from '@/types/content';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchData, isLoading: isSearchLoading } = useQuery<{ movies: Movie[], tvShows: TVShow[] }, Error>({
    queryKey: ['search', searchQuery],
    queryFn: () => apiClient.get(`/search?query=${searchQuery}`).then(res => res.data),
    enabled: !!searchQuery,
  });

  const { data: movies, isLoading: moviesLoading } = useQuery<Movie[], Error>({ 
    queryKey: ['movies'], 
    queryFn: () => apiClient.get('/movies').then(res => res.data.content) 
  });

  const { data: tvShows, isLoading: tvShowsLoading } = useQuery<TVShow[], Error>({ 
    queryKey: ['tvShows'], 
    queryFn: () => apiClient.get('/tvshows').then(res => res.data.content) 
  });

 
  const transformMovies = (movies: Movie[] | undefined): ContentItem[] => {
    if (!movies) return [];
    return movies.map(movie => ({
      id: movie.id.toString(),
      title: movie.title,
      description: movie.description,
      duration: `${Math.floor(movie.durationSeconds / 60)}m`,
      releaseDate: movie.releaseDate,
      genre: movie.genre,
      posterPath: movie.posterPath,
      type: 'movie' as const,
      url: `/api/media/${movie.mediaFile.id}`
    }));
  };

  const transformTvShows = (tvShows: TVShow[] | undefined): ContentItem[] => {
    if (!tvShows) return [];
    return tvShows.map(show => ({
      id: `tv${show.id}`,
      title: show.title,
      description: show.description,
      duration: show.episodes && show.episodes.length > 0
        ? `${show.episodes.length} episodes`
        : 'N/A',
      releaseDate: show.releaseDate,
      genre: show.genre,
      posterPath: show.posterPath,
      type: 'tv' as const,
      episodes: show.episodes,
    }));
  };

  const searchContent = useMemo(() => {
    if (!searchData) return [];
    return [...transformMovies(searchData.movies), ...transformTvShows(searchData.tvShows)];
  }, [searchData]);

  const allMovies = useMemo(() => transformMovies(movies), [movies]);
  const allTvShows = useMemo(() => transformTvShows(tvShows), [tvShows]);

  const isLoading = isSearchLoading || (moviesLoading && tvShowsLoading && !searchQuery);

  return (
    <div className="min-h-screen bg-gray-950 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">Search</h1>
          
          {/* Search Controls */}
          <div className="space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search movies and TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="w-full flex justify-center items-center h-64">
              <Loader2 className="h-16 w-16 animate-spin text-red-500" />
            </div>
          ) : searchQuery ? (
            <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {`Found ${searchContent.length} results`}
              </h2>
              <button
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Clear search
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {searchContent.map(item => (
                <ContentCard key={item.id} content={item} size="medium" />
              ))}
            </div>
            </>
          ) : (
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="tv-shows">TV Shows</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {[...allMovies, ...allTvShows].map(item => (
                    <ContentCard key={item.id} content={item} size="medium" />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="movies">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {allMovies.map(item => (
                    <ContentCard key={item.id} content={item} size="medium" />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="tv-shows">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {allTvShows.map(item => (
                    <ContentCard key={item.id} content={item} size="medium" />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
