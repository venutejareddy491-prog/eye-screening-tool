import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';
import OptionCard from '../components/OptionCard';
import { QUESTIONNAIRE_STEPS, INITIAL_ANSWERS } from '../utils/questionnaire';
import { screeningAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { buildLocalScreening } from '../utils/riskScoring';
import { savePendingScreening } from '../utils/pendingScreening';
import { useVoiceQuestionnaire, matchVoiceToOption } from '../hooks/useVoiceQuestionnaire';

export default function Screening() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [submitting, setSubmitting] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const navigate = useNavigate();

  const current = QUESTIONNAIRE_STEPS[step];
  const progress = ((step + 1) / QUESTIONNAIRE_STEPS.length) * 100;

  const handleVoice = (transcript) => {
    if (!activeQuestion) return;
    const q = current.questions.find((x) => x.key === activeQuestion);
    if (!q) return;
    const val = matchVoiceToOption(transcript, q.options);
    if (val) {
      setAnswers((a) => ({ ...a, [activeQuestion]: val }));
      toast.success(`Selected: ${q.options.find((o) => o.value === val)?.label}`);
    } else {
      toast.error('Could not match voice. Try again or tap an option.');
    }
  };

  const { listening, supported, start, stop } = useVoiceQuestionnaire(handleVoice);

  const allAnswered = current.questions.every((q) => answers[q.key]);

  const next = async () => {
    if (!allAnswered) {
      toast.error('Please answer all questions on this step');
      return;
    }
    if (step < QUESTIONNAIRE_STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    try {
      if (!user) {
        savePendingScreening(answers);
        const local = buildLocalScreening(answers);
        navigate('/results', { state: { screening: local, guest: true } });
        return;
      }
      const { data } = await screeningAPI.submit({ answers, emailReport: true });
      navigate('/results', { state: { screening: data.screening, guest: false } });
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        if (!user) savePendingScreening(answers);
        const local = buildLocalScreening(answers);
        toast('API offline — showing local results. Log in to save.', { icon: '⚠️' });
        navigate('/results', { state: { screening: local, guest: true } });
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit screening');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>Step {step + 1} of {QUESTIONNAIRE_STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-healthcare-600 to-healthcare-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold mb-1">{current.title}</h1>
          <p className="text-slate-500 mb-8">{current.subtitle}</p>

          <div className="space-y-8">
            {current.questions.map((q) => (
              <div key={q.key}>
                <div className="flex items-center justify-between mb-3">
                  <label className="font-medium">{q.label}</label>
                  {supported && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQuestion(q.key);
                        listening ? stop() : start();
                      }}
                      className={`p-2 rounded-lg text-sm flex items-center gap-1 ${
                        listening && activeQuestion === q.key
                          ? 'bg-red-100 text-red-600'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {listening && activeQuestion === q.key ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      Voice
                    </button>
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      selected={answers[q.key] === opt.value}
                      onClick={() => setAnswers((a) => ({ ...a, [q.key]: opt.value }))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-secondary disabled:opacity-40"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button type="button" onClick={next} disabled={submitting} className="btn-primary">
          {step === QUESTIONNAIRE_STEPS.length - 1 ? (submitting ? 'Analyzing...' : 'Get Results') : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
