
import React from 'react';
import ContentCard from '@/components/ContentCard';
import { ContentItem } from '@/types/content';
import { Loader2 } from 'lucide-react';

interface ContentGridProps {
  content: ContentItem[];
  isLoading: boolean;
  selectedGenre: string;
}

const ContentGrid: React.FC<ContentGridProps> = ({ content, isLoading, selectedGenre }) => {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 animate-spin text-red-500" />
      </div>
    );
  }

  const movies = content.filter(c => c.type === 'movie');
  const tvShows = content.filter(c => c.type === 'tv');

  return (
    <>
      {movies.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Movies {selectedGenre !== 'All' && `• ${selectedGenre}`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map(movie => (
              <ContentCard key={movie.id} content={movie} size="medium" />
            ))}
          </div>
        </div>
      )}

      {tvShows.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            TV Shows {selectedGenre !== 'All' && `• ${selectedGenre}`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {tvShows.map(show => (
              <ContentCard key={show.id} content={show} size="medium" />
            ))}
          </div>
        </div>
      )}

      {content.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No content found for "{selectedGenre}"</div>
          <p className="text-gray-500">Try selecting a different genre</p>
        </div>
      )}
    </>
  );
};

export default ContentGrid;
