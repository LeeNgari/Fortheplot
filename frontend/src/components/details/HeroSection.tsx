import React from 'react';
import { ArrowLeft, Play, Star, Calendar, Clock, Film, Tv, Plus, Heart } from 'lucide-react';
import { ContentItem } from '@/types/content';

interface HeroSectionProps {
  content: ContentItem;
  onBack: () => void;
  onWatch: () => void;
  isPlayerActive?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ content, onBack, onWatch, isPlayerActive }) => {
  return (
    <div className={`relative overflow-hidden ${isPlayerActive ? 'h-auto py-4' : 'h-[70vh]'}`}>
      {!isPlayerActive && (
        <div className="absolute inset-0 pt-16 px-16">
          <img 
            src={content.posterPath} 
            alt={content.title}
            className="w-full h-full object-cover object-center rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/50 to-transparent"></div>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 p-8 z-10 ${isPlayerActive ? 'relative !p-4' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
            {content.title}
          </h1>
          
          {!isPlayerActive && (
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
          )}

          {!isPlayerActive && (
            <div className="flex gap-4 flex-wrap">
              <button 
                onClick={onWatch}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;