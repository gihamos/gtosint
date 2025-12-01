export interface SummonerInfo {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  summonerLevel: number;
  profileIconUrl: string;
}

export interface Match {
  matchId: string;
  gameMode: string;
  gameDuration: number;
  championName: string;
  championIconUrl: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
}

export interface RiotResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
  summonerInfo: SummonerInfo;
  rankInfo: any[];
  matchHistory: Match[];
}