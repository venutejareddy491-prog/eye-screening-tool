import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import api from '../services/api';

export default function ApiStatus() {
  const [down, setDown] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        await api.get('/health', { timeout: 3000 });
        setDown(false);
      } catch {
        setDown(true);
      }
    };
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  if (!down || dismissed) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-sm flex items-center justify-between gap-4" role="alert">
      <span className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        API offline — run START.bat or: cd server → npm run dev (port 5000)
      </span>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
