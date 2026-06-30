import type { FoodItem, SearchResult } from '../types';
import { MOCK_FOOD_DATABASE } from '../data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ANALYSIS_RESULTS: Omit<FoodItem, 'id' | 'timestamp' | 'imageUrl'>[] = [
  {
    name: 'Mediterranean Bowl',
    confidence: 96.4,
    calories: 410,
    protein: 22,
    carbs: 45,
    fat: 18,
    fiber: 11,
    sugar: 6,
    servingSize: '1 bowl (380g)',
    healthScore: 92,
    isHealthy: true,
    insights: [
      'Balanced macro profile with plant-based protein from chickpeas',
      'High fiber content from quinoa and vegetables supports digestion',
      'Heart-healthy fats from olive oil and tahini dressing',
    ],
    suggestions: [
      'Add grilled chicken or tofu to push protein past 30g',
      'Reduce tahini dressing by half to cut 80 calories',
      'Include a side of leafy greens for extra micronutrients',
    ],
  },
  {
    name: 'Chicken Burrito Bowl',
    confidence: 93.1,
    calories: 620,
    protein: 38,
    carbs: 68,
    fat: 20,
    fiber: 9,
    sugar: 5,
    servingSize: '1 bowl (500g)',
    healthScore: 74,
    isHealthy: true,
    insights: [
      'High protein from chicken supports muscle maintenance',
      'Carb-heavy from rice and beans — great for active days',
      'Sodium may be elevated from seasoning and salsa',
    ],
    suggestions: [
      'Request cauliflower rice to cut 150 calories and 40g carbs',
      'Go easy on the cheese and sour cream to reduce saturated fat',
      'Add fajita vegetables to boost fiber and volume',
    ],
  },
  {
    name: 'Pasta Carbonara',
    confidence: 90.8,
    calories: 580,
    protein: 24,
    carbs: 62,
    fat: 26,
    fiber: 3,
    sugar: 5,
    servingSize: '1 plate (350g)',
    healthScore: 48,
    isHealthy: false,
    insights: [
      'Rich and calorie-dense from cream, cheese, and bacon',
      'Refined white pasta causes rapid blood sugar spikes',
      'High saturated fat content from the traditional sauce',
    ],
    suggestions: [
      'Swap to whole-wheat or chickpea pasta for 3x the fiber',
      'Use Greek yogurt instead of cream to cut fat by 60%',
      'Add peas and mushrooms to increase vegetable volume',
    ],
  },
  {
    name: 'Buddha Bowl',
    confidence: 95.7,
    calories: 480,
    protein: 18,
    carbs: 58,
    fat: 19,
    fiber: 14,
    sugar: 8,
    servingSize: '1 bowl (420g)',
    healthScore: 89,
    isHealthy: true,
    insights: [
      'Diverse plant foods deliver a broad spectrum of micronutrients',
      'Excellent fiber from sweet potato, kale, and quinoa',
      'Healthy fats from avocado and sesame support absorption',
    ],
    suggestions: [
      'Add edamame or tempeh to reach 30g protein',
      'Use a light tahini drizzle instead of a heavy dressing',
      'Roast vegetables without oil to reduce calories by 90',
    ],
  },
];

const SAMPLE_IMAGES = [
  'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/5713771/pexels-photo-5713771.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export async function analyzeFoodImage(_file: File): Promise<FoodItem> {
  await delay(1500);
  const idx = Math.floor(Math.random() * ANALYSIS_RESULTS.length);
  const base = ANALYSIS_RESULTS[idx];
  return {
    ...base,
    id: `analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    imageUrl: SAMPLE_IMAGES[idx],
  };
}

export async function searchFoods(query: string): Promise<SearchResult[]> {
  await delay(400);
  const q = query.toLowerCase().trim();
  if (!q) return MOCK_FOOD_DATABASE;
  return MOCK_FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q),
  );
}

export function searchFoodsSync(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return MOCK_FOOD_DATABASE;
  return MOCK_FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q),
  );
}

export function getFoodById(id: string): SearchResult | undefined {
  return MOCK_FOOD_DATABASE.find((f) => f.id === id);
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
}): Promise<{ success: boolean }> {
  await delay(1200);
  void data;
  return { success: true };
}
