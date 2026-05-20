import { useState } from 'react';
import { Player } from '../types';
import { MAPS } from '../store';
import {
  Users, Plus, X, Shield, Target, Swords, Star, Crown,
  Eye, EyeOff, TrendingUp,
} from 'lucide-react';

interface PlayersProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onUpdatePlayer: (player: Player) => void;
  onToggleAvailability: (id: string) => void;
}

export default function Players({ players, onAddPlayer, onToggleAvailability }: PlayersProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [newPlayer, setNewPlayer] = useState({
    pseudo: '', role: '', poste: '', avatar: '🎮', favoriteMaps: [] as string[],
  });

  const avatars = ['🎮', '⚡', '🔥', '👻', '🎯', '🧠', '🛡️', '💀', '🦅', '🐉', '⭐', '🌟'];
  const roles = ['Entry Fragger', 'Support', 'Flex', 'Lurker', 'AWPer', 'IGL'];
  const postes = ['Attaquant', 'Support', 'Flex', 'Flanker', 'Sniper', 'Leader'];

  const handleAdd = () => {
    if (!newPlayer.pseudo) return;
    const player: Player = {
      id: `p${Date.now()}`, pseudo: newPlayer.pseudo,
      role: newPlayer.role || 'Flex', poste: newPlayer.poste || 'Flex',
      avatar: newPlayer.avatar, available: true, favoriteMaps: newPlayer.favoriteMaps,
      stats: { kills: 0, deaths: 0, assists: 0, matchesPlayed: 0, wins: 0, mvpCount: 0 },
      eloRating: 1500,
    };
    onAddPlayer(player);
    setShowForm(false);
    setNewPlayer({ pseudo: '', role: '', poste: '', avatar: '🎮', favoriteMaps: [] });
  };

  const getKDA = (p: Player) => ((p.stats.kills + p.stats.assists) / Math.max(p.stats.deaths, 1)).toFixed(2);
  const getWinRate = (p: Player) => p.stats.matchesPlayed > 0 ? Math.round((p.stats.wins / p.stats.matchesPlayed) * 100) : 0;
  const viewPlayer = players.find((p) => p.id === selectedPlayer);
  const mapAssignments = MAPS.map((map) => ({ map, players: players.filter((p) => p.favoriteMaps.includes(map)) }));

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white neon-text">JOUEURS</h1>
          <p className="text-gray-400 text-sm mt-1 font-rajdhani">Gestion de l'équipe et des profils</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 transition-all font-rajdhani font-semibold text-sm">
          <Plus size={16} /> Ajouter joueur
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-glow rounded-xl p-4 text-center">
          <p className="font-orbitron text-2xl font-bold text-white">{players.length}</p>
          <p className="text-xs text-gray-500 font-rajdhani">Total</p>
        </div>
        <div className="card-glow rounded-xl p-4 text-center">
          <p className="font-orbitron text-2xl font-bold text-neon-green">{players.filter((p) => p.available).length}</p>
          <p className="text-xs text-gray-500 font-rajdhani">Disponibles</p>
        </div>
        <div className="card-glow rounded-xl p-4 text-center">
          <p className="font-orbitron text-2xl font-bold text-neon-red">{players.filter((p) => !p.available).length}</p>
          <p className="text-xs text-gray-500 font-rajdhani">Indisponibles</p>
        </div>
        <div className="card-glow rounded-xl p-4 text-center">
          <p className="font-orbitron text-2xl font-bold text-neon-yellow">
            {Math.round(players.reduce((a, p) => a + p.eloRating, 0) / Math.max(players.length, 1))}
          </p>
          <p className="text-xs text-gray-500 font-rajdhani">ELO moyen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {players.map((player) => (
            <div key={player.id} onClick={() => setSelectedPlayer(player.id)}
              className={`card-glow rounded-xl p-4 cursor-pointer transition-all ${selectedPlayer === player.id ? 'ring-1 ring-neon-blue/30' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-dark-500 to-dark-600 flex items-center justify-center text-2xl border border-dark-400/30">{player.avatar}</div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-800 ${player.available ? 'bg-neon-green' : 'bg-neon-red'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-orbitron text-base font-bold text-white">{player.pseudo}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-dark-600 text-[10px] text-neon-blue font-rajdhani">{player.role}</span>
                  </div>
                  <p className="text-xs text-gray-500">{player.poste} · ELO {player.eloRating}</p>
                  <div className="flex gap-1 mt-1">
                    {player.favoriteMaps.slice(0, 3).map((m) => (
                      <span key={m} className="px-1.5 py-0.5 rounded bg-dark-600 text-[9px] text-gray-400">{m}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="flex gap-4 text-xs">
                    <div><p className="text-gray-500">K/D/A</p><p className="text-white font-medium font-rajdhani">{player.stats.kills}/{player.stats.deaths}/{player.stats.assists}</p></div>
                    <div><p className="text-gray-500">KDA</p><p className="text-neon-blue font-bold font-rajdhani">{getKDA(player)}</p></div>
                    <div><p className="text-gray-500">WR</p><p className={`font-bold font-rajdhani ${getWinRate(player) >= 60 ? 'text-neon-green' : 'text-neon-yellow'}`}>{getWinRate(player)}%</p></div>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onToggleAvailability(player.id); }}
                  className={`p-2 rounded-lg border transition-all ${player.available ? 'bg-neon-green/10 border-neon-green/20 text-neon-green' : 'bg-neon-red/10 border-neon-red/20 text-neon-red'}`}>
                  {player.available ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {viewPlayer && (
            <div className="card-glow rounded-xl p-5">
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-4xl border border-neon-blue/20 mx-auto mb-3">{viewPlayer.avatar}</div>
                <h3 className="font-orbitron text-lg font-bold text-white">{viewPlayer.pseudo}</h3>
                <p className="text-xs text-neon-blue">{viewPlayer.role} · {viewPlayer.poste}</p>
              </div>
              <div className="space-y-3">
                <StatRow label="Kills" value={String(viewPlayer.stats.kills)} icon={<Target size={12} />} color="text-neon-green" />
                <StatRow label="Deaths" value={String(viewPlayer.stats.deaths)} icon={<Swords size={12} />} color="text-neon-red" />
                <StatRow label="Assists" value={String(viewPlayer.stats.assists)} icon={<Shield size={12} />} color="text-neon-blue" />
                <StatRow label="KDA Ratio" value={getKDA(viewPlayer)} icon={<TrendingUp size={12} />} color="text-neon-yellow" />
                <StatRow label="Win Rate" value={`${getWinRate(viewPlayer)}%`} icon={<Star size={12} />} color="text-neon-purple" />
                <StatRow label="MVP" value={String(viewPlayer.stats.mvpCount)} icon={<Crown size={12} />} color="text-neon-yellow" />
                <StatRow label="ELO" value={String(viewPlayer.eloRating)} icon={<TrendingUp size={12} />} color="text-neon-blue" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Maps favorites</p>
                <div className="flex flex-wrap gap-1">
                  {viewPlayer.favoriteMaps.map((m) => (
                    <span key={m} className="px-2 py-1 rounded-lg bg-neon-blue/5 border border-neon-blue/10 text-xs text-neon-blue">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="card-glow rounded-xl p-5">
            <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={16} className="text-neon-purple" /> Joueurs par map
            </h3>
            <div className="space-y-2">
              {mapAssignments.filter((ma) => ma.players.length > 0).map((ma) => (
                <div key={ma.map} className="py-2 border-b border-dark-400/20 last:border-0">
                  <p className="text-xs text-gray-400 mb-1 font-rajdhani font-semibold">{ma.map}</p>
                  <div className="flex flex-wrap gap-1">
                    {ma.players.map((p) => (
                      <span key={p.id} className="px-2 py-0.5 rounded-full bg-dark-600 text-[10px] text-gray-300">{p.avatar} {p.pseudo}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-neon-purple" /> Nouveau joueur
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-rajdhani">Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {avatars.map((a) => (
                    <button key={a} onClick={() => setNewPlayer({ ...newPlayer, avatar: a })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border transition-all ${
                        newPlayer.avatar === a ? 'bg-neon-purple/10 border-neon-purple/30' : 'bg-dark-700 border-dark-400/30'
                      }`}>{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Pseudo</label>
                <input type="text" value={newPlayer.pseudo} onChange={(e) => setNewPlayer({ ...newPlayer, pseudo: e.target.value })} placeholder="Pseudo du joueur" className="w-full text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Rôle</label>
                  <select value={newPlayer.role} onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })} className="w-full text-sm">
                    <option value="">Choisir...</option>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Poste</label>
                  <select value={newPlayer.poste} onChange={(e) => setNewPlayer({ ...newPlayer, poste: e.target.value })} className="w-full text-sm">
                    <option value="">Choisir...</option>
                    {postes.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-rajdhani">Maps favorites</label>
                <div className="grid grid-cols-4 gap-2">
                  {MAPS.map((m) => (
                    <button key={m}
                      onClick={() => {
                        const maps = newPlayer.favoriteMaps.includes(m) ? newPlayer.favoriteMaps.filter((x) => x !== m) : [...newPlayer.favoriteMaps, m];
                        setNewPlayer({ ...newPlayer, favoriteMaps: maps });
                      }}
                      className={`px-2 py-2 rounded-lg text-xs border transition-all ${
                        newPlayer.favoriteMaps.includes(m) ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' : 'bg-dark-700 border-dark-400/30 text-gray-400'
                      }`}>{m}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleAdd} disabled={!newPlayer.pseudo}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white font-rajdhani font-bold text-sm disabled:opacity-30 hover:shadow-[0_0_20px_rgba(178,75,255,0.3)] transition-all">
                Ajouter le joueur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-dark-400/20 last:border-0">
      <span className="text-xs text-gray-500 flex items-center gap-1.5"><span className={color}>{icon}</span> {label}</span>
      <span className={`text-sm font-rajdhani font-bold ${color}`}>{value}</span>
    </div>
  );
}