import { Page } from '../types';
import { Menu, X } from 'lucide-react';

interface SidebarProps {
  currentPage: Page; onNavigate: (page: Page) => void; isOpen: boolean; onToggle: () => void;
}

const navItems: { page: Page; label: string; icon: string }[] = [
  { page: 'matches', label: 'MATCHS', icon: '📅' },
  { page: 'results', label: 'RÉSULTATS', icon: '🏆' },
  { page: 'strats', label: 'STRATS', icon: '🎯' },
  { page: 'compos', label: 'COMPOS', icon: '📋' },
  { page: 'fiches', label: 'FICHES', icon: '🔍' },
  { page: 'notes', label: 'NOTES', icon: '📊' },
  { page: 'objectifs', label: 'OBJECTIFS', icon: '🎯' },
  { page: 'replays', label: 'REPLAYS', icon: '🎬' },
  { page: 'roster', label: 'ROSTER', icon: '👥' },
  { page: 'stats', label: 'STATS', icon: '📈' },
  { page: 'admin', label: 'ADMIN', icon: '⚙️' },
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={onToggle} />}
      <aside className={`fixed top-0 left-0 h-full z-50 w-72 bg-[#0D0D0D] border-r border-[#1A1A1A] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Header */}
        <div className="p-5 border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <span className="text-black font-bold text-sm font-orbitron">D</span>
            </div>
            <div>
              <h1 className="font-orbitron text-lg font-bold text-yellow-400">DYNO</h1>
              <p className="text-[10px] text-gray-500 tracking-wider">ESPORT TEAM</p>
            </div>
          </div>
          <button onClick={onToggle} className="lg:hidden p-2 rounded-lg border border-[#2A2A2A] text-yellow-400">
            <X size={18} />
          </button>
        </div>

        {/* User */}
        <div className="p-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141414] border border-[#2A2A2A]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-black font-bold font-orbitron">D</div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">DYNOAphex</p>
              <p className="text-xs text-red-400">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button key={item.page} onClick={() => { onNavigate(item.page); if (window.innerWidth < 1024) onToggle(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                }`}>
                <span className="text-lg">{item.icon}</span>
                <span className="font-rajdhani tracking-wide">{item.label}</span>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-yellow-400" />}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}