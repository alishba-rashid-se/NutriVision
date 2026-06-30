import { createContext, useContext, useState, type ReactNode } from 'react';
import type { FoodItem, UserProfile, Settings, DailyGoals } from '../types';
import { MOCK_HISTORY, DEFAULT_PROFILE } from '../data/mockData';

interface NutritionContextValue {
  history: FoodItem[];
  profile: UserProfile;
  settings: Settings;
  dailyGoals: DailyGoals;
  waterIntake: number;
  lastAnalysis: FoodItem | null;
  addFood: (item: FoodItem) => void;
  deleteFood: (id: string) => void;
  clearHistory: () => void;
  setLastAnalysis: (item: FoodItem | null) => void;
  updateProfile: (profile: UserProfile) => void;
  updateSettings: (settings: Settings) => void;
  addWater: () => void;
  removeWater: () => void;
  todayItems: FoodItem[];
  todayTotals: { calories: number; protein: number; carbs: number; fat: number };
}

const DEFAULT_GOALS: DailyGoals = {
  calories: 2200,
  protein: 140,
  carbs: 250,
  fat: 70,
  water: 8,
};

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  pushNotifications: true,
  language: 'English',
  privacy: true,
};

const NutritionContext = createContext<NutritionContextValue | undefined>(undefined);

function isToday(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function NutritionProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<FoodItem[]>(MOCK_HISTORY);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [waterIntake, setWaterIntake] = useState(5);
  const [lastAnalysis, setLastAnalysis] = useState<FoodItem | null>(null);

  const addFood = (item: FoodItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const deleteFood = (id: string) => {
    setHistory((prev) => prev.filter((f) => f.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const updateProfile = (p: UserProfile) => setProfile(p);
  const updateSettings = (s: Settings) => setSettings(s);

  const addWater = () => setWaterIntake((w) => Math.min(w + 1, 20));
  const removeWater = () => setWaterIntake((w) => Math.max(w - 1, 0));

  const todayItems = history.filter((h) => isToday(h.timestamp));
  const todayTotals = todayItems.reduce(
    (acc, h) => ({
      calories: acc.calories + h.calories,
      protein: acc.protein + h.protein,
      carbs: acc.carbs + h.carbs,
      fat: acc.fat + h.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <NutritionContext.Provider
      value={{
        history,
        profile,
        settings,
        dailyGoals: DEFAULT_GOALS,
        waterIntake,
        lastAnalysis,
        addFood,
        deleteFood,
        clearHistory,
        setLastAnalysis,
        updateProfile,
        updateSettings,
        addWater,
        removeWater,
        todayItems,
        todayTotals,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const ctx = useContext(NutritionContext);
  if (!ctx) throw new Error('useNutrition must be used within NutritionProvider');
  return ctx;
}
