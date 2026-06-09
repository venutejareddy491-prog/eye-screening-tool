import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Play, Pause, RotateCcw, Bell, BellOff, CheckCircle } from 'lucide-react';

const WORK_SECONDS = 20 * 60; // 20 minutes
const BREAK_SECONDS = 20;     // 20 seconds

export default function EyeSafetyModule() {
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [onBreak, setOnBreak] = useState(false);
  const [running, setRunning] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  });

  const reset = useCallback(() => {
    setOnBreak(false);
    setSecondsLeft(WORK_SECONDS);
    setRunning(false);
  }, []);

  const triggerNotification = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Eye Safety Break!', {
        body: 'Every 20 minutes, take a 20-second break and look 20 feet away from the screen.',
        icon: '/favicon.ico',
        tag: 'eye-safety-reminder',
      });
    }
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (!onBreak) {
            setOnBreak(true);
            triggerNotification();
            return BREAK_SECONDS;
          }
          setOnBreak(false);
          return WORK_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, onBreak, triggerNotification]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = onBreak
    ? ((BREAK_SECONDS - secondsLeft) / BREAK_SECONDS) * 100
    : ((WORK_SECONDS - secondsLeft) / WORK_SECONDS) * 100;

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-healthcare-600" />
            Combined Eye Safety Module
          </h3>
          <button
            type="button"
            onClick={requestNotificationPermission}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
              notificationsEnabled
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
                : 'text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800'
            }`}
            title={notificationsEnabled ? 'Notifications active' : 'Click to enable notifications'}
          >
            {notificationsEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
            {notificationsEnabled ? 'Alerts On' : 'Alerts Off'}
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Aggregates the 20-20-20 Rule and Screen Time Breaks into a single reminder system with custom alerts.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 my-2">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Circular Progress Bar */}
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="6"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className={onBreak ? 'text-amber-500' : 'text-healthcare-600'}
              stroke="currentColor"
              strokeDasharray="276"
              animate={{ strokeDasharray: `${(progress * 276) / 100} 276` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>

          {/* Text inside the circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={onBreak ? 'break' : 'work'}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`text-xs uppercase font-bold tracking-wider ${onBreak ? 'text-amber-500' : 'text-slate-500'}`}
              >
                {onBreak ? 'Eye Break' : 'Focus Time'}
              </motion.span>
            </AnimatePresence>
            <span className="text-3xl font-bold font-mono tracking-tight my-0.5">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">
              {onBreak ? 'Look 20ft away!' : 'Until next break'}
            </span>
          </div>
        </div>
      </div>

      {/* Message and Controls */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-center space-y-4">
        <div className="p-3 bg-healthcare-50/50 dark:bg-healthcare-950/10 rounded-xl border border-healthcare-100/60 dark:border-healthcare-900/30 text-left">
          <p className="text-[11px] text-healthcare-700 dark:text-healthcare-300 font-medium leading-relaxed">
            💡 <strong>Safety Standard:</strong> Every 20 minutes, take a 20-second break and look 20 feet away from the screen.
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => setRunning(!running)}
            className={`btn-primary py-2 px-6 text-sm font-semibold flex items-center gap-1.5 shadow-sm rounded-xl ${
              running ? 'bg-amber-600 hover:bg-amber-700' : ''
            }`}
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? 'Pause Timer' : 'Start Timer'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="btn-secondary py-2 px-4 text-sm font-semibold flex items-center gap-1.5 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
