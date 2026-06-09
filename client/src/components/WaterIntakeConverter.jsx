import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, Minus, Info } from 'lucide-react';

export default function WaterIntakeConverter() {
  const [glasses, setGlasses] = useState(6);

  const liters = (glasses * 0.25).toFixed(2);
  const ml = glasses * 250;

  // Hydration status mapping
  let status = 'Dehydrated';
  let statusColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900';
  let liquidColor = 'bg-blue-400';
  let message = 'Keep drinking! You are below the recommended 2 liters (8 glasses) of daily water intake.';

  if (glasses < 3) {
    status = 'Severe Dehydration';
    statusColor = 'text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900';
    liquidColor = 'bg-red-400';
    message = 'Warning: Extremely low hydration level. Please drink a glass of water immediately!';
  } else if (glasses >= 8) {
    status = 'Optimal Hydration';
    statusColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900';
    liquidColor = 'bg-gradient-to-t from-blue-600 to-cyan-400';
    message = 'Excellent job! You have reached the recommended daily hydration target to keep eyes moist.';
  } else if (glasses >= 4) {
    status = 'Adequate Hydration';
    statusColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900';
    liquidColor = 'bg-gradient-to-t from-blue-500 to-blue-300';
    message = 'Decent hydration, but aiming for 8 glasses (2.0 liters) is optimal for dry eye relief.';
  }

  const increment = () => setGlasses((g) => Math.min(20, g + 1));
  const decrement = () => setGlasses((g) => Math.max(0, g - 1));

  // Visual glass fill percentage (max 10 glasses for full cup height)
  const fillPercentage = Math.min(100, (glasses / 10) * 100);

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-500" />
            Water Intake Converter
          </h3>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${statusColor}`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Track and convert your daily hydration metrics from glasses to medical volume.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 items-center flex-1">
        {/* Left Column: Interactive controls */}
        <div className="text-left space-y-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={decrement}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center min-w-[70px]">
              <span className="text-4xl font-bold font-mono">{glasses}</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Glasses</p>
            </div>
            <button
              type="button"
              onClick={increment}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-500">Metric Equivalent:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{liters} Liters</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Milliliters:</span>
              <span>{ml} ml</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Filling Cup */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-24 h-32 border-4 border-slate-300 dark:border-slate-700 rounded-b-2xl overflow-hidden bg-slate-100/50 dark:bg-slate-900/50 shadow-inner flex items-end">
            <motion.div
              className={`w-full ${liquidColor}`}
              initial={{ height: 0 }}
              animate={{ height: `${fillPercentage}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            />
            {/* Water Wave Effect overlays */}
            {glasses > 0 && (
              <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none opacity-20 bg-[linear-gradient(to_bottom,transparent_80%,rgba(255,255,255,0.4)_100%)] animate-pulse" />
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-2">1 Glass = 250ml</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex gap-2 text-xs text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-normal">{message}</p>
      </div>
    </div>
  );
}
