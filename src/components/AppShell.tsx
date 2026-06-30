import { type ReactNode } from 'react';
import {
  LayoutDashboard,
  ScanLine,
  Search,
  History,
  User,
  Leaf,
  LogOut,
  Plus,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Route } from '../types';

const NAV_ITEMS: { route: Route; label: string; icon: typeof LayoutDashboard }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'analyzer', label: 'AI Analyzer', icon: ScanLine },
  { route: 'search', label: 'Food Search', icon: Search },
  { route: 'history', label: 'History', icon: History },
  { route: 'profile', label: 'Profile', icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { route, navigate } = useRouter();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();

  const handleSignOut = () => {
    signOut();
    showToast('You have been signed out.', 'info');
    navigate('landing');
  };

  return (
    <div className="min-h-screen bg-mint-50/40 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col glass border-r border-white/40 dark:border-white/5 z-40">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-mint-500 flex items-center justify-center shadow-glow">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-800 dark:text-white">NutriVision</span>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = route === item.route || (route === 'results' && item.route === 'analyzer');
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-emerald-500 to-mint-500 text-white shadow-glow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800/60 hover:text-emerald-700 dark:hover:text-emerald-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-mint-400 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 glass border-b border-white/40 dark:border-white/5 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-mint-500 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-base text-slate-800 dark:text-white">NutriVision</span>
        </div>
        <button
          onClick={() => navigate('analyzer')}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-500 flex items-center justify-center text-white shadow-glow"
          aria-label="Quick upload"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <main className="lg:ml-64 pb-20 lg:pb-8 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/40 dark:border-white/5 px-2 py-1.5 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const active = route === item.route || (route === 'results' && item.route === 'analyzer');
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
