import { Page } from '../types';
import {
  LayoutDashboard,
  Calendar,
  Map,
  Users,
  Trophy,
  Lightbulb,
  History,
  Menu,
  X,
  Gamepad2,
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { page: 'matches', label: 'Matchs', icon: <Calendar size={20} /> },
  { page: 'pickban', label: 'Pick & Ban', icon: <Map size={20} /> },
  { page: 'players', label: 'Joueurs', icon: <Users size={20} /> },
  { page: 'scores', label: 'Scores', icon: <Trophy size={20} /> },
  { page: 'strategies', label: 'Stratégies', icon: <Lightbulb size={20} /> },
  { page: 'history', label: 'Historique', icon: <History size={20} /> },
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onToggle} />
      )}

      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-dark-700 border border-dark-400 text-neon-blue"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 bg-dark-800 border-r border-dark-400/50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-6 border-b border-dark-400/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <Gamepad2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-orbitron text-lg font-bold text-white neon-text">DYNO EVA</h1>
              <p className="text-[10px] font-rajdhani tracking-[0.3em] text-neon-blue/70 uppercase">Esport Arena</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600/50 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-neon-blue' : 'text-gray-500'}>{item.icon}</span>
                <span className="font-rajdhani text-base">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue animate-glow-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-400/30">
          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-sm">🎮</div>
            <div>
              <p className="text-xs font-medium text-white">Coach Dyno</p>
              <p className="text-[10px] text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}