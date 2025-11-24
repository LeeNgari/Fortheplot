
import React from 'react';
import { ArrowLeft, Play, Star, Calendar, Clock, Film, Tv } from 'lucide-react';
import { ContentItem } from '@/types/content';

interface WatchHeroProps {
  content: ContentItem;
  onBack: () => void;
  onPlay: () => void;
}

const WatchHero: React.FC<WatchHeroProps> = ({ content, onBack, onPlay }) => {
  return (
    <div className="relative h-screen">
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

      <div className="relative z-10 h-full flex items-end pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <button 
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              {content.title}
            </h1>

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

            <div className="flex gap-2 mb-6">
              {content.genre.map((genre, index) => (
                <span key={index} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-white/90 text-lg leading-relaxed mb-8 max-w-xl">
              {content.description}
            </p>

            <button 
              onClick={onPlay}
              className="group flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-red-500/30"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Play Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchHero;
