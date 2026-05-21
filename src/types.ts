export type MatchStatus = 'upcoming' | 'live' | 'completed';
export type MatchType = 'SCRIM' | 'LIGUE' | 'TOURNOI';
export type Page = 'matches' | 'results' | 'strats' | 'compos' | 'fiches' | 'notes' | 'objectifs' | 'replays' | 'roster' | 'stats' | 'admin';
export type Availability = 'dispo' | 'indispo' | 'none';

export interface Match {
  id: string;
  date: string;
  time1: string;
  time2?: string;
  arena: 'Arène 1' | 'Arène 2';
  opponent: string;
  type: MatchType;
  status: MatchStatus;
  lineup: string[];
  scores: MatchScore[];
  mvp?: string;
  availability: Record<string, Availability>;
}

export interface MatchScore { map: string; teamScore: number; opponentScore: number; }

export interface Player {
  id: string; pseudo: string; role: string; avatar: string;
  available: boolean; favoriteMaps: string[];
  stats: { kills: number; deaths: number; assists: number; matchesPlayed: number; wins: number; mvpCount: number; };
}

export interface Composition { id: string; map: string; players: string[]; }

export interface Strategy { id: string; name: string; map: string; type: 'offensive' | 'defensive'; description: string; notes: string; }
export interface MapData { name: string; winRate: number; totalGames: number; wins: number; losses: number; }