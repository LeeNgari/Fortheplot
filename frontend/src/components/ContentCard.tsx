
import React from 'react';
import { ContentItem } from '@/types/content';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ContentCardProps {
  content: ContentItem;
  size?: 'small' | 'medium' | 'large';
}

const ContentCard: React.FC<ContentCardProps> = ({ content, size = 'medium' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${content.id}`);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering handleClick
    navigate(`/watch/${content.id}`);
  };

  const sizeClasses = {
    small: 'w-56',
    medium: 'w-64',
    large: 'w-72'
  };

  const imageSizeClasses = {
    small: 'h-80',
    medium: 'h-96',
    large: 'h-104'
  }

  return (
    <div className={cn(
      "flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col",
      sizeClasses[size]
    )}
    onClick={handleClick}>
      <div className={cn("relative overflow-hidden bg-gray-800 shadow-xl group", imageSizeClasses[size])}>
        {/* Image */}
        <img
          src={content.posterPath}
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
          <div
            className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-600/30 transform scale-75 group-hover:scale-100 transition-transform duration-300"
            onClick={handlePlay}
          >
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
          {content.title}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2 mt-1">
          {content.description}
        </p>
      </div>
    </div>
  );
};

export default ContentCard;
