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