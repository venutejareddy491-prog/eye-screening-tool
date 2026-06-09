import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Activity, Droplets, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const features = [
  { icon: Activity, title: 'Smart Risk Scoring', desc: 'AI-inspired algorithm analyzes symptoms and lifestyle factors.' },
  { icon: Shield, title: 'Early Detection', desc: 'Identify dry eye risk before symptoms become severe.' },
  { icon: Droplets, title: 'Personalized Care', desc: 'Tailored recommendations including 20-20-20 rule guidance.' },
  { icon: Sparkles, title: 'Professional Reports', desc: 'Dashboard analytics, PDF export, and appointment booking.' },
];

export default function Landing() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const startTo = '/screening';

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-healthcare-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-healthcare-950" />
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-healthcare-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1 rounded-full bg-healthcare-100 dark:bg-healthcare-900/50 text-healthcare-700 dark:text-healthcare-300 text-sm font-medium mb-4">
              AI-Inspired Healthcare
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">{t('heroTitle')}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">{t('heroSubtitle')}</p>
            <div className="flex flex-wrap gap-4">
              <Link to={startTo} className="btn-primary">
                {t('startScreening')} <ArrowRight className="w-5 h-5" />
              </Link>
              {user ? (
                <Link to="/dashboard" className="btn-secondary">{t('dashboard')}</Link>
              ) : (
                <Link to="/login" className="btn-secondary">{t('login')}</Link>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-8 aspect-square max-w-md mx-auto flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full max-w-xs">
                <defs>
                  <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <ellipse cx="100" cy="100" rx="85" ry="55" fill="url(#eyeGrad)" opacity="0.2" />
                <ellipse cx="100" cy="100" rx="70" ry="45" fill="none" stroke="url(#eyeGrad)" strokeWidth="3" />
                <circle cx="100" cy="100" r="28" fill="url(#eyeGrad)" />
                <circle cx="108" cy="92" r="10" fill="white" opacity="0.7" />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="12"
                  fill="#1e40af"
                  animate={{ r: [12, 14, 12] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t('aboutDryEye')}</h2>
        <div className="glass-card p-8 lg:p-12 max-w-4xl mx-auto">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Dry eye disease occurs when your eyes do not produce enough tears or tears evaporate too quickly.
            It affects millions worldwide and is increasingly common due to digital screen use, air conditioning,
            and environmental factors.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Our Smart Dry Eye Screening Tool uses a validated-style questionnaire to assess symptom frequency,
            lifestyle habits, and environmental exposure—helping you understand your risk level and take preventive action early.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card p-6 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <f.icon className="w-10 h-10 text-healthcare-600 mb-4" />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
