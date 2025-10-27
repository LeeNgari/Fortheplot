import React from 'react';
import FeaturedHero from '@/components/FeaturedHero';
import HorizontalScroll from '@/components/HorizontalScroll';
import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Movie } from '@/types/api';

interface HomeProps {
  onNavigate?: (section: string, contentId?: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { data: featuredContent, isLoading: featuredLoading } = useQuery<Movie[], Error>({ 
    queryKey: ['featuredMovies'], 
    queryFn: () => apiClient.get('/movies/featured').then(res => res.data)
  });

  const { data: trendingContent, isLoading: trendingLoading } = useQuery<Movie[], Error>({ 
    queryKey: ['trendingMovies'], 
    queryFn: () => apiClient.get('/movies/trending').then(res => res.data)
  });

  const { data: popularContent, isLoading: popularLoading } = useQuery<Movie[], Error>({ 
    queryKey: ['popularMovies'], 
    queryFn: () => apiClient.get('/movies/popular').then(res => res.data)
  });

  const { data: recentContent, isLoading: recentLoading } = useQuery<Movie[], Error>({ 
    queryKey: ['recentMovies'], 
    queryFn: () => apiClient.get('/movies/recent').then(res => res.data)
  });

  const transformContent = (movies: Movie[] | undefined) => {
    if (!movies) return [];
    return movies.map(movie => ({
      id: movie.id.toString(),
      title: movie.title,
      description: movie.description,
      duration: `${Math.floor(movie.durationSeconds / 60)}m`,
      releaseDate: movie.releaseDate,
      genre: movie.genre.split(','),
      imageUrl: movie.posterPath,
      type: 'movie' as const,
      url: `/api/media/${movie.mediaFile.id}`
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <FeaturedHero content={transformContent(featuredContent)} onNavigate={onNavigate} />
      
      <div className="pb-20 space-y-16 px-4 lg:px-8">
        <HorizontalScroll 
          title="Trending Now" 
          content={transformContent(trendingContent)}
          cardSize="medium"
          onNavigate={onNavigate}
          loading={trendingLoading}
        />
        
        <HorizontalScroll 
          title="Popular Movies" 
          content={transformContent(popularContent)}
          cardSize="medium"
          onNavigate={onNavigate}
          loading={popularLoading}
        />
        
        <HorizontalScroll 
          title="Recently Added"
          content={transformContent(recentContent)}
          cardSize="medium"
          onNavigate={onNavigate}
          loading={recentLoading}
        />
      </div>
    </div>
  );
};

export default Home;
