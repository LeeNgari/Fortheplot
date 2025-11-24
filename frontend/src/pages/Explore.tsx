import React, { useState, useMemo } from 'react';
import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Movie, TVShow } from '@/types/content';
import { ContentItem } from '@/types/content';
import GenreFilter from '@/components/explore/GenreFilter';
import ContentGrid from '@/components/explore/ContentGrid';

const Explore: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const { data: movies, isLoading: moviesLoading } = useQuery<Movie[], Error>({ 
    queryKey: ['movies'], 
    queryFn: () => apiClient.get('/movies').then(res => res.data.content) 
  });

  const { data: tvShows, isLoading: tvShowsLoading } = useQuery<TVShow[], Error>({ 
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
      genre: movie.genre,
      posterPath: movie.posterPath,
      type: 'movie' as const,
      url: `/api/media/${movie.mediaFile.id}`
    })) : [];

    const transformedTvShows: ContentItem[] = tvShows ? tvShows.map(show => ({
      id: show.id.toString(),
      title: show.title,
      description: show.description,
      duration: 'Multiple episodes',
      releaseDate: show.releaseDate,
      genre: show.genre,
      posterPath: show.posterPath,
      type: 'tv' as const,
      episodes: show.episodes,
    })) : [];

    return [...transformedMovies, ...transformedTvShows];
  }, [movies, tvShows]);

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    allContent.forEach(item => {
      if (Array.isArray(item.genre)) {
        item.genre.forEach(g => genres.add(g));
      } else if (typeof item.genre === 'string') {
        genres.add(item.genre);
      }
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">Explore</h1>
          <p className="text-gray-400 text-lg mb-8">Discover movies and TV shows by genre</p>
          
          <GenreFilter 
            genres={allGenres} 
            selectedGenre={selectedGenre} 
            onSelectGenre={setSelectedGenre} 
          />
        </div>

        <ContentGrid 
          content={filteredContent} 
          isLoading={isLoading} 
          selectedGenre={selectedGenre} 
        />
      </div>
    </div>
  );
};

export default Explore;