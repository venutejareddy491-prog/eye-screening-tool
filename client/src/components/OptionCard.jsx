import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function OptionCard({ label, selected, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-healthcare-500 bg-healthcare-50 dark:bg-healthcare-900/30 shadow-md'
          : 'border-slate-200 dark:border-slate-700 hover:border-healthcare-300 glass-card'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{label}</span>
        {selected && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Check className="w-5 h-5 text-healthcare-600" />
          </motion.span>
        )}
      </div>
    </motion.button>
  );
}
