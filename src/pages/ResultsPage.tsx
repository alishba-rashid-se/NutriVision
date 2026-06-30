import { ArrowLeft, ScanLine } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useNutrition } from '../context/NutritionContext';
import { ResultsPanel } from '../components/ResultsPanel';

export function ResultsPage() {
  const { navigate } = useRouter();
  const { lastAnalysis } = useNutrition();

  if (!lastAnalysis) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-6">
          <ScanLine className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">No analysis yet</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Upload a food photo to see your nutrition breakdown here.</p>
        <button
          onClick={() => navigate('analyzer')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-semibold shadow-glow hover:shadow-elevated hover:scale-105 transition-all"
        >
          <ScanLine className="w-5 h-5" />
          Analyze a Meal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate('analyzer')}
        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Analyzer
      </button>
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">Analysis Results</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here is the complete nutritional breakdown of your meal.</p>
      </div>
      <ResultsPanel item={lastAnalysis} />
    </div>
  );
}
