
import React, { useState, useMemo } from 'react';
import ContentCard from '@/components/ContentCard';
import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Movie, TvShow } from '@/types/api';
import { ContentItem } from '@/types/content';
import { Skeleton } from '@/components/ui/skeleton';

const Explore: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const { data: movies, isLoading: moviesLoading } = useQuery<Movie[], Error>({ 
    queryKey: ['movies'], 
    queryFn: () => apiClient.get('/movies').then(res => res.data.content) 
  });

  const { data: tvShows, isLoading: tvShowsLoading } = useQuery<TvShow[], Error>({ 
    queryKey: ['tvShows'], 
    queryFn: () => apiClient.get('/tvshows').then(res => res.data.content) 
  });

  const allContent = useMemo(() => {
    const transformedMovies: ContentItem[] = movies ? movies.map(movie => ({
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

    const transformedTvShows: ContentItem[] = tvShows ? tvShows.map(show => ({
      id: show.id.toString(),
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
  }, [movies, tvShows]);

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    allContent.forEach(item => {
      item.genre.forEach(g => genres.add(g));
    });
    return ['All', ...Array.from(genres).sort()];
  }, [allContent]);

  const filteredContent = selectedGenre === 'All' 
    ? allContent 
    : allContent.filter(item => item.genre.includes(selectedGenre));

  const isLoading = moviesLoading || tvShowsLoading;

  return (
    <div className="min-h-screen bg-gray-950 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">Explore</h1>
          <p className="text-gray-400 text-lg mb-8">Discover movies and TV shows by genre</p>
          
          {/* Genre Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {allGenres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                  selectedGenre === genre
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
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
        ) : (
          <>
            {/* Movies Section */}
            {filteredContent.filter(c => c.type === 'movie').length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Movies {selectedGenre !== 'All' && `• ${selectedGenre}`}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {filteredContent.filter(c => c.type === 'movie').map(movie => (
                    <ContentCard key={movie.id} content={movie} size="medium" />
                  ))}
                </div>
              </div>
            )}

            {/* TV Shows Section */}
            {filteredContent.filter(c => c.type === 'tv').length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  TV Shows {selectedGenre !== 'All' && `• ${selectedGenre}`}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {filteredContent.filter(c => c.type === 'tv').map(show => (
                    <ContentCard key={show.id} content={show} size="medium" />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No content found for "{selectedGenre}"</div>
                <p className="text-gray-500">Try selecting a different genre</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
