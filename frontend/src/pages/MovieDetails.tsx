
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { ContentItem, Movie, TVShow } from '@/types/content';
import { Loader2 , ArrowLeft} from 'lucide-react';
import HeroSection from '@/components/details/HeroSection';
import DetailsSection from '@/components/details/DetailsSection';
import DetailsSidebar from '@/components/details/DetailsSidebar';
import { useParams, useNavigate } from 'react-router-dom';
import IntegratedVideoPlayer from '@/components/details/IntegratedVideoPlayer';

interface MovieDetailsProps {
  onPlayVideo: (src: string, title: string) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ onPlayVideo }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  console.log("MovieDetails - id from useParams:", id);

  const { data: movie, isLoading: movieLoading } = useQuery<Movie, Error>({
    queryKey: ['movie', id],
    queryFn: async () => {
      console.log("Fetching movie with id:", id);
      const response = await apiClient.get(`/movies/${id}`);
      console.log("Movie API response:", response.data);
      return response.data;
    },
    enabled: !!id && !id.startsWith('tv'),
  });

  const { data: tvShow, isLoading: tvShowLoading } = useQuery<TVShow, Error>({
    queryKey: ['tvShow', id],
    queryFn: async () => {
      console.log("Fetching TV show with id:", id);
      const response = await apiClient.get(`/tvshows/${id?.substring(2)}`);
      console.log("TV Show API response:", response.data);
      return response.data;
    },
    enabled: !!id && id.startsWith('tv'),
  });

  useEffect(() => {
    console.log("MovieDetails - useEffect triggered. Movie:", movie, "TV Show:", tvShow);
    if (movie) {
      setContent({
        id: movie.id.toString(),
        title: movie.title,
        description: movie.description,
        duration: `${Math.floor(movie.durationSeconds / 60)}m`,
        releaseDate: movie.releaseDate,
        genre: movie.genre,
        posterPath: movie.posterPath,
        type: 'movie',
        url: `/api/media/${movie.mediaFile.id}`,
      });
      setShowVideoPlayer(false); // Reset when content changes
      console.log("Content set from movie:", movie);
    } else if (tvShow) {
      setContent({
        id: tvShow.id.toString(),
        title: tvShow.title,
        description: tvShow.description,
        duration: 'Multiple episodes',
        releaseDate: tvShow.releaseDate,
        genre: tvShow.genre,
        posterPath: tvShow.posterPath,
        type: 'tv',
        episodes: tvShow.episodes,
      });
      setShowVideoPlayer(false); // Reset when content changes
      console.log("Content set from TV show:", tvShow);
    }
  }, [movie, tvShow, id]);

  const isLoading = movieLoading || tvShowLoading;

  console.log("MovieDetails - isLoading:", isLoading, "Content:", content);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-24 w-24 animate-spin text-red-500" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950 to-gray-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Content not found</h2>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-300"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleWatch = (episodeIndex?: number) => {
    if (episodeIndex !== undefined) {
      setSelectedEpisode(episodeIndex);
    }
    setShowVideoPlayer(true);
  };

  const videoSrc = content.type === 'movie' && content.url 
    ? `http://localhost:4000${content.url}`
    : content.type === 'tv' && content.episodes && content.episodes.length > 0
    ? `http://localhost:4000/api/media/${content.episodes[selectedEpisode ?? 0].mediaFile.id}`
    : undefined;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/10 hover:bg-black/60"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {showVideoPlayer && videoSrc && (
        <IntegratedVideoPlayer 
          src={videoSrc}
          title={content.title}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}

      <HeroSection 
        content={content} 
        onBack={() => navigate('/home')} 
        onWatch={handleWatch} 
        isPlayerActive={showVideoPlayer}
      />

      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <DetailsSection content={content} onWatch={handleWatch} />
            <DetailsSidebar content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
