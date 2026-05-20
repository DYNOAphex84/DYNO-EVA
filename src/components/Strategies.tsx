import { useState } from 'react';
import { Strategy } from '../types';
import { MAPS } from '../store';
import {
  Lightbulb, Plus, X, Save, Sword, Shield, Map, FileText, Clock, User,
} from 'lucide-react';

interface StrategiesProps {
  strategies: Strategy[];
  onAddStrategy: (strategy: Strategy) => void;
}

export default function Strategies({ strategies, onAddStrategy }: StrategiesProps) {
  const [showForm, setShowForm] = useState(false);
  const [filterMap, setFilterMap] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'offensive' | 'defensive'>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [newStrategy, setNewStrategy] = useState({ name: '', map: MAPS[0], type: 'offensive' as 'offensive' | 'defensive', description: '', notes: '' });

  const filtered = strategies.filter((s) => {
    if (filterMap !== 'all' && s.map !== filterMap) return false;
    if (filterType !== 'all' && s.type !== filterType) return false;
    return true;
  });

  const handleAdd = () => {
    if (!newStrategy.name || !newStrategy.description) return;
    onAddStrategy({
      id: `s${Date.now()}`, name: newStrategy.name, map: newStrategy.map,
      type: newStrategy.type, description: newStrategy.description, notes: newStrategy.notes,
      createdBy: 'Coach Dyno', createdAt: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
    setNewStrategy({ name: '', map: MAPS[0], type: 'offensive', description: '', notes: '' });
  };

  const viewStrat = strategies.find((s) => s.id === selectedStrategy);

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white neon-text">STRATÉGIES</h1>
          <p className="text-gray-400 text-sm mt-1 font-rajdhani">Fiches tactiques et plans de jeu</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow hover:bg-neon-yellow/20 transition-all font-rajdhani font-semibold text-sm">
          <Plus size={16} /> Nouvelle stratégie
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={filterMap} onChange={(e) => setFilterMap(e.target.value)} className="text-sm rounded-lg">
          <option value="all">Toutes les maps</option>
          {MAPS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <div className="flex gap-1 bg-dark-700 rounded-lg p-1">
          {(['all', 'offensive', 'defensive'] as const).map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-rajdhani font-semibold transition-all ${
                filterType === t ? (t === 'offensive' ? 'bg-neon-red/20 text-neon-red' : t === 'defensive' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-dark-500 text-white') : 'text-gray-400'
              }`}>
              {t === 'all' ? 'Toutes' : t === 'offensive' ? '⚔️ Offensif' : '🛡️ Défensif'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 && (
            <div className="card-glow rounded-xl p-12 text-center">
              <Lightbulb size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Aucune stratégie trouvée</p>
            </div>
          )}
          {filtered.map((strat) => (
            <div key={strat.id} onClick={() => setSelectedStrategy(strat.id)}
              className={`card-glow rounded-xl p-4 cursor-pointer transition-all ${selectedStrategy === strat.id ? 'ring-1 ring-neon-yellow/30' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  strat.type === 'offensive' ? 'bg-neon-red/10 border-neon-red/20' : 'bg-neon-blue/10 border-neon-blue/20'
                }`}>
                  {strat.type === 'offensive' ? <Sword size={20} className="text-neon-red" /> : <Shield size={20} className="text-neon-blue" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-orbitron text-sm font-bold text-white">{strat.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      strat.type === 'offensive' ? 'bg-neon-red/10 text-neon-red border border-neon-red/20' : 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                    }`}>{strat.type === 'offensive' ? 'Offensif' : 'Défensif'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><Map size={10} /> {strat.map}</span>
                    <span className="flex items-center gap-1"><User size={10} /> {strat.createdBy}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {strat.createdAt}</span>
                  </div>
                  <p className="text-xs text-gray-400">{strat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          {viewStrat ? (
            <div className="card-glow rounded-xl p-5 sticky top-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                  viewStrat.type === 'offensive' ? 'bg-neon-red/10 border-neon-red/20' : 'bg-neon-blue/10 border-neon-blue/20'
                }`}>
                  {viewStrat.type === 'offensive' ? <Sword size={18} className="text-neon-red" /> : <Shield size={18} className="text-neon-blue" />}
                </div>
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-white">{viewStrat.name}</h3>
                  <p className="text-xs text-gray-500">{viewStrat.map} · {viewStrat.type}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FileText size={10} /> Description</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{viewStrat.description}</p>
                </div>
                {viewStrat.notes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Lightbulb size={10} className="text-neon-yellow" /> Notes du coach</p>
                    <p className="text-sm text-neon-yellow/80 leading-relaxed bg-neon-yellow/5 rounded-lg p-3 border border-neon-yellow/10">{viewStrat.notes}</p>
                  </div>
                )}
                <div className="pt-3 border-t border-dark-400/30 text-xs text-gray-600">
                  <p>Créé par {viewStrat.createdBy} le {viewStrat.createdAt}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-glow rounded-xl p-8 text-center">
              <FileText size={30} className="text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Sélectionnez une stratégie</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
                <Lightbulb size={20} className="text-neon-yellow" /> Nouvelle stratégie
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Nom</label>
                <input type="text" value={newStrategy.name} onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })} placeholder="ex: Rush B Reactor" className="w-full text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Map</label>
                  <select value={newStrategy.map} onChange={(e) => setNewStrategy({ ...newStrategy, map: e.target.value })} className="w-full text-sm">
                    {MAPS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Type</label>
                  <select value={newStrategy.type} onChange={(e) => setNewStrategy({ ...newStrategy, type: e.target.value as any })} className="w-full text-sm">
                    <option value="offensive">⚔️ Offensif</option>
                    <option value="defensive">🛡️ Défensif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Description</label>
                <textarea value={newStrategy.description} onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })} placeholder="Décrivez la stratégie..." rows={4} className="w-full text-sm resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-rajdhani">Notes du coach</label>
                <textarea value={newStrategy.notes} onChange={(e) => setNewStrategy({ ...newStrategy, notes: e.target.value })} placeholder="Notes additionnelles..." rows={3} className="w-full text-sm resize-none" />
              </div>
              <button onClick={handleAdd} disabled={!newStrategy.name || !newStrategy.description}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-yellow to-neon-orange text-dark-900 font-rajdhani font-bold text-sm disabled:opacity-30 hover:shadow-[0_0_20px_rgba(255,214,0,0.3)] transition-all flex items-center justify-center gap-2">
                <Save size={16} /> Créer la stratégie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}