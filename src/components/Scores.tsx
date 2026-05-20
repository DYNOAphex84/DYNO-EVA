import { useState } from 'react';
import { Match, Player, MatchScore } from '../types';
import { MAPS } from '../store';
import { Trophy, Plus, X, Save, Target, Crown, Swords } from 'lucide-react';

interface ScoresProps {
  matches: Match[];
  players: Player[];
  onUpdateMatchScores: (matchId: string, scores: MatchScore[], mvp?: string) => void;
}

export default function Scores({ matches, players, onUpdateMatchScores }: ScoresProps) {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [scores, setScores] = useState<MatchScore[]>([]);
  const [mvp, setMvp] = useState<string>('');

  const completedMatches = matches.filter((m) => m.status === 'completed');
  const upcomingAndLive = matches.filter((m) => m.status !== 'completed');

  const startEditing = (match: Match) => {
    setEditingMatch(match.id);
    setScores(match.scores.length > 0 ? [...match.scores] : [{ map: MAPS[0], teamScore: 0, opponentScore: 0 }]);
    setMvp(match.mvp || '');
  };

  const addScore = () => setScores([...scores, { map: MAPS[0], teamScore: 0, opponentScore: 0 }]);

  const updateScore = (idx: number, field: keyof MatchScore, value: string | number) => {
    const updated = [...scores];
    (updated[idx] as any)[field] = typeof value === 'string' && field !== 'map' ? parseInt(value) || 0 : value;
    setScores(updated);
  };

  const handleSave = () => {
    if (!editingMatch) return;
    onUpdateMatchScores(editingMatch, scores, mvp || undefined);
    setEditingMatch(null);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white neon-text">SCORES</h1>
        <p className="text-gray-400 text-sm mt-1 font-rajdhani">Résultats et statistiques des matchs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {upcomingAndLive.length > 0 && (
            <div className="card-glow rounded-xl p-5">
              <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Target size={16} className="text-neon-yellow" /> Matchs à scorer
              </h3>
              <div className="space-y-2">
                {upcomingAndLive.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-700/50 border border-dark-400/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{match.opponentLogo}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{match.opponent}</p>
                        <p className="text-xs text-gray-500">{match.date} · {match.format}</p>
                      </div>
                    </div>
                    <button onClick={() => startEditing(match)}
                      className="px-3 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-rajdhani font-semibold hover:bg-neon-blue/20 transition-all">
                      Scorer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-glow rounded-xl p-5">
            <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-neon-green" /> Résultats
            </h3>
            <div className="space-y-4">
              {completedMatches.map((match) => {
                const teamWins = match.scores.filter((s) => s.teamScore > s.opponentScore).length;
                const oppWins = match.scores.filter((s) => s.opponentScore > s.teamScore).length;
                const won = teamWins > oppWins;
                return (
                  <div key={match.id} className={`p-4 rounded-xl border ${won ? 'bg-neon-green/5 border-neon-green/15' : 'bg-neon-red/5 border-neon-red/15'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-orbitron font-bold ${won ? 'text-neon-green' : 'text-neon-red'}`}>{won ? 'VICTOIRE' : 'DÉFAITE'}</span>
                        <span className="text-lg font-orbitron font-bold text-white">{teamWins} - {oppWins}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{match.opponentLogo}</span>
                        <span className="text-sm text-gray-300">{match.opponent}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {match.scores.map((score, idx) => (
                        <div key={idx} className={`p-2 rounded-lg text-center border ${
                          score.teamScore > score.opponentScore ? 'bg-neon-green/5 border-neon-green/15' : 'bg-neon-red/5 border-neon-red/15'
                        }`}>
                          <p className="text-[10px] text-gray-500 mb-0.5">{score.map}</p>
                          <p className="text-sm font-orbitron font-bold">
                            <span className={score.teamScore > score.opponentScore ? 'text-neon-green' : 'text-gray-500'}>{score.teamScore}</span>
                            <span className="text-gray-600 mx-1">:</span>
                            <span className={score.opponentScore > score.teamScore ? 'text-neon-red' : 'text-gray-500'}>{score.opponentScore}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                    {match.mvp && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <Crown size={12} className="text-neon-yellow" />
                        <span className="text-gray-500">MVP:</span>
                        <span className="text-neon-yellow font-medium">
                          {players.find((p) => p.id === match.mvp)?.avatar} {players.find((p) => p.id === match.mvp)?.pseudo}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-600">{match.date} · {match.division} · {match.format}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card-glow rounded-xl p-5">
          <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Swords size={16} className="text-neon-blue" /> Stats individuelles
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-dark-400/30">
                <th className="text-left py-2 font-rajdhani">Joueur</th>
                <th className="text-center py-2 font-rajdhani">K</th>
                <th className="text-center py-2 font-rajdhani">D</th>
                <th className="text-center py-2 font-rajdhani">A</th>
                <th className="text-center py-2 font-rajdhani">MVP</th>
              </tr>
            </thead>
            <tbody>
              {[...players].sort((a, b) => b.stats.kills - a.stats.kills).map((p) => (
                <tr key={p.id} className="border-b border-dark-400/15">
                  <td className="py-2 flex items-center gap-1.5"><span>{p.avatar}</span><span className="text-white font-medium">{p.pseudo}</span></td>
                  <td className="text-center text-neon-green">{p.stats.kills}</td>
                  <td className="text-center text-neon-red">{p.stats.deaths}</td>
                  <td className="text-center text-neon-blue">{p.stats.assists}</td>
                  <td className="text-center text-neon-yellow">{p.stats.mvpCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
                <Trophy size={20} className="text-neon-green" /> Enregistrer les scores
              </h2>
              <button onClick={() => setEditingMatch(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {scores.map((score, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-dark-700/50 border border-dark-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-rajdhani">Manche {idx + 1}</span>
                    {scores.length > 1 && (
                      <button onClick={() => setScores(scores.filter((_, i) => i !== idx))} className="text-gray-600 hover:text-neon-red"><X size={14} /></button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <select value={score.map} onChange={(e) => updateScore(idx, 'map', e.target.value)} className="text-sm">
                      {MAPS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <input type="number" min="0" value={score.teamScore} onChange={(e) => updateScore(idx, 'teamScore', e.target.value)} placeholder="EVA" className="text-sm text-center" />
                    <input type="number" min="0" value={score.opponentScore} onChange={(e) => updateScore(idx, 'opponentScore', e.target.value)} placeholder="OPP" className="text-sm text-center" />
                  </div>
                </div>
              ))}
              <button onClick={addScore}
                className="w-full py-2 rounded-lg border border-dashed border-dark-400/50 text-gray-500 text-xs flex items-center justify-center gap-1 hover:text-white transition-all">
                <Plus size={14} /> Ajouter une manche
              </button>
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-rajdhani">MVP du match</label>
                <select value={mvp} onChange={(e) => setMvp(e.target.value)} className="w-full text-sm">
                  <option value="">Aucun</option>
                  {players.map((p) => <option key={p.id} value={p.id}>{p.avatar} {p.pseudo}</option>)}
                </select>
              </div>
              <button onClick={handleSave}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-white font-rajdhani font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all flex items-center justify-center gap-2">
                <Save size={16} /> Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}