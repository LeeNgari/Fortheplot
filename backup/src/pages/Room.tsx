
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Users, ScreenShare, Monitor, Settings } from 'lucide-react';
import { User, ScreenShareState } from '@/types/room';
import apiClient from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Room as ApiRoom } from '@/types/api';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';
import { Skeleton } from '@/components/ui/skeleton';

interface RoomProps {
  roomId?: string;
  onNavigate?: (section: string) => void;
}

interface ChatMessage {
  sender: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
}

const Room: React.FC<RoomProps> = ({ roomId, onNavigate }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<User[]>([
    {
      id: 'host-1',
      name: 'You',
      isHost: true,
      isScreenSharing: false,
    },
  ]);
  const [screenShareState, setScreenShareState] = useState<ScreenShareState>({
    isSharing: false,
    hostId: null,
    stream: null,
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const stompClient = useRef<Client | null>(null);

  const screenShareRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const moviePlayerRef = useRef<HTMLVideoElement>(null);

  const { data: room, isLoading: roomLoading, error: roomError } = useQuery<ApiRoom, Error>({
    queryKey: ['room', roomId],
    queryFn: () => apiClient.get(`/rooms/${roomId}`).then(res => res.data),
    enabled: !!roomId,
  });

  useEffect(() => {
    if (!roomId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
        });

        client.subscribe(`/topic/room/${roomId}/playback`, (message) => {
          const playbackAction = JSON.parse(message.body);
          if (moviePlayerRef.current) {
            if (playbackAction.type === 'PLAY') {
              moviePlayerRef.current.currentTime = playbackAction.position;
              moviePlayerRef.current.play();
            } else if (playbackAction.type === 'PAUSE') {
              moviePlayerRef.current.currentTime = playbackAction.position;
              moviePlayerRef.current.pause();
            }
          }
        });

        // Send join message
        client.publish({
          destination: `/app/room/${roomId}/chat`,
          body: JSON.stringify({ sender: 'User', content: 'joined the room', type: 'JOIN' }),
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.current = client;
    client.activate();

    return () => {
      if (stompClient.current?.connected) {
        // publish a leave message before disconnecting
        stompClient.current.publish({
          destination: `/app/room/${roomId}/chat`,
          body: JSON.stringify({ sender: 'User', content: 'left the room', type: 'LEAVE' }),
        });
        // deactivate the client cleanly
        stompClient.current.deactivate();
      }
    };
  }, [roomId]);

  const sendChatMessage = () => {
    if (stompClient.current?.connected && newChatMessage.trim()) {
      stompClient.current.publish({
        destination: `/app/room/${roomId}/chat`,
        body: JSON.stringify({ sender: 'User', content: newChatMessage, type: 'CHAT' }),
      });
      setNewChatMessage('');
    }
  };

  const sendPlaybackAction = (type: 'PLAY' | 'PAUSE') => {
    if (stompClient.current?.connected && moviePlayerRef.current) {
      stompClient.current.publish({
        destination: `/app/room/${roomId}/playback`,
        body: JSON.stringify({ type, position: moviePlayerRef.current.currentTime }),
      });
    }
  };

  const handleStartScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (screenShareRef.current) {
        screenShareRef.current.srcObject = stream;
      }

      setIsScreenSharing(true);
      setScreenShareState({
        isSharing: true,
        hostId: 'host-1',
        stream,
      });

      // Handle when screen sharing stops
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        handleStopScreenShare();
      });

    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const handleStopScreenShare = () => {
    if (screenShareState.stream) {
      screenShareState.stream.getTracks().forEach(track => track.stop());
    }

    setIsScreenSharing(false);
    setScreenShareState({
      isSharing: false,
      hostId: null,
      stream: null,
    });

    if (screenShareRef.current) {
      screenShareRef.current.srcObject = null;
    }
  };

  const toggleScreenShare = () => {
    if (isScreenSharing) {
      handleStopScreenShare();
    } else {
      handleStartScreenShare();
    }
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Skeleton className="h-24 w-1/2" />
      </div>
    );
  }

  if (roomError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">Error loading room: {roomError.message}</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Room not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate?.('rooms')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-light">Leave Room</span>
          </button>
          <div className="h-6 w-px bg-white/20"></div>
          <h1 className="text-xl font-light text-white">
            Room #{room.id} - {room.name}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/60">
            <Users className="w-5 h-5" />
            <span className="font-light">{participants.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {room.movie && (
            <video
              ref={moviePlayerRef}
              src={`http://localhost:4000/api/media/${room.movie.mediaFile.id}`}
              controls
              autoPlay
              className="w-full h-full object-contain"
              onPlay={() => sendPlaybackAction('PLAY')}
              onPause={() => sendPlaybackAction('PAUSE')}
            />
          )}
          {screenShareState.isSharing ? (
            <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden">
              <video
                ref={screenShareRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Screen Sharing Active
              </div>
            </div>
          ) : (
            !room.movie && (
              <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-2xl font-light text-white/60 mb-2">
                    No content selected or screen sharing active
                  </h3>
                  <p className="text-white/40 font-light">
                    Start sharing your screen or select content to watch
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Sidebar - Participants and Chat */}
        <div className="w-80 bg-white/5 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col">
          <h2 className="text-xl font-light text-white mb-6">
            Participants ({participants.length})
          </h2>

          <div className="space-y-4 mb-6">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {participant.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-light">
                      {participant.name}
                    </span>
                    {participant.isHost && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        Host
                      </span>
                    )}
                  </div>
                  {participant.isScreenSharing && (
                    <span className="text-xs text-green-400">
                      Sharing screen
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col bg-white/5 rounded-xl border border-white/10 p-4">
            <h3 className="text-white font-light mb-4">Chat</h3>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className="text-sm">
                  {msg.type === 'JOIN' || msg.type === 'LEAVE' ? (
                    <p className="text-gray-400 italic">{msg.sender} {msg.content}</p>
                  ) : (
                    <p><span className="font-medium text-white">{msg.sender}:</span> <span className="text-gray-200">{msg.content}</span></p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-sm"
              />
              <button
                type="button"
                onClick={sendChatMessage}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>

          {/* Room Link */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-light mb-2">Invite Others</h3>
            <div className="flex gap-2">
              <input
                readOnly
                value={`${window.location.origin}/room/${room.id}`}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/room/${room.id}`)}
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-6 bg-black/50 backdrop-blur-xl border-t border-white/10">
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isVideoOn 
              ? 'bg-white/20 hover:bg-white/30 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsAudioOn(!isAudioOn)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isAudioOn 
              ? 'bg-white/20 hover:bg-white/30 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            isScreenSharing
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <ScreenShare className="w-5 h-5" />
          <span>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
        </button>

        <button className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300">
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Room;
