import { Match, Player } from '../types';
import { Trophy } from 'lucide-react';

interface ResultsProps { matches: Match[]; players: Player[]; }

export default function Results({ matches, players }: ResultsProps) {
  const completedMatches = matches.filter((m) => m.status === 'completed');

  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <div className="card-gold-banner p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold font-orbitron text-sm">D</span>
        </div>
        <h1 className="font-orbitron text-xl font-bold text-yellow-400 tracking-wider">RÉSULTATS</h1>
      </div>

      <div className="space-y-4">
        {completedMatches.length === 0 && (
          <div className="card-match p-8 text-center text-gray-500">Aucun résultat pour le moment.</div>
        )}
        {completedMatches.map((match) => {
          const teamWins = match.scores.filter((s) => s.teamScore > s.opponentScore).length;
          const oppWins = match.scores.filter((s) => s.opponentScore > s.teamScore).length;
          const won = teamWins > oppWins;

          return (
            <div key={match.id} className="card-match p-5">
              <div className="flex items-center justify-between mb-4">
                <span className={`font-orbitron font-bold text-xl ${won ? 'text-green-400' : 'text-red-400'}`}>
                  {won ? 'VICTOIRE' : 'DÉFAITE'}
                </span>
                <span className="text-white font-bold text-2xl font-orbitron">{teamWins} - {oppWins}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">DYNO vs {match.opponent}</span>
                <span className="text-xs text-gray-500">{match.date}</span>
              </div>
              <div className="space-y-2">
                {match.scores.map((score, idx) => (
                  <div key={idx} className="flex justify-between text-sm p-2 rounded bg-[#111] border border-[#2A2A2A]">
                    <span className="text-gray-400">{score.map}</span>
                    <span className={score.teamScore > score.opponentScore ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {score.teamScore} - {score.opponentScore}
                    </span>
                  </div>
                ))}
              </div>
              {match.mvp && (
                <div className="mt-4 flex items-center gap-2 text-yellow-400 text-sm">
                  <Trophy size={14} /> MVP: {players.find((p) => p.id === match.mvp)?.pseudo}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}