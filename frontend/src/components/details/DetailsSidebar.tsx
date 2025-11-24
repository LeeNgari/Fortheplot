
import React from 'react';
import { ContentItem } from '@/types/content';

interface DetailsSidebarProps {
  content: ContentItem;
}

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ content }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Genres</h3>
        <div className="flex flex-wrap gap-3">
            <span 
              className="px-4 py-2 bg-red-600/20 text-red-300 text-sm rounded-full border border-red-600/30"
            >
              {content.genre}
            </span>
      
        </div>
      </div>

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
  );
};

export default DetailsSidebar;
