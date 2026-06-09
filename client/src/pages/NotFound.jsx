import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        className="glass-card p-10 text-center max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-6xl font-bold text-healthcare-600">404</p>
        <h1 className="text-xl font-bold mt-2">Page not found</h1>
        <p className="text-slate-500 mt-2 mb-6">This page does not exist or was moved.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/screening" className="btn-secondary">
            <Search className="w-4 h-4" /> Start Screening
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
