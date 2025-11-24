
import React, { useRef, useState, useEffect } from 'react';
import { Maximize, Minimize, Play, Pause, X } from 'lucide-react';

interface FloatingVideoPlayerProps {
  src: string | null;
  title: string;
  onClose: () => void;
  onMaximize?: () => void;
}

const FloatingVideoPlayer: React.FC<FloatingVideoPlayerProps> = ({ src, title, onClose, onMaximize }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    if (videoRef.current && src) {
      videoRef.current.src = src;
      videoRef.current.play();
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
      setIsPlaying(false);
    }
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    } else if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  if (!src) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 bg-black rounded-lg shadow-lg overflow-hidden transition-all duration-300 
        ${isMinimized ? 'w-96 h-56' : 'w-full h-full inset-0'}`}
    >
      <video
        ref={videoRef}
        title={title}
        controls={false}
        className="w-full h-full object-contain"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={onClose}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button onClick={togglePlay} className="text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={handleMaximize} className="text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50">
          {isMinimized ? <Maximize size={20} /> : <Minimize size={20} />}
        </button>
        <button onClick={onClose} className="text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50">
          <X size={20} />
        </button>
      </div>
      {!isMinimized && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center justify-between">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default FloatingVideoPlayer;
