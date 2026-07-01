import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { FoodItem, UserProfile, Settings, DailyGoals, Goal } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { getBrowserLanguage, setLanguage, type Language } from '../lib/i18n';

interface NutritionContextValue {
  history: FoodItem[];
  profile: UserProfile | null;
  settings: Settings;
  dailyGoals: DailyGoals;
  waterIntake: number;
  lastAnalysis: FoodItem | null;
  isLoading: boolean;
  addFood: (item: FoodItem) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  setLastAnalysis: (item: FoodItem | null) => void;
  updateProfile: (profile: UserProfile) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  addWater: () => Promise<void>;
  removeWater: () => Promise<void>;
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
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<FoodItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [waterIntake, setWaterIntake] = useState(0);
  const [lastAnalysis, setLastAnalysis] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setProfile(null);
      setSettings(DEFAULT_SETTINGS);
      setWaterIntake(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const [historyResult, profileResult, settingsResult, dailyResult] = await Promise.all([
        supabase
          .from('food_history')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false }),
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('user_settings')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('daily_totals')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', new Date().toISOString().split('T')[0])
          .maybeSingle(),
      ]);

      if (historyResult.data) {
        setHistory(historyResult.data.map((h: Record<string, unknown>) => ({
          id: h.id as string,
          name: h.name as string,
          timestamp: h.timestamp as string,
          confidence: h.confidence as number,
          calories: h.calories as number,
          protein: h.protein as number,
          carbs: h.carbs as number,
          fat: h.fat as number,
          fiber: h.fiber as number,
          sugar: h.sugar as number,
          servingSize: h.serving_size as string,
          healthScore: h.health_score as number,
          isHealthy: h.is_healthy as boolean,
          insights: h.insights as string[] || [],
          suggestions: h.suggestions as string[] || [],
          imageUrl: h.image_url as string,
        })));
      }

      if (profileResult.data) {
        setProfile({
          name: profileResult.data.name as string,
          email: user.email,
          age: profileResult.data.age as number || 0,
          height: profileResult.data.height as number || 0,
          weight: profileResult.data.weight as number || 0,
          goal: profileResult.data.goal as Goal,
        });
      } else {
        const newProfile = {
          name: user.name,
          age: 0,
          height: 0,
          weight: 0,
          goal: 'maintain' as Goal,
        };
        await supabase.from('user_profiles').insert({
          id: user.id,
          ...newProfile,
        });
        setProfile({ email: user.email, ...newProfile });
      }

      if (settingsResult.data) {
        const lang = settingsResult.data.language as Language;
        setLanguage(lang);
        setSettings({
          darkMode: settingsResult.data.dark_mode as boolean,
          pushNotifications: settingsResult.data.push_notifications as boolean,
          language: lang,
          privacy: settingsResult.data.privacy as boolean,
        });
      } else {
        const defaultLang = getBrowserLanguage();
        const newSettings = {
          darkMode: false,
          pushNotifications: true,
          language: defaultLang,
          privacy: true,
        };
        setLanguage(defaultLang);
        await supabase.from('user_settings').insert({
          id: user.id,
          dark_mode: newSettings.darkMode,
          push_notifications: newSettings.pushNotifications,
          language: newSettings.language,
          privacy: newSettings.privacy,
        });
        setSettings(DEFAULT_SETTINGS);
      }

      if (dailyResult.data) {
        setWaterIntake(dailyResult.data.water_intake as number);
      } else {
        setWaterIntake(0);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    } else {
      setHistory([]);
      setProfile(null);
      setSettings(DEFAULT_SETTINGS);
      setWaterIntake(0);
      setIsLoading(false);
    }
  }, [isAuthenticated, loadUserData]);

  const addFood = async (item: FoodItem) => {
    if (!user) return;

    const { error } = await supabase.from('food_history').insert({
      user_id: user.id,
      name: item.name,
      timestamp: item.timestamp,
      confidence: item.confidence,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
      sugar: item.sugar,
      serving_size: item.servingSize,
      health_score: item.healthScore,
      is_healthy: item.isHealthy,
      insights: item.insights,
      suggestions: item.suggestions,
      image_url: item.imageUrl,
    });

    if (!error) {
      setHistory((prev) => [item, ...prev]);
    }
  };

  const deleteFood = async (id: string) => {
    if (!user) return;

    await supabase.from('food_history').delete().eq('id', id).eq('user_id', user.id);
    setHistory((prev) => prev.filter((f) => f.id !== id));
  };

  const clearHistory = async () => {
    if (!user) return;

    await supabase.from('food_history').delete().eq('user_id', user.id);
    setHistory([]);
  };

  const updateProfile = async (p: UserProfile) => {
    if (!user) return;

    await supabase
      .from('user_profiles')
      .update({
        name: p.name,
        age: p.age || null,
        height: p.height || null,
        weight: p.weight || null,
        goal: p.goal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setProfile(p);
  };

  const updateSettings = async (s: Settings) => {
    if (!user) return;

    await supabase
      .from('user_settings')
      .update({
        dark_mode: s.darkMode,
        push_notifications: s.pushNotifications,
        language: s.language,
        privacy: s.privacy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setLanguage(s.language);
    setSettings(s);

    if (s.darkMode !== settings.darkMode) {
      if (s.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const addWater = async () => {
    if (!user) return;

    const newCount = Math.min(waterIntake + 1, 20);
    setWaterIntake(newCount);

    const today = new Date().toISOString().split('T')[0];
    const existing = await supabase
      .from('daily_totals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (existing.data) {
      await supabase
        .from('daily_totals')
        .update({ water_intake: newCount })
        .eq('id', existing.data.id);
    } else {
      await supabase.from('daily_totals').insert({
        user_id: user.id,
        date: today,
        water_intake: newCount,
      });
    }
  };

  const removeWater = async () => {
    if (!user) return;

    const newCount = Math.max(waterIntake - 1, 0);
    setWaterIntake(newCount);

    const today = new Date().toISOString().split('T')[0];
    const existing = await supabase
      .from('daily_totals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (existing.data) {
      await supabase
        .from('daily_totals')
        .update({ water_intake: newCount })
        .eq('id', existing.data.id);
    }
  };

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
        isLoading,
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
