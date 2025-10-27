
export interface Room {
  id: string;
  name: string;
  host: User;
  participants: User[];
  isActive: boolean;
  createdAt: Date;
  maxParticipants: number;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  isScreenSharing: boolean;
}

export interface ScreenShareState {
  isSharing: boolean;
  hostId: string | null;
  stream: MediaStream | null;
}
