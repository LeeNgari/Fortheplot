import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import { User } from '@/types/room';

interface WebRTCProps {
  roomId: string;
  userId: string;
  stompClient: React.MutableRefObject<Client | null>;
  participants: User[];
}

interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = ({ roomId, userId, stompClient, participants }: WebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  const createPeerConnection = useCallback((targetId: string) => {
    if (peerConnections.current[targetId]) return peerConnections.current[targetId];

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current[targetId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate && stompClient.current?.connected) {
        stompClient.current.publish({
          destination: `/app/room/${roomId}/webrtc/ice-candidate`,
          body: JSON.stringify({
            targetParticipantId: targetId,
            candidate: event.candidate,
          }),
        });
      }
    };

    pc.ontrack = (event) => {
      setPeers((prev) => {
        const existing = prev.find((p) => p.peerId === targetId);
        if (existing) {
          return prev.map((p) => (p.peerId === targetId ? { ...p, stream: event.streams[0] } : p));
        }
        return [...prev, { peerId: targetId, connection: pc, stream: event.streams[0] }];
      });
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    return pc;
  }, [roomId, stompClient]);

  const initializeLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      return null;
    }
  };

  const callUser = async (targetId: string) => {
    const pc = createPeerConnection(targetId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: `/app/room/${roomId}/webrtc/offer`,
        body: JSON.stringify({
          targetParticipantId: targetId,
          sdp: offer.sdp,
          type: offer.type,
        }),
      });
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit, senderId: string) => {
    const pc = createPeerConnection(senderId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: `/app/room/${roomId}/webrtc/answer`,
        body: JSON.stringify({
          targetParticipantId: senderId,
          sdp: answer.sdp,
          type: answer.type,
        }),
      });
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit, senderId: string) => {
    const pc = peerConnections.current[senderId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleCandidate = async (candidate: RTCIceCandidateInit, senderId: string) => {
    const pc = peerConnections.current[senderId];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        // Force update to reflect state change if needed
        setLocalStream(new MediaStream(localStreamRef.current.getTracks())); 
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      Object.values(peerConnections.current).forEach((pc) => pc.close());
    };
  }, []);

  return {
    localStream,
    peers,
    initializeLocalStream,
    callUser,
    handleOffer,
    handleAnswer,
    handleCandidate,
    toggleVideo,
    toggleAudio,
  };
};
