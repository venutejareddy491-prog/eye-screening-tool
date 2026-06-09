import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

export default function SuccessModal({ open, onClose, title, message }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card p-8 max-w-md w-full text-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-slate-600 dark:text-slate-400">{message}</p>
            <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
