import React from 'react';
import { Match, Player, MapData } from '../types';
import { seasonProgressData } from '../store';
import {
  Trophy, Target, TrendingUp, Users, Swords, Crown,
  ChevronRight, Zap, Shield, Calendar,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';

interface DashboardProps {
  matches: Match[];
  players: Player[];
  mapStats: MapData[];
  onNavigate: (page: string) => void;
}

export default function Dashboard({ matches, players, mapStats, onNavigate }: DashboardProps) {
  const completedMatches = matches.filter((m) => m.status === 'completed');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const totalWins = completedMatches.filter((m) => {
    const teamWins = m.scores.filter((s) => s.teamScore > s.opponentScore).length;
    const oppWins = m.scores.filter((s) => s.opponentScore > s.teamScore).length;
    return teamWins > oppWins;
  }).length;
  const totalLosses = completedMatches.length - totalWins;
  const winRate = completedMatches.length > 0 ? Math.round((totalWins / completedMatches.length) * 100) : 0;

  const bestMap = [...mapStats].sort((a, b) => b.winRate - a.winRate)[0];
  const worstMap = [...mapStats].sort((a, b) => a.winRate - b.winRate)[0];
  const bestPlayer = [...players].sort((a, b) => {
    const kdaA = (a.stats.kills + a.stats.assists) / Math.max(a.stats.deaths, 1);
    const kdaB = (b.stats.kills + b.stats.assists) / Math.max(b.stats.deaths, 1);
    return kdaB - kdaA;
  })[0];

  const getMostMVP = (): string => {
    const sorted = [...players].sort((a, b) => b.stats.mvpCount - a.stats.mvpCount);
    return sorted[0] ? `${sorted[0].avatar} ${sorted[0].pseudo} (${sorted[0].stats.mvpCount})` : '—';
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white neon-text">DASHBOARD</h1>
          <p className="text-gray-400 text-sm mt-1 font-rajdhani">Vue d'ensemble de l'équipe Dyno EVA</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700 border border-dark-400/50">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-glow-pulse" />
          <span className="text-xs text-gray-400 font-rajdhani">Saison active</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Trophy size={20} />} label="Victoires" value={String(totalWins)}
          sub={`${winRate}% winrate`} color="text-neon-green" gradient="from-neon-green/20 to-transparent" />
        <StatCard icon={<Swords size={20} />} label="Matchs joués" value={String(completedMatches.length)}
          sub={`${totalLosses} défaites`} color="text-neon-blue" gradient="from-neon-blue/20 to-transparent" />
        <StatCard icon={<Users size={20} />} label="Joueurs actifs" value={String(players.filter(p => p.available).length)}
          sub={`${players.length} total`} color="text-neon-purple" gradient="from-neon-purple/20 to-transparent" />
        <StatCard icon={<Target size={20} />} label="Prochain match"
          value={upcomingMatches.length > 0 ? upcomingMatches[0].opponent : '—'}
          sub={upcomingMatches.length > 0 ? `${upcomingMatches[0].date} ${upcomingMatches[0].time}` : 'Aucun prévu'}
          color="text-neon-yellow" gradient="from-neon-yellow/20 to-transparent" small />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glow rounded-xl p-5">
          <h3 className="font-orbitron text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-neon-blue" /> Progression saison
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonProgressData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="week" tick={{ fill: '#888', fontSize: 12 }} axisLine={{ stroke: '#2a2a4a' }} />
                <YAxis tick={{ fill: '#888', fontSize: 12 }} axisLine={{ stroke: '#2a2a4a' }} />
                <Tooltip contentStyle={{ background: '#151525', border: '1px solid #00d4ff30', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                <Bar dataKey="wins" fill="#00ff88" radius={[4, 4, 0, 0]} name="Victoires" />
                <Bar dataKey="losses" fill="#ff3b3b" radius={[4, 4, 0, 0]} name="Défaites" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-glow rounded-xl p-5">
          <h3 className="font-orbitron text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <Shield size={16} className="text-neon-purple" /> Winrate par map
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mapStats} layout="vertical" barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#888', fontSize: 11 }} axisLine={{ stroke: '#2a2a4a' }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#ccc', fontSize: 11 }} width={70} axisLine={{ stroke: '#2a2a4a' }} />
                <Tooltip contentStyle={{ background: '#151525', border: '1px solid #b24bff30', borderRadius: '8px', color: '#fff', fontSize: 12 }}
                  formatter={(value: any) => [`${value}%`, 'Winrate']} />
                <Bar dataKey="winRate" radius={[0, 4, 4, 0]} name="Winrate">
                  {mapStats.map((entry, index) => (
                    <Cell key={index} fill={entry.winRate >= 70 ? '#00ff88' : entry.winRate >= 50 ? '#00d4ff' : '#ff3b3b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-glow rounded-xl p-5">
          <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={16} className="text-neon-yellow" /> Performances clés
          </h3>
          <div className="space-y-4">
            <PerfItem label="Meilleure map" value={bestMap?.name || '—'} sub={`${bestMap?.winRate}% WR`} color="text-neon-green" />
            <PerfItem label="Pire map" value={worstMap?.name || '—'} sub={`${worstMap?.winRate}% WR`} color="text-neon-red" />
            <PerfItem label="Meilleur joueur"
              value={bestPlayer ? `${bestPlayer.avatar} ${bestPlayer.pseudo}` : '—'}
              sub={`KDA: ${bestPlayer ? ((bestPlayer.stats.kills + bestPlayer.stats.assists) / Math.max(bestPlayer.stats.deaths, 1)).toFixed(1) : '0'}`}
              color="text-neon-yellow" />
            <PerfItem label="MVP le plus fréquent" value={getMostMVP()} sub="cette saison" color="text-neon-purple" />
          </div>
        </div>

        <div className="card-glow rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-orbitron text-sm font-semibold text-white flex items-center gap-2">
              <Calendar size={16} className="text-neon-blue" /> Prochains matchs
            </h3>
            <button onClick={() => onNavigate('matches')}
              className="text-xs text-neon-blue hover:text-white flex items-center gap-1 transition-colors">
              Voir tout <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingMatches.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">Aucun match à venir</p>
            )}
            {upcomingMatches.slice(0, 3).map((match) => (
              <div key={match.id}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-700/50 border border-dark-400/30 hover:border-neon-blue/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{match.opponentLogo}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{match.opponent}</p>
                    <p className="text-xs text-gray-500">{match.division} · {match.format}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-rajdhani text-neon-blue">{match.date}</p>
                  <p className="text-xs text-gray-500">{match.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Elo Leaderboard */}
      <div className="card-glow rounded-xl p-5">
        <h3 className="font-orbitron text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Crown size={16} className="text-neon-yellow" /> Classement ELO interne
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...players].sort((a, b) => b.eloRating - a.eloRating).map((player, idx) => (
            <div key={player.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                idx === 0 ? 'bg-neon-yellow/5 border-neon-yellow/20'
                : idx === 1 ? 'bg-gray-300/5 border-gray-400/20'
                : idx === 2 ? 'bg-neon-orange/5 border-neon-orange/20'
                : 'bg-dark-700/30 border-dark-400/30'
              }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-orbitron ${
                idx === 0 ? 'bg-neon-yellow/20 text-neon-yellow'
                : idx === 1 ? 'bg-gray-300/20 text-gray-300'
                : idx === 2 ? 'bg-neon-orange/20 text-neon-orange'
                : 'bg-dark-500 text-gray-400'
              }`}>
                {idx + 1}
              </div>
              <span className="text-xl">{player.avatar}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{player.pseudo}</p>
                <p className="text-xs text-gray-500">{player.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-orbitron font-bold text-neon-blue">{player.eloRating}</p>
                <p className="text-[10px] text-gray-500">ELO</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, gradient, small }: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  color: string; gradient: string; small?: boolean;
}) {
  return (
    <div className="card-glow rounded-xl p-4 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${gradient} rounded-bl-full opacity-50`} />
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-xs text-gray-500 font-rajdhani uppercase tracking-wider">{label}</p>
      <p className={`font-orbitron font-bold text-white mt-1 ${small ? 'text-sm' : 'text-2xl'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

function PerfItem({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-dark-400/30 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="text-right">
        <span className={`text-sm font-medium ${color}`}>{value}</span>
        <span className="text-xs text-gray-600 ml-2">{sub}</span>
      </div>
    </div>
  );
}