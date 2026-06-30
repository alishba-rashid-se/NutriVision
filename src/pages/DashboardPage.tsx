import {
  Plus,
  Minus,
  Flame,
  Beef,
  Wheat,
  Droplet,
  ScanLine,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useNutrition } from '../context/NutritionContext';
import { useAuth } from '../context/AuthContext';
import { ProgressRing } from '../components/ProgressRing';
import { WEEKLY_CALORIES } from '../data/mockData';

function MacroBar({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-sm font-semibold text-slate-800 dark:text-white">
          {Math.round(value)}<span className="text-slate-400 font-normal"> / {max}{unit}</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const { todayTotals, dailyGoals, waterIntake, addWater, removeWater, history } = useNutrition();

  const maxWeekly = Math.max(...WEEKLY_CALORIES, dailyGoals.calories);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const recent = history.slice(0, 3);
  const waterPct = Math.min((waterIntake / dailyGoals.water) * 100, 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Hello, {user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your nutrition snapshot for today.</p>
        </div>
        <button
          onClick={() => navigate('analyzer')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-semibold shadow-glow hover:shadow-elevated hover:scale-105 transition-all"
        >
          <ScanLine className="w-5 h-5" />
          Quick Upload
        </button>
      </div>

      {/* Metrics grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calorie ring */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
          <ProgressRing
            value={todayTotals.calories}
            max={dailyGoals.calories}
            label="Calories"
            sublabel={`of ${dailyGoals.calories} kcal`}
            unit=""
          />
          <div className="flex items-center gap-2 mt-4 text-sm text-slate-500 dark:text-slate-400">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{dailyGoals.calories - todayTotals.calories > 0 ? `${dailyGoals.calories - todayTotals.calories} kcal remaining` : 'Goal reached'}</span>
          </div>
        </div>

        {/* Macros */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Macro Targets
          </h3>
          <MacroBar label="Protein" value={todayTotals.protein} max={dailyGoals.protein} unit="g" color="bg-gradient-to-r from-emerald-500 to-emerald-400" />
          <MacroBar label="Carbs" value={todayTotals.carbs} max={dailyGoals.carbs} unit="g" color="bg-gradient-to-r from-amber-500 to-amber-400" />
          <MacroBar label="Fat" value={todayTotals.fat} max={dailyGoals.fat} unit="g" color="bg-gradient-to-r from-rose-500 to-rose-400" />
        </div>

        {/* Water tracker */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Droplet className="w-5 h-5 text-mint-500" />
            Water Intake
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-32 h-40 rounded-2xl border-2 border-mint-200 dark:border-mint-800 overflow-hidden bg-mint-50 dark:bg-mint-900/20">
              <div
                className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-mint-500 to-mint-300 transition-all duration-500 ease-out"
                style={{ height: `${waterPct}%` }}
              >
                <div className="absolute top-0 inset-x-0 h-2 bg-white/30 animate-wave" style={{ borderRadius: '50%' }} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-extrabold text-3xl text-slate-800 dark:text-white drop-shadow">{waterIntake}</span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">of {dailyGoals.water}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">glasses</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={removeWater}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Remove water"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={addWater}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-mint-500 to-emerald-500 flex items-center justify-center text-white shadow-glow hover:scale-110 transition-transform"
              aria-label="Add water"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly chart + Recent */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Weekly chart */}
        <div className="lg:col-span-3 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-slate-800 dark:text-white">Weekly Calorie Intake</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">Last 7 days</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {WEEKLY_CALORIES.map((cal, i) => {
              const h = (cal / maxWeekly) * 100;
              const isToday = i === WEEKLY_CALORIES.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '100%' }}>
                    <div
                      className={`w-full max-w-[2.5rem] rounded-t-lg transition-all duration-500 group-hover:opacity-90 ${
                        isToday
                          ? 'bg-gradient-to-t from-emerald-500 to-mint-400'
                          : 'bg-gradient-to-t from-emerald-300 to-emerald-200 dark:from-emerald-700 dark:to-emerald-800'
                      }`}
                      style={{ height: `${h}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700 dark:text-white whitespace-nowrap">
                        {cal}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-slate-800 dark:text-white">Recent Analyses</h3>
            <button onClick={() => navigate('history')} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {recent.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No recent items yet.</p>
            )}
            {recent.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/50 dark:hover:bg-slate-800/40 transition-colors">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                    <Beef className="w-5 h-5 text-emerald-600" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.calories} kcal · {item.protein}g protein</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${item.isHealthy ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>
                  {item.healthScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: 'Today', value: `${todayTotals.calories}`, unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { icon: Beef, label: 'Protein', value: `${todayTotals.protein}`, unit: 'g', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { icon: Wheat, label: 'Carbs', value: `${todayTotals.carbs}`, unit: 'g', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { icon: Droplet, label: 'Water', value: `${waterIntake}`, unit: 'glasses', color: 'text-mint-600', bg: 'bg-mint-50 dark:bg-mint-900/20' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="font-display font-bold text-lg text-slate-900 dark:text-white">{s.value}<span className="text-xs font-normal text-slate-400 ml-1">{s.unit}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
