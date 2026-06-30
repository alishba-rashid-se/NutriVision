import { Plus, Flame, Beef, Wheat, Droplet, Leaf, Candy, Sparkles, Lightbulb, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { FoodItem, SearchResult } from '../types';
import { useNutrition } from '../context/NutritionContext';
import { useToast } from '../context/ToastContext';

interface ResultsPanelProps {
  item: FoodItem | SearchResult;
  showAddButton?: boolean;
  alreadyAdded?: boolean;
}

function isFoodItem(x: FoodItem | SearchResult): x is FoodItem {
  return 'timestamp' in x;
}

export function ResultsPanel({ item, showAddButton = true, alreadyAdded = false }: ResultsPanelProps) {
  const { addFood } = useNutrition();
  const { showToast } = useToast();

  const handleAdd = () => {
    const foodItem: FoodItem = isFoodItem(item)
      ? item
      : {
          ...item,
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          confidence: 100,
        };
    addFood(foodItem);
    showToast(`${item.name} added to your daily log.`, 'success');
  };

  const scoreColor =
    item.healthScore >= 80 ? 'text-emerald-600' : item.healthScore >= 60 ? 'text-amber-600' : 'text-rose-500';
  const scoreBg =
    item.healthScore >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/40' : item.healthScore >= 60 ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-rose-100 dark:bg-rose-900/40';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header: image + status */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden glass p-3">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover rounded-xl" />
          ) : (
            <div className="w-full h-64 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Beef className="w-12 h-12 text-emerald-400" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${item.isHealthy ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>
                {item.isHealthy ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {item.isHealthy ? 'Healthy' : 'Indulgent'}
              </span>
              {isFoodItem(item) && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.confidence.toFixed(1)}% confidence
                </span>
              )}
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">{item.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Serving: {item.servingSize}</p>
          </div>
          <div className={`rounded-2xl ${scoreBg} p-5 flex items-center gap-4`}>
            <div className="flex flex-col items-center">
              <span className={`font-display font-extrabold text-4xl ${scoreColor}`}>{item.healthScore}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ 100</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Health Score</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {item.healthScore >= 80 ? 'Excellent nutritional profile' : item.healthScore >= 60 ? 'Moderate — enjoy in balance' : 'Indulgent — pair with healthier choices'}
              </p>
            </div>
          </div>
          {showAddButton && (
            <button
              onClick={handleAdd}
              disabled={alreadyAdded}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-semibold shadow-glow hover:shadow-elevated hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {alreadyAdded ? 'Added to Daily Log' : 'Add to Daily Log'}
            </button>
          )}
        </div>
      </div>

      {/* Primary metrics */}
      <div>
        <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-3">Primary Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Flame, label: 'Calories', value: item.calories, unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
            { icon: Beef, label: 'Protein', value: item.protein, unit: 'g', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { icon: Wheat, label: 'Carbs', value: item.carbs, unit: 'g', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { icon: Droplet, label: 'Fat', value: item.fat, unit: 'g', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
          ].map((m) => (
            <div key={m.label} className="glass rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.label}</p>
              <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-0.5">
                {m.value}<span className="text-sm font-medium text-slate-400 ml-1">{m.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-mint-50 dark:bg-mint-900/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-mint-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fiber</p>
            <p className="font-display font-bold text-xl text-slate-900 dark:text-white">{item.fiber}<span className="text-sm font-medium text-slate-400 ml-1">g</span></p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
            <Candy className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sugar</p>
            <p className="font-display font-bold text-xl text-slate-900 dark:text-white">{item.sugar}<span className="text-sm font-medium text-slate-400 ml-1">g</span></p>
          </div>
        </div>
      </div>

      {/* Insights & Suggestions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            AI Insights
          </h3>
          <ul className="space-y-3">
            {item.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-mint-100 dark:bg-mint-900/40 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-mint-600" />
            </div>
            AI Suggestions
          </h3>
          <ul className="space-y-3">
            {item.suggestions.map((sug, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-mint-500 mt-2 flex-shrink-0" />
                {sug}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
