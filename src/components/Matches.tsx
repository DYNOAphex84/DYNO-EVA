import { useState } from 'react';
import { Match, MatchFormat, MatchStatus, Player } from '../types';
import { DIVISIONS } from '../store';
import {
  Plus, Calendar, Clock, Shield, Swords, X, Check, Play, Trophy,
} from 'lucide-react';

interface MatchesProps {
  matches: Match[];
  players: Player[];
  onAddMatch: (match: Match) => void;
  onUpdateMatch: (match: Match) => void;
}

export default function Matches({ matches, players, onAddMatch }: MatchesProps) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | MatchStatus>('all');
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    date: '', time: '', opponent: '', opponentLogo: '🎮',
    division: 'Division 1', format: 'BO3', status: 'upcoming', lineup: [], scores: [],
  });

  const filtered = filter === 'all' ? matches : matches.filter((m) => m.status === filter);
  const sorted = [...filtered].sort((a, b) =>
    new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
  );

  const handleSubmit = () => {
    if (!newMatch.date || !newMatch.opponent) return;
    const match: Match = {
      id: `m${Date.now()}`, date: newMatch.date!, time: newMatch.time || '20:00',
      opponent: newMatch.opponent!, opponentLogo: newMatch.opponentLogo || '🎮',
      division: newMatch.division || 'Division 1', format: newMatch.format || 'BO3',
      status: 'upcoming', lineup: newMatch.lineup || [], scores: [],
    };
    onAddMatch(match);
    setShowForm(false);
    setNewMatch({ date: '', time: '', opponent: '', opponentLogo: '🎮', division: 'Division 1', format: 'BO3', status: 'upcoming', lineup: [], scores: [] });
  };

  const getStatusConfig = (status: MatchStatus) => {
    switch (status) {
      case 'upcoming': return { color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/20', label: 'À venir', icon: <Clock size={12} /> };
      case 'live': return { color: 'text-neon-red', bg: 'bg-neon-red/10', border: 'border-neon-red/20', label: 'EN DIRECT', icon: <Play size={12} /> };
      case 'completed': return { color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20', label: 'Terminé', icon: <Check size={12} /> };
    }
  };

  const getMatchResult = (match: Match) => {
    if (match.status !== 'completed') return null;
    const teamWins = match.scores.filter((s) => s.teamScore > s.opponentScore).length;
    const oppWins = match.scores.filter((s) => s.opponentScore > s.teamScore).length;
    return { teamWins, oppWins, won: teamWins > oppWins };
  };

  const logos = ['🎮', '🐦', '🐺', '⚡', '🛡️', '🐉', '🌩️', '🦁', '🔥', '💀', '🦅', '🐍'];

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white neon-text">MATCHS</h1>
          <p className="text-gray-400 text-sm mt-1 font-rajdhani">Gestion des matchs et calendrier</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 transition-all font-rajdhani font-semibold text-sm">
          <Plus size={16} /> Nouveau match
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'upcoming', 'live', 'completed'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-rajdhani font-semibold border transition-all ${
              filter === f ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue'
              : 'bg-dark-700 border-dark-400/30 text-gray-400 hover:text-white'
            }`}>
            {f === 'all' ? 'Tous' : f === 'upcoming' ? 'À venir' : f === 'live' ? 'En direct' : 'Terminés'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sorted.map((match) => {
          const statusConfig = getStatusConfig(match.status);
          const result = getMatchResult(match);
          const lineupPlayers = players.filter((p) => match.lineup.includes(p.id));

          return (
            <div key={match.id} className="card-glow rounded-xl overflow-hidden">
              <div className={`h-1 ${match.status === 'completed' ? (result?.won ? 'bg-neon-green' : 'bg-neon-red') : match.status === 'live' ? 'bg-neon-red' : 'bg-neon-blue'}`} />
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-2xl border border-neon-blue/20">🎮</div>
                      <p className="text-xs text-gray-400 mt-1 font-rajdhani">EVA</p>
                    </div>
                    <div className="flex-1 text-center">
                      {result ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className={`font-orbitron text-2xl font-bold ${result.won ? 'text-neon-green' : 'text-gray-400'}`}>{result.teamWins}</span>
                          <span className="text-gray-600 font-orbitron text-lg">-</span>
                          <span className={`font-orbitron text-2xl font-bold ${!result.won ? 'text-neon-red' : 'text-gray-400'}`}>{result.oppWins}</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-gray-500 font-rajdhani">VS</p>
                          <p className="text-sm text-neon-blue font-rajdhani">{match.time}</p>
                        </div>
                      )}
                      <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
                        {statusConfig.icon} {statusConfig.label}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-dark-600 flex items-center justify-center text-2xl border border-dark-400/30">{match.opponentLogo}</div>
                      <p className="text-xs text-gray-400 mt-1 font-rajdhani truncate max-w-[80px]">{match.opponent}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> {match.date}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Shield size={12} /> {match.division}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-600 text-gray-300 font-orbitron">{match.format}</span>
                  </div>
                </div>

                {match.scores.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dark-400/30">
                    <div className="flex flex-wrap gap-2">
                      {match.scores.map((score, idx) => (
                        <div key={idx} className={`px-3 py-2 rounded-lg border text-center ${
                          score.teamScore > score.opponentScore ? 'bg-neon-green/5 border-neon-green/20' : 'bg-neon-red/5 border-neon-red/20'
                        }`}>
                          <p className="text-[10px] text-gray-500 mb-1">{score.map}</p>
                          <p className="text-sm font-orbitron font-bold">
                            <span className={score.teamScore > score.opponentScore ? 'text-neon-green' : 'text-gray-400'}>{score.teamScore}</span>
                            <span className="text-gray-600 mx-1">-</span>
                            <span className={score.opponentScore > score.teamScore ? 'text-neon-red' : 'text-gray-400'}>{score.opponentScore}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                    {match.mvp && (
                      <div className="mt-3 flex items-center gap-2">
                        <Trophy size={12} className="text-neon-yellow" />
                        <span className="text-xs text-gray-400">MVP:</span>
                        <span className="text-xs text-neon-yellow font-medium">
                          {players.find((p) => p.id === match.mvp)?.avatar} {players.find((p) => p.id === match.mvp)?.pseudo}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {lineupPlayers.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500">Lineup:</span>
                    {lineupPlayers.map((p) => (
                      <span key={p.id} className="px-2 py-0.5 rounded-full bg-dark-600 text-[10px] text-gray-300 border border-dark-400/30">
                        {p.avatar} {p.pseudo}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
                <Swords size={20} className="text-neon-blue" /> Nouveau match
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Date</label>
                  <input type="date" value={newMatch.date} onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })} className="w-full text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Heure</label>
                  <input type="time" value={newMatch.time} onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })} className="w-full text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Adversaire</label>
                <input type="text" value={newMatch.opponent} onChange={(e) => setNewMatch({ ...newMatch, opponent: e.target.value })} placeholder="Nom de l'équipe" className="w-full text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-rajdhani">Logo adversaire</label>
                <div className="flex flex-wrap gap-2">
                  {logos.map((l) => (
                    <button key={l} onClick={() => setNewMatch({ ...newMatch, opponentLogo: l })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border transition-all ${
                        newMatch.opponentLogo === l ? 'bg-neon-blue/10 border-neon-blue/30' : 'bg-dark-700 border-dark-400/30'
                      }`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Division</label>
                  <select value={newMatch.division} onChange={(e) => setNewMatch({ ...newMatch, division: e.target.value })} className="w-full text-sm">
                    {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Format</label>
                  <select value={newMatch.format} onChange={(e) => setNewMatch({ ...newMatch, format: e.target.value as MatchFormat })} className="w-full text-sm">
                    <option value="BO1">BO1</option><option value="BO3">BO3</option><option value="BO5">BO5</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-rajdhani">Composition</label>
                <div className="grid grid-cols-2 gap-2">
                  {players.map((p) => (
                    <button key={p.id}
                      onClick={() => {
                        const lineup = newMatch.lineup || [];
                        if (lineup.includes(p.id)) setNewMatch({ ...newMatch, lineup: lineup.filter((id) => id !== p.id) });
                        else if (lineup.length < 5) setNewMatch({ ...newMatch, lineup: [...lineup, p.id] });
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
                        (newMatch.lineup || []).includes(p.id) ? 'bg-neon-blue/10 border-neon-blue/30 text-white' : 'bg-dark-700 border-dark-400/30 text-gray-400'
                      } ${!p.available ? 'opacity-40' : ''}`}>
                      <span>{p.avatar}</span><span className="font-rajdhani">{p.pseudo}</span>
                      {!p.available && <span className="text-[10px] text-neon-red ml-auto">indispo</span>}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={!newMatch.date || !newMatch.opponent}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-rajdhani font-bold text-sm disabled:opacity-30 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all">
                Créer le match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}