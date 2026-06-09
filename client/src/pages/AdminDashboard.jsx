import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileText, AlertCircle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { riskColor } from '../utils/riskScoring';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      adminAPI.reports(),
      adminAPI.users({ search: search || undefined, risk: highRiskOnly ? 'high' : undefined }),
    ])
      .then(([reportsRes, usersRes]) => {
        setData(reportsRes.data);
        setUsers(usersRes.data.users || []);
      })
      .catch((err) => {
        const msg =
          err.response?.status === 403
            ? 'Admin access required. Log in with admin@dryeye.com'
            : err.response?.status === 401
              ? 'Please log in first.'
              : err.code === 'ERR_NETWORK'
                ? 'Cannot reach API. Start the server: cd server && npm run dev (port 5000)'
                : err.response?.data?.message || 'Failed to load admin data';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [highRiskOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const updateStatus = async (id, status) => {
    try {
      await adminAPI.updateAppointment(id, status);
      toast.success(`Appointment marked ${status}`);
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  if (loading && !data && !error) return <LoadingSkeleton fullPage />;

  if (error && !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-red-600 mb-4">Admin Panel Unavailable</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-secondary">Home</Link>
          <Link to="/login" className="btn-primary">Log In</Link>
        </div>
      </div>
    );
  }

  const analytics = data?.analytics || {};
  const pieData = (analytics.byRisk || []).map((r) => ({
    name: r._id,
    value: r.count,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-200">Clinical Administrator Portal</h1>

      {/* Statistics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Registered Patients', value: analytics.totalUsers },
          { icon: FileText, label: 'Screening Assessments', value: analytics.totalScreenings },
          { icon: AlertCircle, label: 'High Risk Alerts', value: analytics.highRiskCount },
          { icon: Calendar, label: 'Pending Appointments', value: analytics.pendingAppointments },
        ].map((stat) => (
          <motion.div key={stat.label} className="glass-card p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm" whileHover={{ y: -2 }}>
            <stat.icon className="w-8 h-8 text-healthcare-600 mb-2" />
            <p className="text-2xl font-bold">{stat.value ?? 0}</p>
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Patient Risk Distribution</h2>
          {pieData.length === 0 ? (
            <p className="text-slate-500 text-sm h-[220px] flex items-center justify-center">No screenings completed yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Assessment Volume by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={(analytics.byRisk || []).map((r) => ({ name: r._id, count: r.count || 0 }))}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Total Submissions']} />
              <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patient Search and Records Table */}
      <div className="glass-card p-6 mb-8">
        <h2 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Patient Directory</h2>
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients by name, email, or mobile..."
            className="input-field flex-1 min-w-[200px]"
          />
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={highRiskOnly} onChange={(e) => setHighRiskOnly(e.target.checked)} />
            High risk classification only
          </label>
          <button type="submit" className="btn-primary">Search</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                <th className="py-3">Name</th>
                <th className="py-3">Email Address</th>
                <th className="py-3">Mobile Number</th>
                <th className="py-3">Registration Date</th>
                <th className="py-3">WhatsApp Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const cleanPhone = u.mobileNumber ? u.mobileNumber.replace(/\D/g, '') : '';
                const whatsappUrl = cleanPhone 
                  ? `https://wa.me/${cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : '91' + cleanPhone}?text=Hello%20${encodeURIComponent(u.name)},%20this%20is%20the%20Smart%20Dry%20Eye%20Clinic.%20We%20wanted%20to%20follow%20up%20on%20your%20recent%20dry%20eye%20health%20profile.`
                  : '';
                return (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                    <td className="py-3.5 font-medium text-slate-800 dark:text-slate-200">{u.name}</td>
                    <td className="py-3.5">{u.email}</td>
                    <td className="py-3.5">
                      {u.mobileNumber ? (
                        <a 
                          href={whatsappUrl || `tel:${u.mobileNumber}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-healthcare-600 hover:underline font-semibold flex items-center gap-1"
                        >
                          💬 {u.mobileNumber}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No mobile number</span>
                      )}
                    </td>
                    <td className="py-3.5">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5">
                      {u.mobileNumber ? (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          Contact on WhatsApp
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unavailable</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400 italic">
                    No patients matched the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenings and Appointments Split Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent screenings list */}
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Recent Screening Submissions</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {(data?.screenings || []).map((s) => {
              const cleanPhone = s.user?.mobileNumber ? s.user.mobileNumber.replace(/\D/g, '') : '';
              const screeningWhatsappUrl = cleanPhone 
                ? `https://wa.me/${cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : '91' + cleanPhone}?text=Hello%20${encodeURIComponent(s.user?.name)},%20this%20is%20the%20Smart%20Dry%20Eye%20Clinic.%20We%20have%20received%20your%20assessment%20categorized%20as%20${encodeURIComponent(s.riskCategory)}.%20Would%20you%20like%20to%20schedule%20a%20detailed%20clinical%20visit?`
                : '';
              return (
                <div key={s._id} className="text-sm border-b border-slate-100 dark:border-slate-800 pb-3 hover:bg-slate-50/20 dark:hover:bg-slate-900/5 transition">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{s.user?.name || 'Guest User'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {s.user?.email || 'No email'} · Submitted: {new Date(s.createdAt).toLocaleString()}
                      </p>
                      {s.user?.mobileNumber && (
                        <p className="text-xs font-semibold text-healthcare-600 mt-1">
                          📞 {s.user.mobileNumber}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border block text-center ${riskColor(s.riskCategory).text} bg-white dark:bg-slate-950`}>
                        {s.riskCategory}
                      </span>
                      {s.user?.mobileNumber && (
                        <a
                          href={screeningWhatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 text-[10px] px-2.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded font-bold transition"
                        >
                          WhatsApp Follow-up
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {(data?.screenings || []).length === 0 && (
              <p className="text-slate-400 text-sm italic py-4">No recent screenings completed yet.</p>
            )}
          </div>
        </div>

        {/* Appointment Requests and Confirmation Actions */}
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Doctor Appointment Requests</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {(data?.appointments || []).map((a) => {
              const cleanPhone = a.phone ? a.phone.replace(/\D/g, '') : '';
              const appointmentWhatsappUrl = cleanPhone 
                ? `https://wa.me/${cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : '91' + cleanPhone}?text=Hello%20${encodeURIComponent(a.patientName)},%20this%20is%20the%20Smart%20Dry%20Eye%20Clinic.%20We%20are%20pleased%20to%20confirm%20your%20appointment%20request%20for%20${encodeURIComponent(new Date(a.appointmentDate).toLocaleDateString())}.%20Please%20let%20us%20know%20if%20this%20works%20for%20you!`
                : '';
              return (
                <div key={a._id} className="text-sm border-b border-slate-100 dark:border-slate-800 pb-3 hover:bg-slate-50/20 dark:hover:bg-slate-900/5 transition">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{a.patientName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {a.email} · Appt: {new Date(a.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-semibold text-healthcare-600 mt-1 flex items-center gap-1">
                        📞 {a.phone}
                      </p>
                    </div>
                    {a.phone && (
                      <a
                        href={appointmentWhatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold transition shadow-sm shrink-0"
                      >
                        Confirm on WhatsApp
                      </a>
                    )}
                  </div>
                  
                  <div className="mt-2.5 flex items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 italic truncate max-w-[200px]" title={a.symptoms}>
                      Symptoms: {a.symptoms}
                    </p>
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                      className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2 py-1 font-semibold text-slate-600 dark:text-slate-400"
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </div>
              );
            })}
            {(data?.appointments || []).length === 0 && (
              <p className="text-slate-400 text-sm italic py-4">No appointment requests pending.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
