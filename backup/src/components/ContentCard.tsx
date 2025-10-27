
import React from 'react';
import { ContentItem } from '@/types/content';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  content: ContentItem;
  size?: 'small' | 'medium' | 'large';
  onNavigate?: (section: string, contentId: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, size = 'medium', onNavigate }) => {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate('details', content.id);
    } else {
      // Fallback to opening movie URL or first episode directly
      if (content.type === 'movie' && content.url) {
        window.open(content.url, '_blank');
      } else if (content.type === 'tv' && content.episodes && content.episodes.length > 0) {
        window.open(content.episodes[0], '_blank');
      }
    }
  };

  const sizeClasses = {
    small: 'w-40 h-56',
    medium: 'w-48 h-72',
    large: 'w-56 h-80'
  };

  return (
    <div className={cn(
      "flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 relative",
      sizeClasses[size]
    )}
    onClick={handleClick}>
      <div className="relative h-full overflow-hidden rounded-xl bg-gray-800 shadow-xl group-hover:shadow-2xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-full overflow-hidden">
          <img 
            src={content.imageUrl} 
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-sm">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-600/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
              {content.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
