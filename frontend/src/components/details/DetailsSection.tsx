
import React from 'react';
import { ContentItem } from '@/types/content';
import { Play } from 'lucide-react';

interface DetailsSectionProps {
  content: ContentItem;
  onWatch: (episodeIndex: number) => void;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ content, onWatch }) => {
  return (
    <div className="md:col-span-2 space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          {content.description}
        </p>
      </div>

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
                    onClick={() => onWatch(index)}
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
  );
};

export default DetailsSection;
