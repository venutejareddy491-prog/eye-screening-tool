import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const TIPS = [
  { q: /20-20-20|break|screen/i, a: 'Follow the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds.' },
  { q: /tear|drop|lubricat/i, a: 'Preservative-free artificial tears can relieve mild dry eye. Use as directed on the label.' },
  { q: /hydrat|water|drink/i, a: 'Aim for 6–8 glasses of water daily. Hydration supports tear film stability.' },
  { q: /sleep|rest/i, a: 'Quality sleep (7–8 hours) helps eye recovery. Avoid screens 1 hour before bed.' },
  { q: /doctor|specialist|appointment/i, a: 'If symptoms persist or worsen, book an appointment through our form or see an ophthalmologist.' },
  { q: /contact|lens/i, a: 'Limit contact lens wear on dry days, keep lenses clean, and use lubricating drops approved for contacts.' },
  { q: /smok/i, a: 'Smoking worsens dry eye. Reducing exposure to smoke helps tear production.' },
  { q: /ac|air.?condition|humid/i, a: 'AC reduces humidity. Use a humidifier and avoid direct airflow toward your eyes.' },
];

const DEFAULT_REPLY =
  'I can help with eye-care tips: ask about the 20-20-20 rule, hydration, artificial tears, sleep, or when to see a doctor.';

function getReply(text) {
  const match = TIPS.find((t) => t.q.test(text));
  return match ? match.a : DEFAULT_REPLY;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your eye-care assistant. Ask me about dry eye tips and habits.' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: 'user', text: userMsg }, { role: 'bot', text: getReply(userMsg) }]);
    setInput('');
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-healthcare-600 to-healthcare-500 text-white shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-[min(100vw-2rem,380px)] glass-card flex flex-col overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-healthcare-600 text-white">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Eye Care Assistant</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 h-72 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm p-3 rounded-xl max-w-[90%] ${
                    msg.role === 'user'
                      ? 'ml-auto bg-healthcare-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask about eye care..."
                className="input-field flex-1 py-2 text-sm"
              />
              <button type="button" onClick={send} className="p-2 rounded-xl bg-healthcare-600 text-white">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
