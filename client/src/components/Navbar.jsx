import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Sun, Moon, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const { t, lang, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/screening', label: 'Screening' },
    ...(user
      ? [
          { to: '/dashboard', label: t('dashboard') },
          ...(isAdmin ? [{ to: '/admin', label: t('admin') }] : []),
        ]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/20 dark:border-slate-800/50 !rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-healthcare-700 dark:text-healthcare-400">
            <Eye className="w-8 h-8" />
            <span className="hidden sm:inline">{t('appName')}</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium hover:text-healthcare-600 transition">
                {l.label}
              </Link>
            ))}
            <select
              value={lang}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1"
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="hi">HI</option>
            </select>
            <button type="button" onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <button type="button" onClick={() => { logout(); navigate('/'); }} className="btn-secondary text-sm py-2">
                {t('logout')}
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium">{t('login')}</Link>
                <Link to="/register" className="btn-primary text-sm py-2">{t('register')}</Link>
              </>
            )}
          </div>

          <button type="button" className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden pb-4 space-y-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="block py-2" onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
            <button type="button" onClick={toggle} className="flex items-center gap-2 py-2">
              <Globe className="w-4 h-4" /> Theme
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
