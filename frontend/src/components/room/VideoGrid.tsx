import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, X, Maximize2 } from 'lucide-react';

interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

interface VideoGridProps {
  localStream: MediaStream | null;
  peers: PeerConnection[];
  onToggleVideo: () => void;
  onToggleAudio: () => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ localStream, peers, onToggleVideo, onToggleAudio }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    onToggleAudio();
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    onToggleVideo();
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg transition-colors"
        title="Show video overlay"
      >
        <Maximize2 size={20} className="text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-4 z-50">
      {/* Local Video */}
      <div className="relative w-48 h-36 bg-gray-900 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-full ${isAudioEnabled ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
          >
            {isAudioEnabled ? <Mic size={16} className="text-white" /> : <MicOff size={16} className="text-white" />}
          </button>
          <button
            onClick={handleToggleVideo}
            className={`p-2 rounded-full ${isVideoEnabled ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
          >
            {isVideoEnabled ? <Video size={16} className="text-white" /> : <VideoOff size={16} className="text-white" />}
          </button>
        </div>
        <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded text-xs text-white">
          You
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded transition-colors"
          title="Hide video overlay"
        >
          <X size={16} className="text-white" />
        </button>
      </div>

      {/* Remote Videos */}
      {peers.map((peer) => (
        <RemoteVideo key={peer.peerId} peer={peer} />
      ))}
    </div>
  );
};

const RemoteVideo: React.FC<{ peer: PeerConnection }> = ({ peer }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream]);

  return (
    <div className="relative w-48 h-36 bg-gray-900 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded text-xs text-white">
        User {peer.peerId}
      </div>
    </div>
  );
};

export default VideoGrid;
