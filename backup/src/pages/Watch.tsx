
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { ContentItem } from '@/types/content';
import { Movie, TvShow } from '@/types/api';
import { ArrowLeft, Play, Star, Calendar, Clock, Film, Tv } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WatchProps {
  contentId?: string;
  onNavigate?: (section: string) => void;
}

const Watch: React.FC<WatchProps> = ({ contentId, onNavigate }) => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState(0);

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
        <Skeleton className="relative h-screen w-full" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
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

  const handlePlay = () => {
    if (content.type === 'movie' && content.url) {
      window.open(`http://localhost:4000${content.url}`, '_blank');
    } else if (content.type === 'tv' && content.episodes && content.episodes[selectedEpisode]) {
      window.open(`http://localhost:4000${content.episodes[selectedEpisode]}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={content.imageUrl} 
            alt={content.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              {/* Back Button */}
              <button 
                onClick={() => onNavigate?.('home')}
                className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                {content.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-6 mb-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">8.5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{content.releaseDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{content.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  {content.type === 'movie' ? <Film className="w-5 h-5" /> : <Tv className="w-5 h-5" />}
                  <span className="capitalize">{content.type}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex gap-2 mb-6">
                {content.genre.map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-white/90 text-lg leading-relaxed mb-8 max-w-xl">
                {content.description}
              </p>

              {/* Play Button */}
              <button 
                onClick={handlePlay}
                className="group flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-red-500/30"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section (for TV Shows) */}
      {content.type === 'tv' && content.episodes && content.episodes.length > 0 && (
        <div className="py-12 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Episodes</h2>
            <div className="grid gap-4">
              {content.episodes.map((episode, index) => (
                <div 
                  key={index}
                  className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedEpisode === index 
                      ? 'bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/30' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedEpisode(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        Episode {index + 1}
                      </h3>
                      <p className="text-white/60">
                        Click to select this episode
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`http://localhost:4000${episode}`, '_blank');
                      }}
                      className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    >
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
