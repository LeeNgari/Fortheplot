import React from 'react';
import { X } from 'lucide-react';

interface IntegratedVideoPlayerProps {
  src: string;
  title: string;
  onClose: () => void;
}

const IntegratedVideoPlayer: React.FC<IntegratedVideoPlayerProps> = ({ src, title, onClose }) => {
  return (
    <div className="relative w-[65%] h-[70vh] bg-black mx-auto my-auto rounded-lg p-4 flex items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      <video 
        src={src}
        title={title}
        controls
        autoPlay
        className="w-full h-full object-contain rounded-md"
      />
    </div>
  );
};

export default IntegratedVideoPlayer;
