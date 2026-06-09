import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, Download, LayoutDashboard, Mail, FileText, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { screeningAPI } from '../services/api';
import { riskColor } from '../utils/riskScoring';
import { downloadScreeningPDF } from '../utils/pdfReport';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import HealthScoreMeter from '../components/HealthScoreMeter';
import RiskPieChart from '../components/RiskPieChart';

const ICONS = { clock: '⏱', monitor: '🖥', droplet: '💧', moon: '🌙', wind: '💨', eye: '👁', stethoscope: '🩺', glasses: '👓', alert: '⚠', shield: '🛡' };

export default function Results() {
  const { state } = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const screening = state?.screening;
  const isGuest = state?.guest || screening?.guest || !screening?._id;

  if (!screening) return <Navigate to="/screening" replace />;

  const colors = riskColor(screening.riskCategory);

  const sendEmail = async () => {
    if (!screening._id) {
      toast.error('Sign in to email your saved report');
      return;
    }
    try {
      await screeningAPI.emailReport(screening._id);
      toast.success(`Report sent to ${user?.email} (simulated)`);
    } catch {
      toast.error('Email failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {isGuest && (
          <div className="glass-card p-4 mb-6 border border-healthcare-200 dark:border-healthcare-800 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">Preview mode — create an account to save history, book appointments, and email reports.</p>
            <Link to="/register" className="btn-primary text-sm py-2">
              <UserPlus className="w-4 h-4" /> Sign up to save
            </Link>
          </div>
        )}

        <div className={`glass-card p-8 mb-8 border-l-4 ${screening.riskCategory === 'High Risk' ? 'border-red-500' : screening.riskCategory === 'Moderate Risk' ? 'border-amber-500' : 'border-emerald-500'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Your screening result</p>
              <h1 className={`text-3xl font-bold ${colors.text}`}>{screening.riskCategory}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-xl">
                Based on your symptom answers and lifestyle habits (including screen time, AC exposure, and hydration), your overall clinical classification is marked as <strong className={colors.text}>{screening.riskCategory}</strong>.
              </p>
            </div>
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white text-3xl shadow-lg`}>
              {screening.riskCategory === 'High Risk' ? '⚠️' : screening.riskCategory === 'Moderate Risk' ? '🔸' : '✅'}
            </div>
          </div>
          {screening.riskCategory === 'High Risk' && (
            <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">We recommend consulting an eye care professional soon.</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <HealthScoreMeter percentage={screening.riskPercentage} category={screening.riskCategory} />
          <RiskPieChart riskFactors={screening.riskFactors} />
        </div>

        <h2 className="text-xl font-bold mb-4">Personalized Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {screening.recommendations?.map((rec, i) => (
            <motion.div
              key={rec.title}
              className={`glass-card p-5 ${rec.urgent ? 'ring-2 ring-red-500/50' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-2xl">{ICONS[rec.icon] || '•'}</span>
              <h3 className="font-semibold mt-2">{rec.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{rec.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          {user ? (
            <Link to="/appointment" state={{ screeningId: screening._id }} className="btn-primary">
              <Calendar className="w-5 h-5" /> {t('bookAppointment')}
            </Link>
          ) : (
            <Link to="/login" state={{ from: { pathname: '/appointment' } }} className="btn-primary">
              <Calendar className="w-5 h-5" /> Log in to book
            </Link>
          )}
          <button type="button" onClick={() => downloadScreeningPDF(screening, user?.name || 'Guest')} className="btn-secondary">
            <Download className="w-5 h-5" /> {t('downloadReport')}
          </button>
          {screening._id && user && (
            <>
              <button type="button" onClick={sendEmail} className="btn-secondary">
                <Mail className="w-5 h-5" /> Email Report
              </button>
              <Link to={`/report/${screening._id}`} className="btn-secondary">
                <FileText className="w-5 h-5" /> Full Report
              </Link>
            </>
          )}
          {user && (
            <Link to="/dashboard" className="btn-secondary">
              <LayoutDashboard className="w-5 h-5" /> {t('dashboard')}
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
