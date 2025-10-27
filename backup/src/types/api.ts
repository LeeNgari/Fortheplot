export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  durationSeconds: number;
  genre: string;
  posterPath: string;
  mediaFile: {
    id: number;
    filename: string;
    contentType: string;
    size: number;
  };
}

export interface TvShow {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  genre: string;
  posterPath: string;
  episodes: {
    id: number;
    title: string;
    description: string;
    episodeNumber: number;
    durationSeconds: number;
    mediaFile: {
      id: number;
      filename: string;
      contentType: string;
      size: number;
    };
  }[];
}

export interface Room {
  id: number;
  name: string;
  public: boolean;
  host: {
    id: number;
    username: string;
  };
  movie: Movie;
  playbackState: {
    playing: boolean;
    position: number;
    lastUpdated: number;
  };
}
