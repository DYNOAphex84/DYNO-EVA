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
        {isOpen ? <X size={24} /> : <Menu size={24