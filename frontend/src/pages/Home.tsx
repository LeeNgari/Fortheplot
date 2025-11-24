import React from 'react';
import FeaturedHero from '@/components/FeaturedHero';
import HorizontalScroll from '@/components/HorizontalScroll';
import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { ContentItem, Movie } from '@/types/content';
import { Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['homePageData'],
    queryFn: async () => {
      const [featured, trending, popular, recent] = await Promise.all([
        apiClient.get('/movies/featured').then(res => res.data),
        apiClient.get('/movies/trending').then(res => res.data),
        apiClient.get('/movies/popular').then(res => res.data),
        apiClient.get('/movies/recent').then(res => res.data),
      ]);
      return { featured, trending, popular, recent };
    },
  });

  const transformContent = (movies: Movie[] | undefined): ContentItem[] => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-24 w-24 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <FeaturedHero content={transformContent(data?.featured)} />
      
      <div className="pb-20 space-y-16 px-4 lg:px-8">
        <HorizontalScroll 
          title="Trending Now" 
          content={transformContent(data?.trending)}
          cardSize="medium"
        />
        
        <HorizontalScroll 
          title="Popular Movies" 
          content={transformContent(data?.popular)}
          cardSize="medium"
        />
        
        <HorizontalScroll 
          title="Recently Added"
          content={transformContent(data?.recent)}
          cardSize="medium"
        />
      </div>
    </div>
  );
};

export default Home;
