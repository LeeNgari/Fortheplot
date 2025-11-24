
import React, { useRef, useEffect, useState } from 'react';
import { Maximize, Minimize, Play, Pause } from 'lucide-react';

interface VideoPlayerComponentProps {
  src: string;
  title: string;
  onClose: () => void;
}

const VideoPlayerComponent: React.FC<VideoPlayerComponentProps> = ({ src, title, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
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

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={src}
        title={title}
        controls={false} // Custom controls
        className="w-full h-full object-contain"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center justify-between">
        <button onClick={togglePlay} className="text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={toggleFullScreen} className="text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50">
          {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayerComponent;
