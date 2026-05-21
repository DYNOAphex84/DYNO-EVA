import { Match, Player, Composition, Strategy, MapData } from './types';

export const MAPS = ['Artefact', 'Atlantis', 'Bastion', 'Ceres', 'Coliseum', 'Engine', 'Helios Station', 'Horizon', 'Lunar Outpost', 'Outlaw', 'Polaris', 'Silva', 'The Cliff', 'The Rock'];

export const initialPlayers: Player[] = [
  { id: 'p1', pseudo: 'DYNOxATIX', role: 'Entry', avatar: '⚡', available: true, favoriteMaps: ['Polaris', 'Lunar Outpost'], stats: { kills: 342, deaths: 198, assists: 87, matchesPlayed: 28, wins: 19, mvpCount: 8 } },
  { id: 'p2', pseudo: 'DYNOAphex', role: 'IGL', avatar: '🧠', available: true, favoriteMaps: ['Helios Station', 'The Cliff'], stats: { kills: 245, deaths: 190, assists: 168, matchesPlayed: 28, wins: 19, mvpCount: 4 } },
  { id: 'p3', pseudo: 'Titeul', role: 'Support', avatar: '🛡️', available: true, favoriteMaps: ['Polaris', 'Horizon'], stats: { kills: 210, deaths: 165, assists: 195, matchesPlayed: 28, wins: 19, mvpCount: 3 } },
  { id: 'p4', pseudo: 'Dedjull', role: 'Flex', avatar: '🔥', available: false, favoriteMaps: ['Helios Station', 'The Cliff'], stats: { kills: 265, deaths: 172, assists: 98, matchesPlayed: 25, wins: 16, mvpCount: 5 } },
  { id: 'p5', pseudo: 'DYNOxM4TT', role: 'AWPer', avatar: '🎯', available: true, favoriteMaps: ['Lunar Outpost', 'Outlaw'], stats: { kills: 310, deaths: 155, assists: 62, matchesPlayed: 26, wins: 18, mvpCount: 9 } },
];

export const initialMatches: Match[] = [
  {
    id: 'm1', date: '2026-04-22', time1: '20:00', time2: '20:40', arena: 'Arène 2',
    opponent: 'DD', type: 'SCRIM', status: 'upcoming', lineup: ['p1', 'p2', 'p3', 'p5'],
    scores: [], availability: { p1: 'dispo', p2: 'dispo', p3: 'dispo', p4: 'indispo', p5: 'dispo' },
  },
  {
    id: 'm2', date: '2026-04-29', time1: '21:00', arena: 'Arène 1',
    opponent: 'Phoenix', type: 'LIGUE', status: 'upcoming', lineup: [],
    scores: [], availability: {},
  },
];

export const initialCompositions: Composition[] = [
  { id: 'c1', map: 'Polaris', players: ['p1', 'p2', 'p3', 'p4'] },
  { id: 'c2', map: 'Lunar Outpost', players: ['p1', 'p2', 'p5', 'p3'] },
  { id: 'c3', map: 'Helios Station', players: ['p4', 'p5', 'p2', 'p1'] },
  { id: 'c4', map: 'The Cliff', players: ['p4', 'p3', 'p1', 'p2'] },
  { id: 'c5', map: 'Horizon', players: ['p2', 'p1', 'p3', 'p4'] },
];

export const initialStrategies: Strategy[] = [];
export const mapStatsData: MapData[] = [];