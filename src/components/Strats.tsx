import { Strategy } from '../types';
import { initialStrategies } from '../store';
import { Plus } from 'lucide-react';

export default function Strats() {
  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <div className="card-gold-banner p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold font-orbitron text-sm">D</span>
        </div>
        <h1 className="font-orbitron text-xl font-bold text-yellow-400 tracking-wider">STRATS</h1>
      </div>

      <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg font-rajdhani hover:shadow-[0_0_30px_#FFD70040] transition-all flex items-center justify-center gap-2">
        <Plus size={24} /> Nouvelle Strat
      </button>

      <div className="space-y-4">
        {initialStrategies.length === 0 && (
          <div className="card-match p-8 text-center text-gray-500">Aucune stratégie enregistrée.</div>
        )}
        {initialStrategies.map((strat) => (
          <div key={strat.id} className="card-match p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-yellow-400 font-bold">{strat.name}</h3>
              <span className={`text-[10px] px-2 py-1 rounded border ${strat.type === 'offensive' ? 'text-red-400 border-red-500/30' : 'text-blue-400 border-blue-500/30'}`}>
                {strat.type.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{strat.map}</p>
            <p className="text-sm text-gray-300">{strat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}