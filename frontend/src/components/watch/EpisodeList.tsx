
import React from 'react';
import { Play } from 'lucide-react';
import { ContentItem } from '@/types/content';

interface EpisodeListProps {
  content: ContentItem;
  selectedEpisode: number;
  onSelectEpisode: (index: number) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ content, selectedEpisode, onSelectEpisode }) => {
  if (content.type !== 'tv' || !content.episodes || content.episodes.length === 0) {
    return null;
  }

  return (
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
              onClick={() => onSelectEpisode(index)}
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
  );
};

export default EpisodeList;
