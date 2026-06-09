import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { screeningAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import HealthScoreMeter from '../components/HealthScoreMeter';
import RiskPieChart from '../components/RiskPieChart';
import { riskColor } from '../utils/riskScoring';
import { downloadScreeningPDF } from '../utils/pdfReport';
import { QUESTIONNAIRE_STEPS } from '../utils/questionnaire';

const labelMap = {};
QUESTIONNAIRE_STEPS.forEach((step) => {
  step.questions.forEach((q) => {
    labelMap[q.key] = q.label;
  });
});

export default function ReportDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    screeningAPI
      .getById(id)
      .then(({ data }) => setScreening(data.screening))
      .catch(() => toast.error('Report not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const sendEmail = async () => {
    try {
      await screeningAPI.emailReport(id);
      toast.success('Report emailed (simulated) to ' + user?.email);
    } catch {
      toast.error('Could not send email');
    }
  };

  if (loading) return <LoadingSkeleton fullPage />;
  if (!screening) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p>Report not found.</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">Back to Dashboard</Link>
      </div>
    );
  }

  const colors = riskColor(screening.riskCategory);
  const answers = screening.answers || { ...screening.symptoms, ...screening };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-healthcare-600 mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Screening Report</h1>
            <p className="text-slate-500">{new Date(screening.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => downloadScreeningPDF(screening, user?.name)} className="btn-secondary text-sm">
              <Download className="w-4 h-4" /> PDF
            </button>
            <button type="button" onClick={sendEmail} className="btn-secondary text-sm">
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>
        </div>

        <div className={`glass-card p-6 mb-8 border-l-4 ${screening.riskCategory === 'High Risk' ? 'border-red-500' : screening.riskCategory === 'Moderate Risk' ? 'border-amber-500' : 'border-emerald-500'} flex items-center justify-between`}>
          <div>
            <p className="text-xs text-slate-500 mb-1">Assessment Classification</p>
            <h2 className={`text-2xl font-bold ${colors.text}`}>{screening.riskCategory}</h2>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${colors.bg} text-white shadow-sm`}>
            {screening.riskCategory}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <HealthScoreMeter percentage={screening.riskPercentage} category={screening.riskCategory} />
          <RiskPieChart riskFactors={screening.riskFactors} />
        </div>

        <div className="glass-card p-6 mb-8">
          <h2 className="font-semibold mb-4">Response Summary</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {Object.entries(answers)
              .filter(([k, v]) => v && labelMap[k])
              .map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-slate-500 text-xs">{labelMap[k]}</p>
                  <p className="font-medium capitalize">{String(v).replace(/-/g, ' ')}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">Recommendations</h2>
          <ul className="space-y-3">
            {screening.recommendations?.map((r) => (
              <li key={r.title} className="border-l-4 border-healthcare-500 pl-4">
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
