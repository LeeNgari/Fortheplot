
export interface MediaFile {
  id: number;
  filename: string;
  contentType: string;
  size: number;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  durationSeconds: number;
  genre: string;
  posterPath: string;
  mediaFile: MediaFile;
}

export interface Episode {
  title: string;
  episodeNumber: number;
  durationSeconds: number;
  mediaFile: MediaFile;
}

export interface TVShow {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  genre: string;
  posterPath: string;
  episodes: Episode[];
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  releaseDate: string;
  genre: string;
  posterPath: string;
  type: 'movie' | 'tv';
  url?: string;
  episodes?: Episode[];
}
