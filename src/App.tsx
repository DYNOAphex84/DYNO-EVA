import { useState, useEffect } from 'react';
import { Page, Match, Player, Strategy, PickBanRecord, MatchScore } from './types';
import { initialPlayers, initialMatches, initialStrategies, mapStatsData } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Matches from './components/Matches';
import PickBan from './components/PickBan';
import Players from './components/Players';
import Scores from './components/Scores';
import Strategies from './components/Strategies';
import History from './components/History';
import { Download, Bell } from 'lucide-react';

function useLocalState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : initial; }
    catch { return initial; }
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
  const [notification, setNotification] = useState<string | null>(null);
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
      deferredPrompt.userChoice.then((r: any) => { if (r.outcome === 'accepted') setShowInstallBtn(false); setDeferredPrompt(null); });
    }
  };

  const showNotification = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const handleAddMatch = (match: Match) => { setMatches((prev) => [...prev, match]); showNotification(`✅ Match contre ${match.opponent} ajouté !`); };
  const handleUpdateMatch = (match: Match) => { setMatches((prev) => prev.map((m) => (m.id === match.id ? match : m))); };
  const handleSavePickBan = (matchId: string, pickBan: PickBanRecord) => { setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, pickBan } : m))); showNotification('✅ Pick & Ban sauvegardé !'); };
  const handleUpdateMatchScores = (matchId: string, scores: MatchScore[], mvp?: string) => { setMatches((prev) => prev.map((m) => m.id === matchId ? { ...m, scores, mvp, status: 'completed' as const } : m)); showNotification('✅ Scores enregistrés !'); };
  const handleAddPlayer = (player: Player) => { setPlayers((prev) => [...prev, player]); showNotification(`✅ ${player.pseudo} ajouté !`); };
  const handleUpdatePlayer = (player: Player) => { setPlayers((prev) => prev.map((p) => (p.id === player.id ? player : p))); };
  const handleToggleAvailability = (id: string) => { setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))); };
  const handleAddStrategy = (strategy: Strategy) => { setStrategies((prev) => [...prev, strategy]); showNotification(`✅ Stratégie créée !`); };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard matches={matches} players={players} mapStats={mapStatsData} onNavigate={setCurrentPage} />;
      case 'matches': return <Matches matches={matches} players={players} onAddMatch={handleAddMatch} onUpdateMatch={handleUpdateMatch} />;
      case 'pickban': return <PickBan matches={matches} mapStats={mapStatsData} onSavePickBan={handleSavePickBan} />;
      case 'players': return <Players players={players} onAddPlayer={handleAddPlayer} onUpdatePlayer={handleUpdatePlayer} onToggleAvailability={handleToggleAvailability} />;
      case 'scores': return <Scores matches={matches} players={players} onUpdateMatchScores={handleUpdateMatchScores} />;
      case 'strategies': return <Strategies strategies={strategies} onAddStrategy={handleAddStrategy} />;
      case 'history': return <History matches={matches} players={players} mapStats={mapStatsData} />;
      default: return null;
    }
  };

  const upcomingCount = matches.filter((m) => m.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="lg:ml-80 min-h-screen">
        {/* Top bar */}
        <div className="fixed top-0 right-0 left-0 lg:left-80 h-16 bg-dark-bg/90 backdrop-blur-lg z-30 flex items-center justify-between px-4 lg:px-8 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center lg:hidden">
              <span className="text-black font-bold font-orbitron">D</span>
            </div>
            <div className="lg:hidden">
              <h1 className="font-orbitron text-lg font-bold gold-text">DYNO</h1>
              <p className="text-[10px] text-gray-500">ESPORT</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {upcomingCount > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-card border border-dark-border">
                <span className="text-xs text-blue-400">{matches.filter((m) => m.arena === 'Arena 1').length}HC</span>
                <span className="text-gray-600">|</span>
                <span className="text-xs text-purple-400">{matches.filter((m) => m.arena === 'Arena 2').length}HP</span>
              </div>
            )}

            <button className="w-10 h-10 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-gold-500 hover:bg-dark-hover transition-all">
              <Bell size={18} />
            </button>

            {showInstallBtn && (
              <button onClick={handleInstallClick} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">
                👋 DYNOAphex
              </button>
            )}

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-black font-bold text-sm font-orbitron">
              D
            </div>
          </div>
        </div>

        <div className="pt-20 p-4 sm:p-6 lg:p-8">{renderPage()}</div>
      </main>

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="card-gold px-5 py-3 shadow-lg">
            <p className="text-sm text-gold-400 font-rajdhani">{notification}</p>
          </div>
        </div>
      )}
    </div>
  );
}