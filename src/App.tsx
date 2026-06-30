import { useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NutritionProvider, useNutrition } from './context/NutritionContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ToastContainer } from './components/ToastContainer';
import { AppShell } from './components/AppShell';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ResultsPage } from './pages/ResultsPage';
import { SearchPage } from './pages/SearchPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import type { Route } from './types';

const PROTECTED: Route[] = ['dashboard', 'analyzer', 'results', 'search', 'history', 'profile'];

function DarkModeSync() {
  const { settings } = useNutrition();
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);
  return null;
}

function Router() {
  const { route, navigate } = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && PROTECTED.includes(route)) {
      navigate('auth');
    }
  }, [isAuthenticated, route, navigate]);

  if (!isAuthenticated && PROTECTED.includes(route)) {
    return <AuthPage />;
  }

  switch (route) {
    case 'landing':
      return <LandingPage />;
    case 'auth':
      return <AuthPage />;
    case 'dashboard':
    case 'analyzer':
    case 'results':
    case 'search':
    case 'history':
    case 'profile':
      return (
        <AppShell>
          {route === 'dashboard' && <DashboardPage />}
          {route === 'analyzer' && <AnalyzerPage />}
          {route === 'results' && <ResultsPage />}
          {route === 'search' && <SearchPage />}
          {route === 'history' && <HistoryPage />}
          {route === 'profile' && <ProfilePage />}
        </AppShell>
      );
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NutritionProvider>
          <RouterProvider>
            <DarkModeSync />
            <Router />
            <ToastContainer />
          </RouterProvider>
        </NutritionProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
