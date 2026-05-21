import { useState, useEffect } from 'react';
import { Match, Player, MapData } from '../types';
import { Calendar, Trophy, Target, Clock, MapPin } from 'lucide-react';

interface DashboardProps {
  matches: Match[];
  players: Player[];
  mapStats: MapData[];
  onNavigate: (page: any) => void;
}

export default function Dashboard({ matches, players, onNavigate }: DashboardProps) {
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming').sort((a, b) => new Date(`${a.date}T${a.time1}`).getTime() - new Date(`${b.date}T${b.time1}`).getTime());
  const nextMatch = upcomingMatches[0];

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nextMatch) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const matchDate = new Date(`${nextMatch.date}T${nextMatch.time1}`).getTime();
      const diff = matchDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextMatch]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Hero Banner */}
      <div className="card-gold p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent" />
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
            <span className="text-black font-bold text-2xl font-orbitron">D</span>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl font-bold gold-text mb-2">Prochains Matchs</h1>
          <p className="text-gray-400">Restez prêts pour la victoire</p>
        </div>
      </div>

      {/* Next Match Countdown */}
      {nextMatch && (
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-sm font-bold">Ligue</span>
            <span className="text-gold-500 font-orbitron font-bold">{nextMatch.date}</span>
          </div>

          <div className="card-gold p-6 text-center mb-6">
            <p className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
              <Clock size={16} /> Compte à rebours
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-orbitron font-bold gold-text">{timeLeft.days}j</span>
              </div>
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-orbitron font-bold gold-text">{timeLeft.hours}h</span>
              </div>
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-orbitron font-bold gold-text">{timeLeft.minutes}m</span>
              </div>
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-orbitron font-bold gold-text">{timeLeft.seconds}s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <span className="text-black font-bold font-orbitron">D</span>
              </div>
              <span className="text-2xl text-gray-500 font-orbitron">VS</span>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">{nextMatch.opponent}</p>
              <p className="text-sm text-gray-400 flex items-center gap-1 justify-end">
                <MapPin size={12} /> {nextMatch.arena}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate('matches')} className="card-dark p-5 text-left hover:border-gold-600/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-3">
            <Calendar size={20} className="text-red-400" />
          </div>
          <p className="text-2xl font-orbitron font-bold text-white">{upcomingMatches.length}</p>
          <p className="text-xs text-gray-500">Matchs à venir</p>
        </button>
        <button onClick={() => onNavigate('scores')} className="card-dark p-5 text-left hover:border-gold-600/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-3">
            <Trophy size={20} className="text-yellow-400" />
          </div>
          <p className="text-2xl font-orbitron font-bold text-white">{players.length}</p>
          <p className="text-xs text-gray-500">Joueurs actifs</p>
        </button>
      </div>

      {!nextMatch && (
        <div className="card-dark p-12 text-center">
          <p className="text-gray-500 mb-4">Aucun match prévu</p>
          <button onClick={() => onNavigate('matches')} className="px-6 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold hover:shadow-[0_0_20px_#FFD70040] transition-all">
            Ajouter un match
          </button>
        </div>
      )}
    </div>
  );
}