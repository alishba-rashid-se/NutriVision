import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Ruler, Weight, Target, Moon, Bell, Globe, Lock, Check, LogOut, AlertCircle } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { t } from '../lib/i18n';
import type { Goal, Settings } from '../types';

interface ValidationErrors {
  name?: string;
  email?: string;
  age?: string;
  height?: string;
  weight?: string;
}

export function ProfilePage() {
  const { profile, updateProfile, settings, updateSettings, isLoading } = useNutrition();
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    age: profile?.age || 0,
    height: profile?.height || 0,
    weight: profile?.weight || 0,
    goal: profile?.goal || 'maintain' as Goal,
  });
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        email: profile.email,
        age: profile.age || 0,
        height: profile.height || 0,
        weight: profile.weight || 0,
        goal: profile.goal,
      });
    }
  }, [profile]);

  const validateField = (field: string, value: string | number): string | undefined => {
    if (field === 'name') {
      if (!String(value).trim()) return t('fieldRequired');
    }
    if (field === 'age') {
      const num = Number(value);
      if (num < 1 || num > 150) return t('invalidAge');
    }
    if (field === 'height') {
      const num = Number(value);
      if (num < 50 || num > 300) return t('invalidHeight');
    }
    if (field === 'weight') {
      const num = Number(value);
      if (num < 10 || num > 500) return t('invalidWeight');
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    errors.name = validateField('name', form.name);
    if (form.age) errors.age = validateField('age', form.age);
    if (form.height) errors.height = validateField('height', form.height);
    if (form.weight) errors.weight = validateField('weight', form.weight);
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setValidationErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix validation errors before saving.', 'error');
      return;
    }
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    showToast(t('profileUpdated'), 'success');
  };

  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    updateSettings({ ...settings, [key]: value });
    if (key === 'darkMode') {
      showToast(value ? t('darkModeEnabled') : t('lightModeEnabled'), 'info');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    showToast(t('signedOut'), 'info');
    navigate('landing');
  };

  const goals: { value: Goal; label: string }[] = [
    { value: 'lose', label: t('loseWeight') },
    { value: 'gain', label: t('gainWeight') },
    { value: 'maintain', label: t('maintainWeight') },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">{t('profileSettings')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('manageInfo')}</p>
      </div>

      {/* Profile header */}
      <div className="glass rounded-2xl p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-mint-500 flex items-center justify-center text-white font-display font-bold text-2xl shadow-glow">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">{user?.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile editor */}
        <form onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-5">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            {t('personalInformation')}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              icon={User}
              label={t('name')}
              error={validationErrors.name}
              required
            >
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white focus:outline-none"
              />
            </Field>
            <Field
              icon={Mail}
              label={t('email')}
              disabled
            >
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full bg-transparent text-slate-400 dark:text-slate-500 focus:outline-none cursor-not-allowed"
              />
            </Field>
            <Field
              icon={Calendar}
              label={t('age')}
              error={validationErrors.age}
            >
              <input
                type="number"
                value={form.age || ''}
                onChange={(e) => handleFieldChange('age', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-slate-900 dark:text-white focus:outline-none no-spin"
                placeholder="--"
              />
            </Field>
            <Field
              icon={Ruler}
              label={t('heightCm')}
              error={validationErrors.height}
            >
              <input
                type="number"
                value={form.height || ''}
                onChange={(e) => handleFieldChange('height', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-slate-900 dark:text-white focus:outline-none no-spin"
                placeholder="--"
              />
            </Field>
            <Field
              icon={Weight}
              label={t('weightKg')}
              error={validationErrors.weight}
            >
              <input
                type="number"
                value={form.weight || ''}
                onChange={(e) => handleFieldChange('weight', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-slate-900 dark:text-white focus:outline-none no-spin"
                placeholder="--"
              />
            </Field>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{t('fitnessGoal')}</label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value as Goal })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
                >
                  {goals.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-semibold shadow-glow hover:shadow-elevated hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('saving')}
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {t('saveChanges')}
              </>
            )}
          </button>
        </form>

        {/* Settings */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 space-y-1">
            <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-4">{t('settings')}</h3>
            <ToggleRow
              icon={Moon}
              label={t('darkMode')}
              description={t('darkModeDesc')}
              checked={settings.darkMode}
              onChange={(v) => handleSettingChange('darkMode', v)}
            />
            <ToggleRow
              icon={Bell}
              label={t('pushNotifications')}
              description={t('pushNotificationsDesc')}
              checked={settings.pushNotifications}
              onChange={(v) => handleSettingChange('pushNotifications', v)}
            />
            <ToggleRow
              icon={Lock}
              label={t('privacy')}
              description={t('privacyDesc')}
              checked={settings.privacy}
              onChange={(v) => handleSettingChange('privacy', v)}
            />
            <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{t('language')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('languageDesc')}</p>
                </div>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 border-0 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('signOut')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
  error,
  required,
  disabled,
}: {
  icon: typeof User;
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border transition-all ${
        error
          ? 'border-red-300 dark:border-red-700'
          : disabled
            ? 'border-slate-100 dark:border-slate-800'
            : 'border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-400'
      }`}>
        <Icon className={`w-4 h-4 flex-shrink-0 ${error ? 'text-red-400' : 'text-slate-400'}`} />
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Moon;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-white">{label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-gradient-to-r from-emerald-500 to-mint-500' : 'bg-slate-200 dark:bg-slate-700'}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );
}
