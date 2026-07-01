export type Goal = 'lose' | 'gain' | 'maintain';

export interface FoodItem {
  id: string;
  name: string;
  timestamp: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  servingSize: string;
  healthScore: number;
  isHealthy: boolean;
  insights: string[];
  suggestions: string[];
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  goal: Goal;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface Settings {
  darkMode: boolean;
  pushNotifications: boolean;
  language: string;
  privacy: boolean;
}

export type AuthMode = 'signin' | 'signup' | 'forgot';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export type Route =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'analyzer'
  | 'results'
  | 'search'
  | 'history'
  | 'profile';

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  servingSize: string;
  healthScore: number;
  isHealthy: boolean;
  insights: string[];
  suggestions: string[];
  imageUrl?: string;
}
