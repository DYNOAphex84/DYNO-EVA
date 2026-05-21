import { Page } from '../types';
import { Calendar, Trophy, Users, Target, Lightbulb, History, Menu, X, Gamepad2, ClipboardList, Search } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: { page: Page; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
  { page: 'matches', label: 'Matchs', sub: 'Prochains matchs et disponibilités', icon: <Calendar size={20} />, color: 'bg-red-500/10 text-red-400' },
  { page: 'scores', label: 'Résultats', sub: 'Historique des scores', icon: <Trophy size={20} />, color: 'bg-yellow-500/10 text-yellow-400' },
  { page: 'players', label: 'Roster', sub: 'Composition de l\'équipe', icon: <Users size={20} />, color: 'bg-blue-500/10 text-blue-400' },
  { page: 'pickban', label: 'Strats', sub: 'Picks et bans', icon: <Target size={20} />, color: 'bg-red-500/10 text-red-400' },
  { page: 'strategies', label: 'Compos', sub: 'Compositions par map', icon: <ClipboardList size={20} />, color: 'bg-green-500/10 text-green-400' },
  { page: 'history', label: 'Fiches', sub: 'Analyse des adversaires', icon: <Search size={20} />, color: 'bg-purple-500/10 text-purple-400' },
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={onToggle} />}

      <button onClick={onToggle} className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-full bg-dark-card border border-dark-border text-gold-500">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`fixed top-0 left-0 h-full z-40 w-80 bg-dark-bg border-r border-dark-border transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
              <Gamepad2 size={24} className="text-black" />
            </div>
            <div>
              <h1 className="font-orbitron text-xl font-bold gold-text">DYNO</h1>
              <p className="text-xs text-gray-500 font-rajdhani tracking-wider">ESPORT TEAM</p>
            </div>
          </div>

          {/* User Card */}
          <div className="card-dark p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-black font-bold text-lg font-orbitron">
              D
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">DYNOAphex</p>
              <p className="text-xs text-red-400">Admin</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <span className="text-red-400 text-xs">↪</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); if (window.innerWidth < 1024) onToggle(); }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  isActive ? 'card-gold border-gold-600/40' : 'hover:bg-dark-hover'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <div className="text-left flex-1">
                  <p className={`font-bold text-base ${isActive ? 'gold-text' : 'text-white'}`}>{item.label}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse-gold" />}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}