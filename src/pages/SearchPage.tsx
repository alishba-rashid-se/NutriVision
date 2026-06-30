import { useState, useMemo } from 'react';
import { Search, X, ArrowLeft, ChevronRight } from 'lucide-react';
import { MOCK_FOOD_DATABASE } from '../data/mockData';
import { ResultsPanel } from '../components/ResultsPanel';
import type { SearchResult } from '../types';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [added, setAdded] = useState(false);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return MOCK_FOOD_DATABASE;
    return MOCK_FOOD_DATABASE.filter(
      (f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q),
    );
  }, [query]);

  const handleSelect = (item: SearchResult) => {
    setSelected(item);
    setAdded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selected) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </button>
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">{selected.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Full nutritional breakdown and AI insights.</p>
        </div>
        <ResultsPanel item={selected} alreadyAdded={added} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">Food Search</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Search our database of 10,000+ foods and log instantly.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-lg"
          placeholder="Search for a food..."
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 dark:text-slate-500">No foods found for "{query}".</p>
          </div>
        )}
        {results.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:shadow-card hover:-translate-y-0.5 transition-all text-left group"
          >
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">{item.category}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {item.calories} kcal · {item.protein}g protein · {item.carbs}g carbs · {item.fat}g fat
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.isHealthy ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>
                {item.healthScore}
              </span>
              <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
