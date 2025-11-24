
import React from 'react';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ genres, selectedGenre, onSelectGenre }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {genres.map(genre => (
        <button
          key={genre}
          onClick={() => onSelectGenre(genre)}
          className={`px-6 py-2 rounded-full transition-all duration-200 ${
            selectedGenre === genre
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
