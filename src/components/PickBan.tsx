import { useState } from 'react';
import { Match, PickBanRecord, MapData } from '../types';
import { MAPS } from '../store';
import {
  Map, Ban, Check, RotateCcw, Save, Star,
  TrendingUp, AlertTriangle, Zap, ArrowRight,
} from 'lucide-react';

interface PickBanProps {
  matches: Match[];
  mapStats: MapData[];
  onSavePickBan: (matchId: string, pickBan: PickBanRecord) => void;
}

export default function PickBan({ matches, mapStats, onSavePickBan }: PickBanProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [mode, setMode] = useState<'pick' | 'ban'>('ban');
  const [side, setSide] = useState<'team' | 'opponent'>('team');
  const [teamPicks, setTeamPicks] = useState<string[]>([]);
  const [teamBans, setTeamBans] = useState<string[]>([]);
  const [opponentPicks, setOpponentPicks] = useState<string[]>([]);
  const [opponentBans, setOpponentBans] = useState<string[]>([]);

  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatch(matchId);
    const match = matches.find((m) => m.id === matchId);
    if (match?.pickBan) {
      setTeamPicks(match.pickBan.teamPicks);
      setTeamBans(match.pickBan.teamBans);
      setOpponentPicks(match.pickBan.opponentPicks);
      setOpponentBans(match.pickBan.opponentBans);
    } else {
      resetAll();
    }
  };

  const resetAll = () => {
    setTeamPicks([]); setTeamBans([]); setOpponentPicks([]); setOpponentBans([]);
  };

  const handleMapClick = (mapName: string) => {
    const isUsed = [...teamPicks, ...teamBans, ...opponentPicks, ...opponentBans].includes(mapName);
    if (isUsed) return;
    if (mode === 'pick') {
      if (side === 'team') setTeamPicks([...teamPicks, mapName]);
      else setOpponentPicks([...opponentPicks, mapName]);
    } else {
      if (side === 'team') setTeamBans([...teamBans, mapName]);
      else setOpponentBans([...opponentBans, mapName]);
    }
  };

  const handleSave = () => {
    if (!selectedMatch) return;
    onSavePickBan(selectedMatch, { teamPicks, teamBans, opponentPicks, opponentBans });
  };

  const getMapStatus = (mapName: string) => {
    if (teamPicks.includes(mapName)) return 'team-pick';
    if (teamBans.includes(mapName)) return 'team-ban';
    if (opponentPicks.includes(mapName)) return 'opponent-pick';
    if (opponentBans.includes(mapName)) return 'opponent-ban';
    return 'available';
  };

  const getMapStat = (mapName: string) => mapStats.find((m) => m.name === mapName);
  const bestMaps = [...mapStats].sort((a, b) => b.winRate - a.winRate).slice(0, 3);
  const worstMaps = [...mapStats].sort((a, b) => a.winRate - b.winRate).slice(0, 3);

  const completedMatches = matches.filter((m) => m.status === 'completed' && m.pickBan);
  const pickHistory = MAPS.map((map) => {
    const picked = completedMatches.filter((m) => m.pickBan!.teamPicks.includes(map) || m.pickBan!.opponentPicks.includes(map)).length;
    const banned = completedMatches.filter((m) => m.pickBan!.teamBans.includes(map) || m.pickBan!.opponentBans.includes(map)).length;
    return { map, picked, banned };
  });

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white neon-text">PICK & BAN</h1>
        <p className="text-gray-400 text-sm mt-1 font-rajdhani">Système de sélection et bannissement des maps</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Match Selection */}
          <div className="card-glow rounded-xl p-5">
            <h3 className="font-orbitron text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Map size={16} className="text-neon-blue" /> Sélectionner un match
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {upcomingMatches.map((match) => (
                <button key={match.id} onClick={() => handleSelectMatch(match.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    selectedMatch === match.id ? 'bg-neon-blue/10 border-neon-blue/30' : 'bg-dark-700/50 border-dark-400/30 hover:border-dark-300'
                  }`}>
                  <span className="text-xl">{match.opponentLogo}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{match.opponent}</p>
                    <p className="text-xs text-gray-500">{match.date} · {match.format}</p>
                  </div>
                </button>
              ))}
              {upcomingMatches.length === 0 && <p className="text-sm text-gray-500 col-span-2 text-center py-4">Aucun match à venir</p>}
            </div>
          </div>

          {selectedMatch && (
            <>
              <div className="card-glow rounded-xl p-5">
                <div className="flex flex-wrap gap-3 mb-5">
                  <div className="flex gap-1 bg-dark-700 rounded-lg p-1">
                    <button onClick={() => setMode('ban')}
                      className={`px-4 py-2 rounded-md text-xs font-rajdhani font-semibold transition-all ${mode === 'ban' ? 'bg-neon-red/20 text-neon-red' : 'text-gray-400'}`}>
                      🚫 BAN
                    </button>
                    <button onClick={() => setMode('pick')}
                      className={`px-4 py-2 rounded-md text-xs font-rajdhani font-semibold transition-all ${mode === 'pick' ? 'bg-neon-green/20 text-neon-green' : 'text-gray-400'}`}>
                      ✅ PICK
                    </button>
                  </div>
                  <div className="flex gap-1 bg-dark-700 rounded-lg p-1">
                    <button onClick={() => setSide('team')}
                      className={`px-4 py-2 rounded-md text-xs font-rajdhani font-semibold transition-all ${side === 'team' ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-400'}`}>
                      🎮 Dyno EVA
                    </button>
                    <button onClick={() => setSide('opponent')}
                      className={`px-4 py-2 rounded-md text-xs font-rajdhani font-semibold transition-all ${side === 'opponent' ? 'bg-neon-purple/20 text-neon-purple' : 'text-gray-400'}`}>
                      {matches.find((m) => m.id === selectedMatch)?.opponentLogo} Adversaire
                    </button>
                  </div>
                  <button onClick={resetAll}
                    className="px-3 py-2 rounded-lg bg-dark-700 border border-dark-400/30 text-gray-400 hover:text-white text-xs flex items-center gap-1 ml-auto">
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MAPS.map((mapName) => {
                    const status = getMapStatus(mapName);
                    const stat = getMapStat(mapName);
                    return (
                      <button key={mapName} onClick={() => handleMapClick(mapName)} disabled={status !== 'available'}
                        className={`relative p-4 rounded-xl border text-center transition-all ${
                          status === 'team-pick' ? 'bg-neon-green/10 border-neon-green/30 ring-1 ring-neon-green/20'
                          : status === 'team-ban' ? 'bg-neon-red/10 border-neon-red/30 ring-1 ring-neon-red/20'
                          : status === 'opponent-pick' ? 'bg-neon-purple/10 border-neon-purple/30 ring-1 ring-neon-purple/20'
                          : status === 'opponent-ban' ? 'bg-neon-orange/10 border-neon-orange/30 ring-1 ring-neon-orange/20'
                          : 'bg-dark-700/50 border-dark-400/30 hover:border-neon-blue/30 cursor-pointer'
                        }`}>
                        <p className="font-orbitron text-sm font-bold text-white mb-1">{mapName}</p>
                        {stat && (
                          <p className={`text-xs ${stat.winRate >= 60 ? 'text-neon-green' : stat.winRate >= 45 ? 'text-neon-yellow' : 'text-neon-red'}`}>
                            {stat.winRate}% WR
                          </p>
                        )}
                        {status !== 'available' && (
                          <span className={`absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                            status === 'team-pick' ? 'bg-neon-green/20 text-neon-green'
                            : status === 'team-ban' ? 'bg-neon-red/20 text-neon-red'
                            : status === 'opponent-pick' ? 'bg-neon-purple/20 text-neon-purple'
                            : 'bg-neon-orange/20 text-neon-orange'
                          }`}>
                            {status.includes('pick') ? 'PICK' : 'BAN'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button onClick={handleSave}
                  className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-rajdhani font-bold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> Sauvegarder Pick & Ban
                </button>
              </div>

              {/* Summary */}
              <div className="card-glow rounded-xl p-5">
                <h3 className="font-orbitron text-sm font-semibold text-white mb-4">Résumé</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neon-blue font-rajdhani font-semibold mb-2">🎮 Dyno EVA</p>
                    <div className="space-y-1">
                      {teamPicks.map((m) => (
                        <div key={m} className="flex items-center gap-2 text-xs py-1 px-2 rounded bg-neon-green/5 border border-neon-green/10">
                          <Check size={10} className="text-neon-green" /> <span className="text-neon-green">PICK</span> <span className="text-white">{m}</span>
                        </div>
                      ))}
                      {teamBans.map((m) => (
                        <div key={m} className="flex items-center gap-2 text-xs py-1 px-2 rounded bg-neon-red/5 border border-neon-red/10">
                          <Ban size={10} className="text-neon-red" /> <span className="text-neon-red">BAN</span> <span className="text-white">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neon-purple font-rajdhani font-semibold mb-2">
                      {matches.find((m) => m.id === selectedMatch)?.opponentLogo} Adversaire
                    </p>
                    <div className="space-y-1">
                      {opponentPicks.map((m) => (
                        <div key={m} className="flex items-center gap-2 text-xs py-1 px-2 rounded bg-neon-purple/5 border border-neon-purple/10">
                          <Check size={10} className="text-neon-purple" /> <span className="text-neon-purple">PICK</span> <span className="text-white">{m}</span>
                        </div>
                      ))}
                      {opponentBans.map((m) => (
                        <div key={m} className="flex items-center gap-2 text-xs py-1 px-2 rounded bg-neon-orange/5 border border-neon-orange/10">
                          <Ban size={10} className="text-neon-orange" /> <span className="text-neon-orange">BAN</span> <span className="text-white">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card-glow rounded-xl p-5">
            <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-neon-yellow" /> Recommandations IA
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-neon-green/5 border border-neon-green/15">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={12} className="text-neon-green" />
                  <span className="text-xs font-semibold text-neon-green">Meilleures maps</span>
                </div>
                {bestMaps.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-xs py-1">
                    <span className="text-white flex items-center gap-1"><Star size={10} className="text-neon-yellow" /> {m.name}</span>
                    <span className="text-neon-green">{m.winRate}% WR</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-neon-red/5 border border-neon-red/15">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={12} className="text-neon-red" />
                  <span className="text-xs font-semibold text-neon-red">Maps à éviter</span>
                </div>
                {worstMaps.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-xs py-1">
                    <span className="text-white">{m.name}</span>
                    <span className="text-neon-red">{m.winRate}% WR</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-neon-blue/5 border border-neon-blue/15">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRight size={12} className="text-neon-blue" />
                  <span className="text-xs font-semibold text-neon-blue">Conseil</span>
                </div>
                <p className="text-xs text-gray-400">
                  Pick <span className="text-neon-green font-medium">{bestMaps[0]?.name}</span> en priorité.
                  Ban <span className="text-neon-red font-medium">{worstMaps[0]?.name}</span> pour maximiser vos chances.
                </p>
              </div>
            </div>
          </div>

          <div className="card-glow rounded-xl p-5">
            <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Map size={16} className="text-neon-purple" /> Historique Pick/Ban
            </h3>
            <div className="space-y-2">
              {pickHistory.map((item) => (
                <div key={item.map} className="flex items-center justify-between py-2 border-b border-dark-400/20 last:border-0">
                  <span className="text-xs text-white font-medium">{item.map}</span>
                  <div className="flex gap-3">
                    <span className="text-xs text-neon-green">{item.picked} picks</span>
                    <span className="text-xs text-neon-red">{item.banned} bans</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}