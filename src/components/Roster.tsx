import { Player } from '../types';

interface RosterProps { players: Player[]; }

export default function Roster({ players }: RosterProps) {
  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <div className="card-gold-banner p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold font-orbitron text-sm">D</span>
        </div>
        <h1 className="font-orbitron text-xl font-bold text-yellow-400 tracking-wider">ROSTER</h1>
      </div>

      <div className="space-y-3">
        {players.map((p) => (
          <div key={p.id} className="card-match p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-xl">
                {p.avatar}
              </div>
              <div>
                <p className="text-white font-bold">{p.pseudo}</p>
                <p className="text-xs text-gray-500">{p.role}</p>
              </div>
            </div
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${p.available ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {p.available ? 'DISPO' : 'INDISPO'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}