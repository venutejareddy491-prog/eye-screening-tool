import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { syncPendingScreening } from '../utils/syncPendingScreening';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, mobileNumber);
      const saved = await syncPendingScreening();
      if (saved) {
        toast.success('Account created — your screening was saved!');
        navigate('/results', { state: { screening: saved } });
      } else {
        toast.success('Account created!');
        navigate('/screening');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <motion.div className="glass-card p-8 w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">{t('register')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input type="tel" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="input-field" placeholder="e.g. 9876543210" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password (min 6)</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating...' : t('register')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Have an account? <Link to="/login" className="text-healthcare-600 font-medium">{t('login')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
