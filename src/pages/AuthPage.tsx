import { useState } from 'react';
import { Leaf, Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { t } from '../lib/i18n';
import type { AuthMode } from '../types';

export function AuthPage() {
  const { navigate } = useRouter();
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'signup' && !form.name.trim()) e.name = t('nameRequired');
    if (!form.email.trim()) e.email = t('emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('validEmail');
    if (mode !== 'forgot' && !form.password) e.password = t('passwordRequired');
    else if (mode !== 'forgot' && form.password.length < 6) e.password = t('passwordLength');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    if (mode === 'forgot') {
      showToast(t('passwordResetSent'), 'success');
      setMode('signin');
      setSubmitting(false);
      return;
    }

    if (mode === 'signup') {
      const result = await signUp(form.name, form.email, form.password);
      if (result.error) {
        setErrors({ email: result.error });
        setSubmitting(false);
        return;
      }
      showToast(`${t('welcomeTo')}, ${form.name}!`, 'success');
    } else {
      const result = await signIn(form.email, form.password);
      if (result.error) {
        setErrors({ email: result.error });
        setSubmitting(false);
        return;
      }
      showToast(t('signedInSuccess'), 'success');
    }
    setSubmitting(false);
    navigate('dashboard');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-mint-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-600 to-mint-600">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 bg-mint-400/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">NutriVision</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl text-white leading-tight mb-6">
            Eat smarter.<br />Live better.
          </h2>
          <p className="text-emerald-50 text-lg leading-relaxed max-w-md">
            Join 50,000+ people using AI to understand their nutrition, hit their goals, and build lasting healthy habits.
          </p>
        </div>
        <div className="relative space-y-4">
          {[
            'AI food recognition with 94% accuracy',
            'Track macros, water, and weekly trends',
            'Personalized insights for your goals',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-emerald-50">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </button>

          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-mint-500 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-800 dark:text-white">NutriVision</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white mb-2">
            {mode === 'signin' && t('welcomeBack')}
            {mode === 'signup' && t('createAccount')}
            {mode === 'forgot' && t('resetPassword')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {mode === 'signin' && t('signInToContinue')}
            {mode === 'signup' && t('startTracking')}
            {mode === 'forgot' && t('enterEmailReset')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">{t('fullName')}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    placeholder="Alex Morgan"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">{t('emailAddress')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
            </div>
            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">{t('password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrors({}); }}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  {t('forgotPassword')}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-semibold shadow-glow hover:shadow-elevated hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {mode === 'signin' && t('signIn')}
                  {mode === 'signup' && t('createAccount')}
                  {mode === 'forgot' && t('sendResetLink')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode !== 'forgot' && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              {mode === 'signin' ? `${t('dontHaveAccount')} ` : `${t('alreadyHaveAccount')} `}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErrors({}); }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                {mode === 'signin' ? t('signUp') : t('signIn')}
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              {t('rememberPassword')}{' '}
              <button
                onClick={() => { setMode('signin'); setErrors({}); }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                {t('signIn')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
