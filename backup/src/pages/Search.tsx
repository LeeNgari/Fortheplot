
import React, { useState, useMemo } from 'react';
import ContentCard from '@/components/ContentCard';
import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Movie, TvShow } from '@/types/api';
import { ContentItem } from '@/types/content';
import { Skeleton } from '@/components/ui/skeleton';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery<{ movies: Movie[], tvShows: TvShow[] }, Error>({
    queryKey: ['search', searchQuery],
    queryFn: () => apiClient.get(`/search?query=${searchQuery}`).then(res => res.data),
    enabled: !!searchQuery,
  });

  const allContent = useMemo(() => {
    if (!data) return [];
    const transformedMovies: ContentItem[] = data.movies ? data.movies.map(movie => ({
      id: movie.id.toString(),
      title: movie.title,
      description: movie.description,
      duration: `${Math.floor(movie.durationSeconds / 60)}m`,
      releaseDate: movie.releaseDate,
      genre: movie.genre.split(','),
      imageUrl: movie.posterPath,
      type: 'movie' as const,
      url: `/api/media/${movie.mediaFile.id}`
    })) : [];

    const transformedTvShows: ContentItem[] = data.tvShows ? data.tvShows.map(show => ({
      id: `tv${show.id}`,
      title: show.title,
      description: show.description,
      duration: 'Multiple episodes',
      releaseDate: show.releaseDate,
      genre: show.genre.split(','),
      imageUrl: show.posterPath,
      type: 'tv' as const,
      episodes: show.episodes.map(ep => `/api/media/${ep.mediaFile.id}`)
    })) : [];

    return [...transformedMovies, ...transformedTvShows];
  }, [data]);

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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {searchQuery 
                ? `Found ${allContent.length} results` 
                : 'All Content'
              }
            </h2>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="w-full">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
              ))}
            </div>
          ) : allContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No results found</div>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {allContent.map(item => (
                <ContentCard key={item.id} content={item} size="medium" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
