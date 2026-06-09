import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SuccessModal from '../components/SuccessModal';

export default function Appointment() {
  const { user } = useAuth();
  const { state } = useLocation();
  const [form, setForm] = useState({
    patientName: user?.name || '',
    email: user?.email || '',
    phone: user?.mobileNumber || '',
    appointmentDate: '',
    symptoms: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentAPI.book({
        ...form,
        screeningId: state?.screeningId,
      });
      setSuccess(true);
      toast.success('Appointment request submitted! Email notification sent (simulated).');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <motion.div className="glass-card p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-2">Request Doctor Appointment</h1>
        <p className="text-slate-500 mb-6 text-sm">Our team will contact you within 1–2 business days.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input required value={form.patientName} onChange={(e) => update('patientName', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={form.appointmentDate}
              onChange={(e) => update('appointmentDate', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Symptoms Summary</label>
            <textarea
              required
              rows={4}
              maxLength={2000}
              value={form.symptoms}
              onChange={(e) => update('symptoms', e.target.value)}
              className="input-field resize-none"
              placeholder="Describe your eye symptoms and concerns..."
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </motion.div>

      <SuccessModal
        open={success}
        onClose={() => setSuccess(false)}
        title="Appointment Request Sent!"
        message="A confirmation email has been sent (simulated). Our care team will reach out soon."
      />
    </div>
  );
}
