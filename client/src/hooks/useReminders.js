import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dryEyeReminders';

const DEFAULT_REMINDERS = [
  { id: '2', text: 'Drink a glass of water', intervalHours: 2, enabled: true },
  { id: '3', text: 'Blink exercise — 10 slow blinks', intervalHours: 3, enabled: true },
];

export function useReminders() {
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    if (!('Notification' in window)) return undefined;

    const check = () => {
      const now = Date.now();
      reminders.forEach((r) => {
        if (!r.enabled) return;
        const lastKey = `reminder_last_${r.id}`;
        const last = Number(localStorage.getItem(lastKey) || 0);
        const intervalMs = r.intervalHours * 60 * 60 * 1000;
        if (now - last >= intervalMs && Notification.permission === 'granted') {
          new Notification('Dry Eye Care Reminder', { body: r.text });
          localStorage.setItem(lastKey, String(now));
        }
      });
    };

    const id = setInterval(check, 60 * 1000);
    check();
    return () => clearInterval(id);
  }, [reminders]);

  const toggle = (id) => {
    setReminders((list) => list.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const requestPermission = () => {
    if ('Notification' in window) Notification.requestPermission();
  };

  return { reminders, toggle, requestPermission };
}
