import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Route } from '../types';
import { useAuth } from './AuthContext';

interface RouterContextValue {
  route: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

const PROTECTED_ROUTES: Route[] = ['dashboard', 'analyzer', 'results', 'search', 'history', 'profile'];
const AUTH_ROUTES: Route[] = ['auth'];

export function RouterProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [route, setRoute] = useState<Route>(() => {
    const stored = localStorage.getItem('nutrivision_route');
    return (stored as Route) || 'landing';
  });

  useEffect(() => {
    if (isLoading) return;

    if (route === 'auth' && isAuthenticated) {
      setRoute('dashboard');
      return;
    }

    if (PROTECTED_ROUTES.includes(route) && !isAuthenticated) {
      setRoute('auth');
    }
  }, [route, isAuthenticated, isLoading]);

  useEffect(() => {
    if (!PROTECTED_ROUTES.includes(route) && route !== 'auth') {
      localStorage.setItem('nutrivision_route', route);
    } else {
      localStorage.removeItem('nutrivision_route');
    }
  }, [route]);

  const navigate = (r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
