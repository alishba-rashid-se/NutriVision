import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-[calc(100vw-2rem)] sm:w-auto">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info;
        const color =
          toast.type === 'success'
            ? 'text-emerald-600'
            : toast.type === 'error'
              ? 'text-red-500'
              : 'text-mint-600';
        const ring =
          toast.type === 'success'
            ? 'ring-emerald-200'
            : toast.type === 'error'
              ? 'ring-red-200'
              : 'ring-mint-200';
        return (
          <div
            key={toast.id}
            className={`glass-strong rounded-2xl shadow-elevated ring-1 ${ring} p-4 flex items-start gap-3 animate-slide-in`}
          >
            <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
