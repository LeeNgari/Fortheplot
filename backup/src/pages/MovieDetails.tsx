
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { ContentItem } from '@/types/content';
import { Movie, TvShow } from '@/types/api';
import { ArrowLeft, Play, Star, Calendar, Clock, Film, Tv, Plus, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MovieDetailsProps {
  contentId?: string;
  onNavigate?: (section: string, contentId?: string) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ contentId, onNavigate }) => {
  const [content, setContent] = useState<ContentItem | null>(null);

  const { data: movie, isLoading: movieLoading } = useQuery<Movie, Error>({
    queryKey: ['movie', contentId],
    queryFn: () => apiClient.get(`/movies/${contentId}`).then(res => res.data),
    enabled: !!contentId && !contentId.startsWith('tv'),
  });

  const { data: tvShow, isLoading: tvShowLoading } = useQuery<TvShow, Error>({
    queryKey: ['tvShow', contentId],
    queryFn: () => apiClient.get(`/tvshows/${contentId?.substring(2)}`).then(res => res.data),
    enabled: !!contentId && contentId.startsWith('tv'),
  });

  useEffect(() => {
    if (movie) {
      setContent({
        id: movie.id.toString(),
        title: movie.title,
        description: movie.description,
        duration: `${Math.floor(movie.durationSeconds / 60)}m`,
        releaseDate: movie.releaseDate,
        genre: movie.genre.split(','),
        imageUrl: movie.posterPath,
        type: 'movie',
        url: `/api/media/${movie.mediaFile.id}`,
      });
    } else if (tvShow) {
      setContent({
        id: tvShow.id.toString(),
        title: tvShow.title,
        description: tvShow.description,
        duration: 'Multiple episodes',
        releaseDate: tvShow.releaseDate,
        genre: tvShow.genre.split(','),
        imageUrl: tvShow.posterPath,
        type: 'tv',
        episodes: tvShow.episodes.map(ep => `/api/media/${ep.mediaFile.id}`),
      });
    }
  }, [movie, tvShow]);

  const isLoading = movieLoading || tvShowLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Skeleton className="relative h-[70vh] w-full" />
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-10">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950 to-gray-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Content not found</h2>
          <button 
            onClick={() => onNavigate?.('home')}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-300"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleWatch = () => {
    onNavigate?.('watch', content.id);
  };

  return (
   <div className="min-h-screen bg-gray-950">
  {/* Hero Section */}
  <div className="relative h-[70vh] overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img 
        src={content.imageUrl} 
        alt={content.title}
        className="w-full h-full object-cover object-center"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/50 to-transparent"></div>
    </div>

    {/* Back Button */}
    <div className="absolute top-6 left-6 z-10">
      <button 
        onClick={() => onNavigate?.('home')}
        className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/10 hover:bg-black/60"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>
    </div>

    {/* Content Info */}
    <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
          {content.title}
        </h1>
        
        {/* Meta Info */}
        <div className="flex items-center gap-6 mb-6 text-white/90 flex-wrap">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-semibold">8.5</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-300" />
            <span>{content.releaseDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-300" />
            <span>{content.duration}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {content.type === 'movie' ? (
              <Film className="w-5 h-5 text-gray-300" />
            ) : (
              <Tv className="w-5 h-5 text-gray-300" />
            )}
            <span className="capitalize">{content.type}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={handleWatch}
            className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl shadow-red-600/30"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Watch Now</span>
          </button>
          
          <button 
            className="flex items-center gap-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Add to Watchlist</span>
          </button>

          <button 
            className="flex items-center gap-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            <span>Like</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Details Section */}
  <div className="py-16 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-10">
          {/* Description */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Episodes Section */}
          {content.type === 'tv' && content.episodes && content.episodes.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Episodes</h2>
              <div className="space-y-4">
                {content.episodes.map((episode, index) => (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-xl mb-2">
                          Episode {index + 1}
                        </h3>
                        <p className="text-gray-400">
                          {content.duration} • Available now
                        </p>
                      </div>
                      <button 
                        onClick={() => window.open(episode, '_blank')}
                        className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg shadow-red-600/30"
                      >
                        <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Genres */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Genres</h3>
            <div className="flex flex-wrap gap-3">
              {content.genre.map((genre, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-red-600/20 text-red-300 text-sm rounded-full border border-red-600/30"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-white/10">
                <span className="text-gray-400">Type</span>
                <span className="text-white capitalize">{content.type}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-white/10">
                <span className="text-gray-400">Release Date</span>
                <span className="text-white">{content.releaseDate}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-white/10">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{content.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rating</span>
                <span className="text-white">8.5/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default MovieDetails;
