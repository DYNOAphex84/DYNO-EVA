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
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size