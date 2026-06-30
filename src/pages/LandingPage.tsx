import { useState } from 'react';
import {
  ScanLine,
  Activity,
  Sparkles,
  Droplets,
  BarChart3,
  Search,
  Upload,
  LineChart,
  ArrowRight,
  Star,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Leaf,
  Shield,
  Zap,
  Check,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { FEATURES, STEPS, TESTIMONIALS, FAQS } from '../data/mockData';
import { submitContactForm } from '../services/foodApi';

const ICONS: Record<string, typeof ScanLine> = {
  ScanLine,
  Activity,
  Sparkles,
  Droplets,
  BarChart3,
  Search,
  Upload,
  Scan: ScanLine,
  LineChart,
};

export function LandingPage() {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.message.trim()) e.message = 'Please enter a message';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await submitContactForm(form);
    setSubmitting(false);
    showToast('Message sent! We will get back to you soon.', 'success');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/40 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-mint-500 flex items-center justify-center shadow-glow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-800 dark:text-white">NutriVision</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Reviews</a>
            <a href="#faq" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">FAQ</a>
          </div>
          <button
            onClick={() => navigate('auth')}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-mint-500 text-white text-sm font-semibold shadow-glow hover:shadow-elevated hover:scale-105 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-mint-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Nutrition Intelligence
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Know exactly what you eat.
              <span className="block gradient-text mt-2">In a single snap.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              NutriVision uses computer vision to recognize your meals and instantly break down calories, macros, and micronutrients — then coaches you toward your goals with personalized AI insights.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('auth')}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-semibold shadow-glow hover:shadow-elevated hover:scale-105 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
              >
                See How It Works
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {TESTIMONIALS.slice(0, 4).map((t) => (
                  <img key={t.name} src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Loved by 50,000+ users</p>
              </div>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-white/60 dark:border-white/10">
              <img
                src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Healthy meal bowl"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 glass-strong rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">Mediterranean Bowl</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold">Healthy · 92</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Cal</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">410</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Protein</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">22g</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Carbs</p>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400">45g</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Fat</p>
                    <p className="text-sm font-bold text-rose-500 dark:text-rose-400">18g</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 glass-strong rounded-2xl p-3 shadow-elevated animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Analyzed in</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">1.5s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">Features</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">Everything you need to eat smarter</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Powerful tools that make nutrition tracking effortless, accurate, and genuinely enjoyable.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = ICONS[f.icon] || Sparkles;
              return (
                <div
                  key={f.title}
                  className="group glass rounded-2xl p-6 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-mint-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-mint-50 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">Three steps to better nutrition</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {STEPS.map((step, i) => {
              const Icon = ICONS[step.icon] || Upload;
              return (
                <div key={step.title} className="relative text-center">
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-300 to-transparent" />
                  )}
                  <div className="relative inline-flex w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-card items-center justify-center mb-5 mx-auto">
                    <Icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">Trusted by health-conscious people</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass rounded-2xl p-6 hover:shadow-card transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-mint-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">Contact</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">Get in touch</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Have a question, feature request, or partnership idea? We would love to hear from you. Fill out the form and our team will respond within 24 hours.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-200">hello@nutrivision.app</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-200">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-200">San Francisco, California</span>
              </div>
            </div>
            <div className="mt-8 flex gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4 text-emerald-600" /> GDPR Compliant
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Check className="w-4 h-4 text-emerald-600" /> SOC 2 Certified
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                placeholder="Your name"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
                placeholder="How can we help?"
              />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-semibold shadow-glow hover:shadow-elevated hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>Send Message</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-mint-500 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-lg text-slate-800 dark:text-white">NutriVision</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Smart food recognition and nutrition analysis, powered by AI.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">Features</a></li>
                <li><a href="#how" className="hover:text-emerald-600 transition-colors">How it Works</a></li>
                <li><button onClick={() => navigate('auth')} className="hover:text-emerald-600 transition-colors">Get Started</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#contact" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                <li><a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a></li>
                <li><a href="#testimonials" className="hover:text-emerald-600 transition-colors">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>© 2026 NutriVision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
