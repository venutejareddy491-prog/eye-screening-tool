import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus, Bell, ExternalLink } from 'lucide-react';
import EyeSafetyModule from '../components/EyeSafetyModule';
import WaterIntakeConverter from '../components/WaterIntakeConverter';
import { useReminders } from '../hooks/useReminders';
import { screeningAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import HealthScoreMeter from '../components/HealthScoreMeter';
import RiskPieChart from '../components/RiskPieChart';
import { riskColor } from '../utils/riskScoring';
import { downloadScreeningPDF } from '../utils/pdfReport';

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { reminders, toggle, requestPermission } = useReminders();

  useEffect(() => {
    if (location.state?.adminDenied) {
      toast.error('Admin access only. Use admin@dryeye.com to open /admin');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  useEffect(() => {
    screeningAPI
      .results()
      .then(({ data }) => setScreenings(data.screenings || []))
      .catch(() => setScreenings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton fullPage />;

  const latest = screenings[0];

  // Map categories to levels for the history trend chart
  const chartData = screenings.slice(0, 6).reverse().map((s, i) => {
    let level = 1;
    if (s.riskCategory === 'Moderate Risk') level = 2;
    else if (s.riskCategory === 'High Risk') level = 3;
    return {
      name: `#${i + 1}`,
      level,
      category: s.riskCategory,
      date: new Date(s.createdAt).toLocaleDateString(),
    };
  });

  const mapWaterIntake = (val) => {
    if (val === 'over8') return '8+ glasses (~2.0+ Liters)';
    if (val === '6-8') return '6–8 glasses (~1.5–2.0 L)';
    if (val === '4-6') return '4–6 glasses (~1.0–1.5 L)';
    if (val === '2-4') return '2–4 glasses (~0.5–1.0 L)';
    if (val === 'under2') return 'Under 2 glasses (<0.5 L)';
    return val;
  };

  const lifestyleStats = latest
    ? [
        { label: 'Screen Time Hours', value: latest.screenTime || latest.answers?.screenTime },
        { label: 'Sleep Hygiene', value: latest.sleepQuality || latest.answers?.sleepQuality },
        { label: 'Hydration Level', value: mapWaterIntake(latest.waterIntake || latest.answers?.waterIntake) },
        { label: 'AC Environment Exposure', value: latest.acExposure || latest.answers?.acExposure },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-slate-500">Your clinical screening history and eye health analytics</p>
        </div>
        <Link to="/screening" className="btn-primary">
          <Plus className="w-5 h-5" /> New Screening
        </Link>
      </div>

      {!latest ? (
        <div className="glass-card p-12 text-center">
          <p className="mb-4">No screenings completed yet. Start your first assessment to monitor dry eye signs.</p>
          <Link to="/screening" className="btn-primary">Start Screening</Link>
        </div>
      ) : (
        <>
          {/* Latest Result Banner */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Latest Screening Result</h2>
                <div className="flex items-center gap-4 mb-4">
                  <span className={`text-2xl font-bold px-4.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm ${riskColor(latest.riskCategory).text}`}>
                    {latest.riskCategory}
                  </span>
                  <span className="text-sm text-slate-500">{new Date(latest.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  Based on your responses from {new Date(latest.createdAt).toLocaleDateString()}, your dry eye screening category is classified as <strong className={riskColor(latest.riskCategory).text}>{latest.riskCategory}</strong>. Focus on taking regular screen breaks and maintaining hydration.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => downloadScreeningPDF(latest, user?.name)} className="btn-primary text-sm">
                  Download PDF Report
                </button>
                <Link to={`/report/${latest._id}`} className="btn-secondary text-sm">
                  View Full Details
                </Link>
              </div>
            </div>
            <HealthScoreMeter category={latest.riskCategory} />
          </motion.div>

          {/* Historical Trend and Factors breakdown */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Assessment History Trend</h2>
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis
                      ticks={[1, 2, 3]}
                      tickFormatter={(value) => {
                        if (value === 1) return 'Low';
                        if (value === 2) return 'Mod';
                        if (value === 3) return 'High';
                        return '';
                      }}
                      domain={[0, 3.5]}
                    />
                    <Tooltip formatter={(value, name, props) => [props.payload.category, 'Risk Classification']} />
                    <Bar dataKey="level" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                  <p className="text-slate-400 text-sm">Complete more screening questionnaires to analyze trends.</p>
                </div>
              )}
            </div>
            <RiskPieChart riskFactors={latest.riskFactors} />
          </div>

          {/* Eye Safety Timer + Hydration Converter */}
          <motion.div className="grid lg:grid-cols-2 gap-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <EyeSafetyModule />
            <WaterIntakeConverter />
          </motion.div>

          {/* Lifestyle Analytics + Care reminders checklist */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-semibold mb-4">Lifestyle Assessment Breakdown</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {lifestyleStats.map((s) => (
                    <div key={s.label} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                      <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                      <p className="font-semibold capitalize text-sm">{s.value?.replace(/-/g, ' ') || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-healthcare-600" /> Care Reminders
                </span>
                <button type="button" onClick={requestPermission} className="text-xs text-healthcare-600 hover:underline">
                  Enable alerts
                </button>
              </h2>
              <ul className="space-y-3">
                {reminders.map((r) => (
                  <li key={r.id} className="flex items-center justify-between text-sm">
                    <span className={r.enabled ? '' : 'text-slate-400 line-through'}>{r.text}</span>
                    <button
                      type="button"
                      onClick={() => toggle(r.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition duration-200 ${
                        r.enabled ? 'bg-healthcare-100 text-healthcare-700 font-medium' : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {r.enabled ? 'On' : 'Off'}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 mt-4 leading-normal">
                Reminders trigger browser push alerts to stay hydrated and rest your eyes periodically.
              </p>
            </div>
          </div>

          {/* List of screenings */}
          <div className="glass-card p-6 mt-8">
            <h2 className="font-semibold mb-4">All Screening Assessments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 font-semibold">Date Completed</th>
                    <th className="py-3 font-semibold">Risk Classification</th>
                    <th className="py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {screenings.map((s) => (
                    <tr key={s._id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                      <td className="py-4 font-medium">{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td className={`py-4 font-semibold ${riskColor(s.riskCategory).text}`}>{s.riskCategory}</td>
                      <td className="py-4">
                        <Link to={`/report/${s._id}`} className="text-healthcare-600 hover:text-healthcare-700 hover:underline inline-flex items-center gap-1 text-sm font-semibold">
                          View Full Report <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
