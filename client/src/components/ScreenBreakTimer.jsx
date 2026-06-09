import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

const WORK_SECONDS = 20 * 60;
const BREAK_SECONDS = 20;

export default function ScreenBreakTimer() {
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [onBreak, setOnBreak] = useState(false);
  const [running, setRunning] = useState(false);

  const reset = useCallback(() => {
    setOnBreak(false);
    setSecondsLeft(WORK_SECONDS);
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (!onBreak) {
            setOnBreak(true);
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('20-20-20 Break', {
                body: 'Look at something 20 feet away for 20 seconds!',
              });
            }
            return BREAK_SECONDS;
          }
          setOnBreak(false);
          return WORK_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, onBreak]);

  const requestNotify = () => {
    if ('Notification' in window) Notification.requestPermission();
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = onBreak
    ? ((BREAK_SECONDS - secondsLeft) / BREAK_SECONDS) * 100
    : ((WORK_SECONDS - secondsLeft) / WORK_SECONDS) * 100;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Timer className="w-5 h-5 text-healthcare-600" />
          20-20-20 Screen Timer
        </h3>
        <button type="button" onClick={requestNotify} className="text-xs text-healthcare-600 hover:underline">
          Enable alerts
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        {onBreak ? 'Break — look 20 feet away!' : 'Work block — timer until your eye break'}
      </p>
      <div className="text-4xl font-mono font-bold text-center mb-4">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
        <motion.div
          className={`h-full ${onBreak ? 'bg-amber-500' : 'bg-healthcare-500'}`}
          style={{ width: `${progress}%` }}
          layout
        />
      </div>
      <div className="flex gap-2 justify-center">
        <button type="button" onClick={() => setRunning(!running)} className="btn-primary py-2 px-4 text-sm">
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button type="button" onClick={reset} className="btn-secondary py-2 px-4 text-sm">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
}
