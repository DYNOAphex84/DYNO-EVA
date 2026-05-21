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
import { Download } from 'lucide-react';

function useLocalState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [matches, setMatches] = useLocalState<Match[]>('dyno-matches', initialMatches);
  const [players, setPlayers] = useLocalState<Player[]>('dyno-players', initialPlayers);
  const [strategies, setStrategies] = useLocalState<Strategy[]>('dyno-strategies', initialStrategies);
  const [notification, setNotification] = useState<string | null>(null);
  
  // PWA Install logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setShowInstallBtn(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddMatch = (match: Match) => {
    setMatches((prev) => [...prev, match]);
    showNotification(`✅ Match contre ${match.opponent} ajouté !`);
  };
  const handleUpdateMatch = (match: Match) => {
    setMatches((prev) => prev.map((m) => (m.id === match.id ? match : m)));
  };
  const handleSavePickBan = (matchId: string, pickBan: PickBanRecord) => {
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, pickBan } : m)));
    showNotification('✅ Pick & Ban sauvegardé !');
  };
  const handleUpdateMatchScores = (matchId: string, scores: MatchScore[], mvp?: string) => {
    setMatches((prev) => prev.map((m) => m.id === matchId ? { ...m, scores, mvp, status: 'completed' as const } : m));
    showNotification('✅ Scores enregistrés !');
  };
  const handleAddPlayer = (player: Player) => {
    setPlayers((prev) => [...prev, player]);
    showNotification(`✅ ${player.pseudo} ajouté à l'équipe !`);
  };
  const handleUpdatePlayer = (player: Player) => {
    setPlayers((prev) => prev.map((p) => (p.id === player.id ? player : p)));
  };
  const handleToggleAvailability = (id: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p)));
  };
  const handleAddStrategy = (strategy: Strategy) => {
    setStrategies((prev) => [...prev, strategy]);
    showNotification(`✅ Stratégie "${strategy.name}" créée !`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard matches={matches} players={players} mapStats={mapStatsData} onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'matches': return <Matches matches={matches} players={players} onAddMatch={handleAddMatch} onUpdateMatch={handleUpdateMatch} />;
      case 'pickban': return <PickBan matches={matches} mapStats={mapStatsData} onSavePickBan={handleSavePickBan} />;
      case 'players': return <Players players={players} onAddPlayer={handleAddPlayer} onUpdatePlayer={handleUpdatePlayer} onToggleAvailability={handleToggleAvailability} />;
      case 'scores': return <Scores matches={matches} players={players} onUpdateMatchScores={handleUpdateMatchScores} />;
      case 'strategies': return <Strategies strategies={strategies} onAddStrategy={handleAddStrategy} />;
      case 'history': return <History matches={matches} players={players} mapStats={mapStatsData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/3 rounded-full blur-[150px]" />
      </div>

      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="lg:ml-64 min-h-screen relative">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-20">{renderPage()}</div>
      </main>

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div className="glass-panel rounded-xl px-5 py-3 shadow-lg shadow-neon-blue/10 border border-neon-blue/20">
            <p className="text-sm text-white font-rajdhani">{notification}</p>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="fixed top-0 right-0 left-0 lg:left-64 h-14 glass-panel z-30 flex items-center justify-end px-4 gap-4 lg:px-8 border-b border-dark-400/20">
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-neon-green" />
            <span className="text-[11px] text-gray-400 font-rajdhani">{players.filter((p) => p.available).length} joueurs en ligne</span>
          </div>
          <div className="h-4 w-px bg-dark-400/30" />
          <span className="text-[11px] text-gray-400 font-rajdhani">{matches.filter((m) => m.status === 'upcoming').length} matchs à venir</span>
        </div>
        
        {showInstallBtn && (
          <button onClick={handleInstallClick} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs hover:bg-neon-green/20 transition-all">
            <Download size={12} /> Installer l'app
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-xs">🎮</div>
          <span className="text-xs text-white font-medium hidden sm:block">EVA</span>
        </div>
      </div>
    </div>
  );
}