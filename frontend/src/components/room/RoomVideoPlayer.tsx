import React, { useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Fullscreen, Minimize } from 'lucide-react';
import { Room as ApiRoom } from '@/types/api';

interface RoomVideoPlayerProps {
  room: ApiRoom;
  moviePlayerRef: React.RefObject<HTMLVideoElement>;
  onPlay: () => void;
  onPause: () => void;
  isHost: boolean;
  isAdmin: boolean;
}

const RoomVideoPlayer: React.FC<RoomVideoPlayerProps> = ({
  room,
  moviePlayerRef,
  onPlay,
  onPause,
  isHost,
  isAdmin,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  // Sync UI state with actual video playback state
  useEffect(() => {
    const video = moviePlayerRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [moviePlayerRef]);

  const handlePlayPause = () => {
    if (isHost || isAdmin) {
      // For host/admin: Only send WebSocket message
      // The video will be controlled by the incoming WebSocket response
      // This prevents double-triggering and ensures all users (including host) sync the same way
      if (isPlaying) {
        onPause();
      } else {
        onPlay();
      }
    }
  };

  const handleMuteToggle = () => {
    if (moviePlayerRef.current) {
      moviePlayerRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullScreenToggle = () => {
    if (moviePlayerRef.current) {
      if (isFullScreen) {
        document.exitFullscreen();
      } else {
        moviePlayerRef.current.requestFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  const videoSrc = room.movie?.mediaFile?.id ? `http://localhost:4000/api/media/${room.movie.mediaFile.id}` : undefined;

  return (
    <div className="relative h-[70vh] bg-black rounded-lg p-4 flex items-center justify-center w-full">
      {!videoSrc && <p className="text-white">No movie selected for this room.</p>}
      {videoSrc && (
        <video
          ref={moviePlayerRef}
          src={videoSrc}
          title={room.movie?.title || 'Room Video'}
          className="w-full h-full object-contain rounded-md"
          muted={true}
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(isHost || isAdmin) && (
            <button onClick={handlePlayPause} className="text-white">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          )}
          <button onClick={handleMuteToggle} className="text-white">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
        <button onClick={handleFullScreenToggle} className="text-white">
          {isFullScreen ? <Minimize size={24} /> : <Fullscreen size={24} />}
        </button>
      </div>
    </div>
  );
};

export default RoomVideoPlayer;
