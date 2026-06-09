import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, AlertOctagon } from 'lucide-react';

export default function HealthScoreMeter({ category }) {
  const risks = [
    {
      id: 'Low Risk',
      title: 'Low Risk',
      color: 'emerald',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400',
      activeShadow: 'shadow-emerald-500/20 ring-emerald-500',
      icon: ShieldCheck,
      desc: 'Minimal dry eye symptoms. Maintain good screen hygiene and stay hydrated!',
    },
    {
      id: 'Moderate Risk',
      title: 'Moderate Risk',
      color: 'amber',
      bgClass: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400',
      activeShadow: 'shadow-amber-500/20 ring-amber-500',
      icon: AlertCircle,
      desc: 'Mild dry eye signs. We suggest screen breaks, artificial tears, and hydration.',
    },
    {
      id: 'High Risk',
      title: 'High Risk',
      color: 'red',
      bgClass: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
      activeShadow: 'shadow-red-500/20 ring-red-500',
      icon: AlertOctagon,
      desc: 'Elevated symptom levels. Consider consulting an eye specialist for an assessment.',
    },
  ];

  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-1">Clinical Risk Classification</h3>
        <p className="text-xs text-slate-500 mb-4">Self-screening category based on your symptoms and lifestyle habits.</p>
      </div>

      <div className="space-y-3">
        {risks.map((risk) => {
          const isActive = category === risk.id;
          const Icon = risk.icon;

          return (
            <motion.div
              key={risk.id}
              className={`p-4 rounded-xl border flex gap-3 transition-all duration-300 ${
                isActive
                  ? `${risk.bgClass} ring-2 ${risk.activeShadow} shadow-lg scale-[1.02]`
                  : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 text-slate-400 opacity-60'
              }`}
              initial={isActive ? { scale: 0.98 } : {}}
              animate={isActive ? { scale: 1.02 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className={`p-2 rounded-lg flex items-center justify-center self-start ${isActive ? 'bg-white dark:bg-slate-900 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{risk.title}</h4>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 shadow-sm">
                      Active Status
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>
                  {risk.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
