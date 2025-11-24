import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/room';
import { Room as ApiRoom } from '@/types/api';
import apiClient from '@/lib/api';
import RoomHeader from '@/components/room/RoomHeader';
import ParticipantList from '@/components/room/ParticipantList';
import Chat from '@/components/room/Chat';
import { useParams, useNavigate } from 'react-router-dom';
import RoomVideoPlayer from '@/components/room/RoomVideoPlayer';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';
import SelectContentDialog from '@/components/room/SelectContentDialog';
import DetailsSection from '@/components/details/DetailsSection';
import { ContentItem } from '@/types/content';

interface ChatMessage {
  sender: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
}

interface PlaybackActionMessage {
  type: 'PLAY' | 'PAUSE';
  position: number;
  timestamp: number;
}

interface ParticipantUpdateMessage {
  participants: User[];
  type: 'JOIN' | 'LEAVE' | 'UPDATE';
  participant: User;
}

const Room: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { username, userRoles } = useAuth(); 
  const [participants, setParticipants] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showSelectContentDialog, setShowSelectContentDialog] = useState(false);
  const stompClient = useRef<Client | null>(null);
  const queryClient = useQueryClient();

  const moviePlayerRef = useRef<HTMLVideoElement>(null);
  const pendingPlaybackAction = useRef<PlaybackActionMessage | null>(null);

  const { data: room, isLoading: roomLoading, error: roomError } = useQuery<ApiRoom, Error>({
    queryKey: ['room', roomId],
    queryFn: () => apiClient.get(`/rooms/${roomId}`).then(res => res.data),
    enabled: !!roomId,
  });

  const isHost = room?.host?.username === username;
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  const updateRoomMovieMutation = useMutation({
    mutationFn: ({ roomId, movieId }: { roomId: string; movieId: number }) => {
      return apiClient.put(`/rooms/${roomId}/movie`, { movieId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    },
  });

  useEffect(() => {
    if (!roomId || !username) return; // Ensure username is available

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
          const playbackAction: PlaybackActionMessage = JSON.parse(message.body);
          if (moviePlayerRef.current) {
            const latency = Date.now() - playbackAction.timestamp;
            const expectedPosition = playbackAction.position + (latency / 1000);

            moviePlayerRef.current.currentTime = expectedPosition;
            if (playbackAction.type === 'PLAY') {
              moviePlayerRef.current.play();
            } else if (playbackAction.type === 'PAUSE') {
              moviePlayerRef.current.pause();
            }
          }
        });

        client.subscribe(`/user/queue/room/${roomId}/playback-sync`, (message) => {
          const playbackAction: PlaybackActionMessage = JSON.parse(message.body);
          console.log("Received playback sync message:", playbackAction);
          pendingPlaybackAction.current = playbackAction; // Store the action

          if (moviePlayerRef.current && moviePlayerRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
            // If video is already ready, apply immediately
            const latency = Date.now() - playbackAction.timestamp;
            const expectedPosition = playbackAction.position + (latency / 1000);
            moviePlayerRef.current.currentTime = expectedPosition;
            if (playbackAction.type === 'PLAY') {
              moviePlayerRef.current.play();
            } else {
              moviePlayerRef.current.pause();
            }
            pendingPlaybackAction.current = null; // Clear after applying
          }
        });

        client.subscribe(`/topic/room/${roomId}/participants`, (message) => {
          const participantUpdate: ParticipantUpdateMessage = JSON.parse(message.body);
          setParticipants(participantUpdate.participants);
        });

        // Send join message
        client.publish({
          destination: `/app/room/${roomId}/join`,
          body: JSON.stringify({ username: username }), 
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.current = client;
    client.activate();

    const videoElement = moviePlayerRef.current;
    const handleLoadedMetadata = () => {
      if (pendingPlaybackAction.current) {
        const playbackAction = pendingPlaybackAction.current;
        const latency = Date.now() - playbackAction.timestamp;
        const expectedPosition = playbackAction.position + (latency / 1000);
        videoElement!.currentTime = expectedPosition;
        if (playbackAction.type === 'PLAY') {
          videoElement!.play();
        } else {
          videoElement!.pause();
        }
        pendingPlaybackAction.current = null; // Clear after applying
      }
    };

    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (stompClient.current?.connected) {
        // Send leave message
        stompClient.current.publish({
          destination: `/app/room/${roomId}/leave`,
          body: JSON.stringify({ username: username }), 
        });
        stompClient.current.deactivate();
      }
      if (videoElement) {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [roomId, username]);

  const sendChatMessage = (message: string) => {
    if (stompClient.current?.connected && message.trim() && username) {
      stompClient.current.publish({
        destination: `/app/room/${roomId}/chat`,
        body: JSON.stringify({ sender: username, content: message, type: 'CHAT' }),
      });
    }
  };

  const sendPlaybackAction = (type: 'PLAY' | 'PAUSE') => {
    if (stompClient.current?.connected && moviePlayerRef.current && (isHost || isAdmin)) {
      stompClient.current.publish({
        destination: `/app/room/${roomId}/playback`,
        body: JSON.stringify({ type, position: moviePlayerRef.current.currentTime }),
      });
    }
  };

  const handleSelectContent = (movieId: number) => {
    if (roomId) {
      updateRoomMovieMutation.mutate({ roomId, movieId });
      setShowSelectContentDialog(false);
    }
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-24 w-24 animate-spin text-red-500" />
      </div>
    );
  }

  if (roomError) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-500">Error loading room: {roomError.message}</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white">Room not found.</p>
      </div>
    );
  }

  const content: ContentItem | undefined = room.movie ? {
    id: room.movie.id.toString(),
    title: room.movie.title,
    description: room.movie.description,
    duration: `${Math.floor(room.movie.durationSeconds / 60)}m`,
    releaseDate: room.movie.releaseDate,
    genre: room.movie.genre.split(','),
    imageUrl: room.movie.posterPath,
    type: 'movie',
    url: `/api/media/${room.movie.mediaFile.id}`,
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <RoomHeader 
        room={room} 
        participantCount={participants.length} 
        onLeave={() => navigate('/rooms')} 
      />

      <div className="flex-1 flex gap-4">
        <div className="w-[70%] flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <RoomVideoPlayer 
              room={room} 
              moviePlayerRef={moviePlayerRef} 
              onPlay={() => sendPlaybackAction('PLAY')}
              onPause={() => sendPlaybackAction('PAUSE')}
              isHost={isHost}
              isAdmin={isAdmin}
            />
          </div>
          {(isHost || isAdmin) && !room.movie && (
            <Button 
              onClick={() => setShowSelectContentDialog(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Film className="w-4 h-4 mr-2" />
              Select Movie/TV Show
            </Button>
          )}

          {content && (
            <div className="mt-8 w-[65%] mx-auto">
              <DetailsSection content={content} />
            </div>
          )}
        </div>

        <div className="flex-1 bg-white/5 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col">
          <ParticipantList participants={participants} />
          <Chat messages={chatMessages} onSendMessage={sendChatMessage} />
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

      <SelectContentDialog 
        open={showSelectContentDialog} 
        onOpenChange={setShowSelectContentDialog} 
        onSelectContent={handleSelectContent} 
      />
    </div>
  );
};

export default Room;