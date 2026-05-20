import { useState } from 'react';
import { Match, Player, MapData } from '../types';
import { History as HistoryIcon, Trophy, TrendingUp, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';

interface HistoryProps {
  matches: Match[];
  players: Player[];
  mapStats: MapData[];
}

export default function History({ matches, players }: HistoryProps) {
  const [filterDivision, setFilterDivision] = useState<string>('all');
  const [filterOpponent, setFilterOpponent] = useState<string>('all');

  const completedMatches = matches.filter((m) => m.status === 'completed');

  const filtered = completedMatches.filter((m) => {
    if (filterDivision !== 'all' && m.division !== filterDivision) return false;
    if (filterOpponent !== 'all' && m.opponent !== filterOpponent) return false;
    return true;
  });

  const divisions = [...new Set(matches.map((m) => m.division))];
  const opponents = [...new Set(matches.map((m) => m.opponent))];

  const isWin = (m: Match) => {
    const tw = m.scores.filter((s) => s.teamScore > s.opponentScore).length;
    const ow = m.scores.filter((s) => s.opponentScore > s.teamScore).length;
    return tw > ow;
  };

  const totalWins = completedMatches.filter(isWin).length;

  const opponentStats = opponents.map((opp) => {
    const oppMatches = completedMatches.filter((m) => m.opponent === opp);
    const wins = oppMatches.filter(isWin).length;
    return { opponent: opp, matches: oppMatches.length, wins, losses: oppMatches.length - wins };
  });

  const pieData = [
    { name: 'Victoires', value: totalWins },
    { name: 'Défaites', value: completedMatches.length - totalWins },
  ];
  const COLORS = ['#00ff88', '#ff3b3b'];

  const divisionStats = divisions.map((div) => {
    const divMatches = completedMatches.filter((m) => m.division === div);
    const wins = divMatches.filter(isWin).length;
    return {
      division: div.replace('Division ', 'Div '),
      winRate: divMatches.length > 0 ? Math.round((wins / divMatches.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white neon-text">HISTORIQUE</h1>
        <p className="text-gray-400 text-sm mt-1 font-rajdhani">Historique complet des résultats</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-glow rounded-xl p-4 text-center">
          <p className="font-orbitron text-2xl font-bold text-white">{completedMatches.length}</p>
          <p className="text-xs text-gray-500 font-rajdhani">Matchs joués</p>
        </div>
        <div className="card-glow rounded-xl p-4 text-center">
          <p className="font-orbitron text-2xl font-bold text-neon-green">{totalWins}</p>
          <p className="text-xs text-gray-500 font-rajdhani">Victoires</p>
        </div>
        <div className="card-glow rounded-xl p-4 text-center">
          <p className="font-orbitron text-2xl font-bold text-neon-red">{completedMatches.length - totalWins}</p>
          <p className="text-xs text-gray-500 font-rajdhani">Défaites</p>
        </div>
        <div className="card-glow rounded-xl p-4 text-center">
          <p className="font-orbitron text-2xl font-bold text-neon-blue">
            {completedMatches.length > 0 ? Math.round((totalWins / completedMatches.length) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-500 font-rajdhani">Winrate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glow rounded-xl p-5">
          <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-neon-green" /> Ratio V/D
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((_entry, index) => <Cell key={index} fill={COLORS[index]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#151525', border: '1px solid #00d4ff30', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#888' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-glow rounded-xl p-5">
          <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-neon-purple" /> Performance par division
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={divisionStats} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="division" tick={{ fill: '#888', fontSize: 11 }} axisLine={{ stroke: '#2a2a4a' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#888', fontSize: 11 }} axisLine={{ stroke: '#2a2a4a' }} />
                <Tooltip contentStyle={{ background: '#151525', border: '1px solid #b24bff30', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                <Bar dataKey="winRate" fill="#b24bff" radius={[4, 4, 0, 0]} name="Winrate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-glow rounded-xl p-5">
        <h3 className="font-orbitron text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <HistoryIcon size={16} className="text-neon-blue" /> Bilan par adversaire
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {opponentStats.map((os) => (
            <div key={os.opponent} className="p-3 rounded-lg bg-dark-700/50 border border-dark-400/30">
              <p className="text-sm font-medium text-white mb-2">{os.opponent}</p>
              <div className="flex items-center gap-4">
                <div><p className="text-xs text-gray-500">V</p><p className="text-sm font-rajdhani font-bold text-neon-green">{os.wins}</p></div>
                <div><p className="text-xs text-gray-500">D</p><p className="text-sm font-rajdhani font-bold text-neon-red">{os.losses}</p></div>
                <div className="ml-auto">
                  <div className={`px-2 py-1 rounded-lg text-xs font-orbitron font-bold ${
                    os.wins > os.losses ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-red/10 text-neon-red'
                  }`}>{os.matches > 0 ? Math.round((os.wins / os.matches) * 100) : 0}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-glow rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-orbitron text-sm font-semibold text-white flex items-center gap-2">
            <Calendar size={16} className="text-neon-yellow" /> Tous les matchs
          </h3>
          <div className="flex gap-2">
            <select value={filterDivision} onChange={(e) => setFilterDivision(e.target.value)} className="text-xs rounded-lg">
              <option value="all">Toutes divisions</option>
              {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterOpponent} onChange={(e) => setFilterOpponent(e.target.value)} className="text-xs rounded-lg">
              <option value="all">Tous adversaires</option>
              {opponents.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-dark-400/30">
                <th className="text-left py-2 font-rajdhani">Date</th>
                <th className="text-left py-2 font-rajdhani">Adversaire</th>
                <th className="text-left py-2 font-rajdhani">Division</th>
                <th className="text-center py-2 font-rajdhani">Format</th>
                <th className="text-center py-2 font-rajdhani">Score</th>
                <th className="text-center py-2 font-rajdhani">Résultat</th>
                <th className="text-center py-2 font-rajdhani">MVP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((match) => {
                const tw = match.scores.filter((s) => s.teamScore > s.opponentScore).length;
                const ow = match.scores.filter((s) => s.opponentScore > s.teamScore).length;
                const won = tw > ow;
                const mvpPlayer = players.find((p) => p.id === match.mvp);
                return (
                  <tr key={match.id} className="border-b border-dark-400/15 hover:bg-dark-700/30">
                    <td className="py-3 text-gray-400">{match.date}</td>
                    <td className="py-3"><span className="flex items-center gap-1.5"><span>{match.opponentLogo}</span><span className="text-white">{match.opponent}</span></span></td>
                    <td className="py-3 text-gray-400">{match.division}</td>
                    <td className="py-3 text-center"><span className="px-2 py-0.5 rounded bg-dark-600 text-gray-300 font-orbitron text-[10px]">{match.format}</span></td>
                    <td className="py-3 text-center font-orbitron font-bold">
                      <span className={won ? 'text-neon-green' : 'text-gray-400'}>{tw}</span>
                      <span className="text-gray-600 mx-1">-</span>
                      <span className={!won ? 'text-neon-red' : 'text-gray-400'}>{ow}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${won ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-red/10 text-neon-red'}`}>{won ? 'W' : 'L'}</span>
                    </td>
                    <td className="py-3 text-center text-neon-yellow">{mvpPlayer ? `${mvpPlayer.avatar} ${mvpPlayer.pseudo}` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}