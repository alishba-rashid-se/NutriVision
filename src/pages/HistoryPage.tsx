import { useState, useMemo } from 'react';
import { Search, Trash2, AlertTriangle, X, Filter, Calendar, Beef, Heart, History as HistoryIcon } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { useToast } from '../context/ToastContext';
import { t } from '../lib/i18n';

type DayFilter = 'all' | 'today' | 'week';
type HealthFilter = 'all' | 'healthy' | 'unhealthy';
type ProteinFilter = 'all' | 'high';

export function HistoryPage() {
  const { history, deleteFood, clearHistory, isLoading } = useNutrition();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [dayFilter, setDayFilter] = useState<DayFilter>('all');
  const [healthFilter, setHealthFilter] = useState<HealthFilter>('all');
  const [proteinFilter, setProteinFilter] = useState<ProteinFilter>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    const now = Date.now();
    return history.filter((h) => {
      if (query && !h.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (healthFilter === 'healthy' && !h.isHealthy) return false;
      if (healthFilter === 'unhealthy' && h.isHealthy) return false;
      if (proteinFilter === 'high' && h.protein < 25) return false;
      if (dayFilter === 'today') {
        const d = new Date(h.timestamp);
        const today = new Date();
        if (d.getDate() !== today.getDate() || d.getMonth() !== today.getMonth() || d.getFullYear() !== today.getFullYear()) return false;
      }
      if (dayFilter === 'week') {
        const ts = new Date(h.timestamp).getTime();
        if (now - ts > 7 * 24 * 3600_000) return false;
      }
      return true;
    });
  }, [history, query, dayFilter, healthFilter, proteinFilter]);

  const handleDelete = async (id: string, name: string) => {
    await deleteFood(id);
    showToast(`${name} ${t('removedFromHistory')}`, 'info');
  };

  const handleClearAll = async () => {
    await clearHistory();
    setConfirmClear(false);
    showToast(t('historyCleared'), 'info');
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600_000);
    if (hours < 1) return t('justNow');
    if (hours < 24) return `${hours}${t('hoursAgo')}`;
    const days = Math.floor(hours / 24);
    if (days === 1) return t('yesterday');
    if (days < 7) return `${days} ${t('daysAgo')}`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">{t('historyLog')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{history.length} {t('itemsTracked')}</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {t('clearAllHistory')}
          </button>
        )}
      </div>

      {/* Search + filters */}
      <div className="glass rounded-2xl p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            placeholder={t('searchHistory')}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            {t('filters')}
          </div>
          <FilterPill icon={Calendar} label={t('day')} value={dayFilter} options={[{ v: 'all', l: t('allTime') }, { v: 'today', l: t('today') }, { v: 'week', l: t('thisWeek') }]} onChange={(v) => setDayFilter(v as DayFilter)} />
          <FilterPill icon={Heart} label={t('health')} value={healthFilter} options={[{ v: 'all', l: t('all') }, { v: 'healthy', l: t('healthy') }, { v: 'unhealthy', l: t('indulgent') }]} onChange={(v) => setHealthFilter(v as HealthFilter)} />
          <FilterPill icon={Beef} label={t('protein')} value={proteinFilter} options={[{ v: 'all', l: t('all') }, { v: 'high', l: t('highProtein') }]} onChange={(v) => setProteinFilter(v as ProteinFilter)} />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">{t('noItemsMatch')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="glass rounded-2xl p-4 flex items-center gap-4 hover:shadow-card transition-shadow group">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.isHealthy ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>
                    {item.isHealthy ? t('healthy') : t('indulgent')} · {item.healthScore}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.calories} {t('kcal')} · {item.protein}g P · {item.carbs}g C · {item.fat}g F
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatDate(item.timestamp)} · {item.servingSize}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id, item.name)}
                className="w-9 h-9 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Clear confirmation modal */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmClear(false)}>
          <div className="glass-strong rounded-2xl p-6 max-w-sm w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white text-center mb-2">{t('clearAllConfirm')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">{t('clearAllDesc').replace('{count}', String(history.length))}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                {t('deleteAll')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: typeof Filter;
  label: string;
  value: string;
  options: { v: string; l: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative inline-flex items-center">
      <Icon className="w-3.5 h-3.5 text-slate-400 mr-1" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-1 pr-7 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 border-0 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>{label}: {o.l}</option>
        ))}
      </select>
      <X className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" style={{ transform: 'rotate(45deg)' }} />
    </div>
  );
}
