import { Player } from '../types';
import { initialCompositions } from '../store';
import { Plus } from 'lucide-react';

interface ComposProps { players: Player[]; }

export default function Compos({ players }: ComposProps) {
  return (
    <div className="space-y-6 animate-slide-up pb-20">
      {/* Banner */}
      <div className="card-gold-banner p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-4 shadow-[0_0_20px_#FFD70040]">
          <span className="text-black font-bold font-orbitron text-xl">D</span>
        </div>
        <h1 className="font-orbitron text-xl font-bold text-yellow-400 tracking-wider flex items-center gap-2">
          <span>📋</span> Compos
        </h1>
      </div>

      <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg font-rajdhani hover:shadow-[0_0_30px_#FFD70040] transition-all flex items-center justify-center gap-2">
        <Plus size={24} /> Compo
      </button>

      <div className="space-y-4">
        {initialCompositions.map((comp) => (
          <div key={comp.id} className="card-match p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🗺️</span>
              <h3 className="text-yellow-400 font-bold text-lg">{comp.map}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {comp.players.map((pid) => {
                const p = players.find((pl) => pl.id === pid);
                return p ? (
                  <span key={pid} className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold">
                    {p.pseudo}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}