
export interface Movie {
  title: string;
  description: string;
  duration: string;
  release_date: string;
  genre: string[];
  movie_url: string;
  display_pic: string;
}

export interface TVShow {
  title: string;
  description: string;
  duration: string;
  release_date: string;
  genre: string[];
  display_pic: string;
  episodes: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  releaseDate: string;
  genre: string[];
  imageUrl: string;
  type: 'movie' | 'tv';
  url?: string;
  episodes?: string[];
}
