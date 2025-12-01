export interface Game {
  id: number | null;
  name: string | null;
  platform: string | null;
}

export interface CountryFull {
  id: string;
  name: string;
  flagUrl: string;
  region: string;
  languages: string[];
}

export interface GameFull {
  id: string;
  name: string;
  summary: string;
  coverUrl: string;
  platforms: number[];
}