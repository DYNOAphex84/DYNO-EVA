import { useState, useEffect } from 'react';
import { Page, Match, Player, Strategy, MatchScore } from './types';
import { initialPlayers, initialMatches, initialStrategies, mapStatsData } from './store';
import Sidebar from './components/Sidebar';
import Matches from './components/Matches';
import Results from './components/Results';
import Strats from './components/Strats';
import Compos from './components/Compos';
import Roster from './components/Roster';
import { Download, Bell, Sun } from 'lucide-react';

function useLocalState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('matches');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [matches, setMatches] = useLocalState<Match[]>('dyno-matches', initialMatches);
  const [players, setPlayers] = useLocalState<Player[]>('dyno-players', initialPlayers);
  const [strategies, setStrategies] = useLocalState<Strategy[]>('dyno-strategies', initialStrategies);
  
  // PWA Install
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); setShowInstallBtn(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') setShowInstallBtn(false);
        setDeferredPrompt(null);
      });
    }
  };

  const handleAddMatch = (match: Match) => {
    setMatches((prev) => [...prev, match]);
  };
  const handleUpdateMatch = (match: Match) => {
    setMatches((prev) => prev.map((m) => (m.id === match.id ? match : m)));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'matches': return <Matches matches={matches} players={players} onAddMatch={handleAddMatch} onUpdateMatch={handleUpdateMatch} />;
      case 'results': return <Results matches={matches} players={players} />;
      case 'strats': return <Strats />;
      case 'compos': return <Compos players={players} />;
      case 'roster': return <Roster players={players} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <h2 className="font-orbitron text-2xl text-yellow-400 mb-2">DYNO ESPORT</h2>
          <p>Page {currentPage} en construction...</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-inter">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="lg:ml-72 min-h-screen relative pb-20">
        {/* Top Bar Mobile/Desktop */}
        <div className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-[#0D0D0D]/90 backdrop-blur-md z-30 flex items-center justify-between px-4 border-b border-[#1A1A1A]">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg border border-[#2A2A2A] text-yellow-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          
          <div className="hidden lg:flex items-center gap-3 ml-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <span className="text-black font-bold font-orbitron text-xs">D</span>
            </div>
            <span className="font-orbitron font-bold text-yellow-400">DYNO</span>
            <span className="text-[10px] text-gray-500 tracking-widest">ESPORT</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {showInstallBtn && (
              <button onClick={handleInstallClick} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs hover:bg-yellow-500/20 transition-all">
                <Download size={12} /> Installer
              </button>
            )}
            <button className="p-2 rounded-full border border-[#2A2A2A] text-yellow-400 hover:bg-[#1A1A1A]"><Sun size={18} /></button>
            <button className="p-2 rounded-full border border-[#2A2A2A] text-yellow-400 hover:bg-[#1A1A1A]"><Bell size={18} /></button>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold border border-red-400">
              D
            </div>
          </div>
        </div>

        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}