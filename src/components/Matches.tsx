import { useState, useEffect } from 'react';
import { Match, Player, Availability } from '../types';
import { DIVISIONS } from '../store';
import { Plus, X, Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface MatchesProps {
  matches: Match[]; players: Player[];
  onAddMatch: (match: Match) => void; onUpdateMatch: (match: Match) => void;
}

export default function Matches({ matches, players, onAddMatch, onUpdateMatch }: MatchesProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    date: '', time1: '', time2: '', arena: 'Arène 1', opponent: '', type: 'SCRIM', status: 'upcoming', lineup: [], scores: [], availability: {},
  });

  const upcomingMatches = matches.filter((m) => m.status === 'upcoming').sort((a, b) => new Date(`${a.date}T${a.time1}`).getTime() - new Date(`${b.date}T${b.time1}`).getTime());

  const handleSubmit = () => {
    if (!newMatch.date || !newMatch.opponent || !newMatch.time1) return;
    onAddMatch({
      id: `m${Date.now()}`, date: newMatch.date!, time1: newMatch.time1!, time2: newMatch.time2,
      arena: (newMatch.arena as any) || 'Arène 1', opponent: newMatch.opponent!,
      type: (newMatch.type as any) || 'SCRIM', status: 'upcoming', lineup: newMatch.lineup || [], scores: [], availability: {},
    });
    setShowForm(false);
    setNewMatch({ date: '', time1: '', time2: '', arena: 'Arène 1', opponent: '', type: 'SCRIM', status: 'upcoming', lineup: [], scores: [], availability: {} });
  };

  const setAvailability = (matchId: string, playerId: string, status: Availability) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;
    const newAvail = { ...match.availability, [playerId]: status };
    onUpdateMatch({ ...match, availability: newAvail });
  };

  const addToCalendar = (match: Match) => {
    const dateStr = match.date.replace(/-/g, '');
    const timeStr = match.time1.replace(':', '') + '00';
    const title = encodeURIComponent(`DYNO vs ${match.opponent}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T${timeStr}/${dateStr}T${timeStr}&details=Arène: ${match.arena}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-slide-up pb-20">
      {/* Banner */}
      <div className="card-gold-banner p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold font-orbitron text-sm">D</span>
        </div>
        <div>
          <h1 className="font-orbitron text-xl font-bold text-yellow-400 tracking-wider">PROCHAINS MATCHS</h1>
        </div>
      </div>

      {/* Add button */}
      <button onClick={() => setShowForm(true)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg font-rajdhani hover:shadow-[0_0_30px_#FFD70040] transition-all flex items-center justify-center gap-2">
        <Plus size={24} /> Nouveau match
      </button>

      {/* Match Cards */}
      <div className="space-y-4">
        {upcomingMatches.map((match) => {
          const dispoPlayers = players.filter((p) => match.availability[p.id] === 'dispo');
          const indispoPlayers = players.filter((p) => match.availability[p.id] === 'indispo');
          const pendingPlayers = players.filter((p) => !match.availability[p.id]);

          return (
            <div key={match.id} className="card-match p-5 space-y-4">
              {/* Type + Date */}
              <div className="flex items-center justify-between">
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                  match.type === 'SCRIM' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  match.type === 'LIGUE' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>{match.type}</span>
                <span className="text-yellow-400 font-orbitron text-sm">{match.date}</span>
              </div>

              {/* Countdown */}
              <Countdown date={match.date} time={match.time1} />

              {/* VS */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold font-orbitron text-xs">D</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 tracking-widest">DYNO VS</p>
                  <p className="text-white font-bold text-lg">DYNO VS {match.opponent}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} /> {match.arena}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111111] border border-[#2A2A2A]">
                <span className="text-xl">⏰</span>
                <span className="text-yellow-400 font-bold font-orbitron">{match.time1}{match.time2 ? ` / ${match.time2}` : ''}</span>
              </div>

              {/* Dispo */}
              {dispoPlayers.length > 0 && (
                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                  <p className="text-xs text-green-400 font-bold mb-2 flex items-center gap-1"><CheckCircle size={12} /> DISPO ({dispoPlayers.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {dispoPlayers.map((p) => (
                      <span key={p.id} className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold">{p.pseudo}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Indispo */}
              {indispoPlayers.length > 0 && (
                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                  <p className="text-xs text-red-400 font-bold mb-2 flex items-center gap-1"><XCircle size={12} /> INDISPO ({indispoPlayers.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {indispoPlayers.map((p) => (
                      <span key={p.id} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">{p.pseudo}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending */}
              {pendingPlayers.length > 0 && (
                <div className="p-3 rounded-xl bg-gray-500/5 border border-gray-500/20">
                  <p className="text-xs text-gray-400 font-bold mb-2">EN ATTENTE ({pendingPlayers.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {pendingPlayers.map((p) => (
                      <span key={p.id} className="px-3 py-1.5 rounded-lg bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs">{p.pseudo}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar button */}
              <button onClick={() => addToCalendar(match)}
                className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-all">
                📅 Ajouter au calendrier
              </button>

              {/* Dispo/Indispo buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setAvailability(match.id, 'me', 'dispo')}
                  className="py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_#FFD70040] transition-all">
                  ✅ Dispo
                </button>
                <button onClick={() => setAvailability(match.id, 'me', 'indispo')}
                  className="py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all">
                  🚫 Indispo
                </button>
              </div>
            </div>
          );
        })}

        {upcomingMatches.length === 0 && (
          <div className="card-match p-12 text-center">
            <p className="text-gray-500 mb-4">Aucun match prévu</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold">
              Ajouter un match
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80">
          <div className="w-full sm:max-w-lg bg-[#111111] rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-lg font-bold text-yellow-400">Nouveau match</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Date</label>
                  <input type="date" value={newMatch.date} onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Type</label>
                  <select value={newMatch.type} onChange={(e) => setNewMatch({ ...newMatch, type: e.target.value as any })} className="w-full">
                    <option value="SCRIM">SCRIM</option>
                    <option value="LIGUE">LIGUE</option>
                    <option value="TOURNOI">TOURNOI</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Heure 1</label>
                  <input type="time" value={newMatch.time1} onChange={(e) => setNewMatch({ ...newMatch, time1: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Heure 2 (opt.)</label>
                  <input type="time" value={newMatch.time2} onChange={(e) => setNewMatch({ ...newMatch, time2: e.target.value })} className="w-full" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Arène</label>
                <select value={newMatch.arena} onChange={(e) => setNewMatch({ ...newMatch, arena: e.target.value as any })} className="w-full">
                  <option value="Arène 1">Arène 1</option>
                  <option value="Arène 2">Arène 2</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Adversaire</label>
                <input type="text" value={newMatch.opponent} onChange={(e) => setNewMatch({ ...newMatch, opponent: e.target.value })} placeholder="Nom de l'équipe" className="w-full" />
              </div>
              <button onClick={handleSubmit} disabled={!newMatch.date || !newMatch.opponent || !newMatch.time1}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg disabled:opacity-30 hover:shadow-[0_0_20px_#FFD70040] transition-all">
                Créer le match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Countdown({ date, time }: { date: string; time: string }) {
  const [tl, setTl] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const iv = setInterval(() => {
      const diff = new Date(`${date}T${time}`).getTime() - Date.now();
      if (diff > 0) setTl({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    }, 1000);
    return () => clearInterval(iv);
  }, [date, time]);
  return (
    <div className="p-4 rounded-xl bg-[#111111] border border-[#2A2A2A] text-center">
      <p className="text-[10px] text-gray-500 tracking-[0.3em] mb-1">COUNTDOWN</p>
      <p className="text-2xl sm:text-3xl font-orbitron font-bold text-yellow-400">
        {tl.d}j {tl.h}h {tl.m}m {tl.s}s
      </p>
    </div>
  );
}