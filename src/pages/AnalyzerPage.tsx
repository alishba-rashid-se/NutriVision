import { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  X,
  ScanLine,
  ImageIcon,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useNutrition } from '../context/NutritionContext';
import { useToast } from '../context/ToastContext';
import { analyzeFoodImage } from '../services/foodApi';
import type { FoodItem } from '../types';

const LOADING_STAGES = [
  { text: 'Scanning image...', icon: ScanLine },
  { text: 'Identifying food items...', icon: ImageIcon },
  { text: 'Computing nutritional values...', icon: CheckCircle2 },
  { text: 'Generating AI insights...', icon: Loader2 },
];

export function AnalyzerPage() {
  const { navigate } = useRouter();
  const { setLastAnalysis } = useNutrition();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): boolean => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(f.type)) {
      showToast('Only JPEG and PNG images are supported.', 'error');
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      showToast('Image must be under 10MB.', 'error');
      return false;
    }
    return true;
  };

  const handleFile = (f: File) => {
    if (!validateFile(f)) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const removeFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setStage(0);
    const stageInterval = setInterval(() => {
      setStage((s) => Math.min(s + 1, LOADING_STAGES.length - 1));
    }, 400);
    try {
      const result: FoodItem = await analyzeFoodImage(file);
      clearInterval(stageInterval);
      setLastAnalysis(result);
      showToast('Analysis complete! View your results.', 'success');
      navigate('results');
    } catch {
      clearInterval(stageInterval);
      showToast('Analysis failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">AI Food Analyzer</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Upload a photo of your meal and let AI do the rest.</p>
      </div>

      {!loading && !preview && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-12 sm:p-16 text-center cursor-pointer transition-all ${
            dragging
              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-900/20 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-slate-800/40'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-mint-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-float">
            <UploadCloud className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-2">
            {dragging ? 'Drop your image here' : 'Drag & drop your food photo'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">or click to browse from your device</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
            <ImageIcon className="w-4 h-4" />
            JPEG or PNG · Max 10MB
          </div>
        </div>
      )}

      {!loading && preview && (
        <div className="space-y-4 animate-scale-in">
          <div className="relative rounded-3xl overflow-hidden glass p-3">
            <img src={preview} alt="Preview" className="w-full h-72 object-cover rounded-2xl" />
            <button
              onClick={removeFile}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white hover:scale-110 transition-all shadow-lg"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={removeFile}
              className="flex-1 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Remove / Replace
            </button>
            <button
              onClick={analyze}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-semibold shadow-glow hover:shadow-elevated hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <ScanLine className="w-5 h-5" />
              Analyze Food
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="rounded-3xl glass p-12 text-center animate-fade-in">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-slate-800" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-mint-500 animate-spin-slow" />
            <div className="absolute inset-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <ScanLine className="w-8 h-8 text-emerald-600 animate-pulse-soft" />
            </div>
          </div>
          <div className="space-y-3 max-w-sm mx-auto">
            {LOADING_STAGES.map((s, i) => {
              const Icon = s.icon;
              const done = i < stage;
              const active = i === stage;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 text-sm font-medium transition-all duration-300 ${
                    done ? 'text-emerald-600 dark:text-emerald-400' : active ? 'text-slate-800 dark:text-white' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${done ? 'bg-emerald-500' : active ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />}
                  </div>
                  <span>{s.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
