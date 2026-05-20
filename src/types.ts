export type MatchStatus = 'upcoming' | 'live' | 'completed';
export type MatchFormat = 'BO1' | 'BO3' | 'BO5';
export type Page = 'dashboard' | 'matches' | 'pickban' | 'players' | 'scores' | 'strategies' | 'history';

export interface Match {
  id: string;
  date: string;
  time: string;
  opponent: string;
  opponentLogo: string;
  division: string;
  format: MatchFormat;
  status: MatchStatus;
  lineup: string[];
  scores: MatchScore[];
  mvp?: string;
  pickBan?: PickBanRecord;
}

export interface MatchScore {
  map: string;
  teamScore: number;
  opponentScore: number;
}

export interface Player {
  id: string;
  pseudo: string;
  role: string;
  poste: string;
  avatar: string;
  available: boolean;
  favoriteMaps: string[];
  stats: PlayerStats;
  eloRating: number;
}

export interface PlayerStats {
  kills: number;
  deaths: number;
  assists: number;
  matchesPlayed: number;
  wins: number;
  mvpCount: number;
}

export interface PickBanRecord {
  teamPicks: string[];
  teamBans: string[];
  opponentPicks: string[];
  opponentBans: string[];
}

export interface Strategy {
  id: string;
  name: string;
  map: string;
  type: 'offensive' | 'defensive';
  description: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface MapData {
  name: string;
  winRate: number;
  totalGames: number;
  wins: number;
  losses: number;
}