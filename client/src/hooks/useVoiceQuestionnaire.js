import { useState, useCallback, useEffect, useRef } from 'react';

export function useVoiceQuestionnaire(onResult) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SR);
    if (SR) {
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toLowerCase();
        onResult?.(transcript);
        setListening(false);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
    }
  }, [onResult]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setListening(true);
    recognitionRef.current.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, supported, start, stop };
}

export function matchVoiceToOption(transcript, options) {
  const t = transcript.toLowerCase();
  const found = options.find((o) => {
    const label = o.label.toLowerCase();
    return t.includes(label) || label.split(' ').some((w) => w.length > 3 && t.includes(w));
  });
  if (found) return found.value;
  if (t.includes('never')) return 'never';
  if (t.includes('daily')) return 'daily';
  if (t.includes('often')) return 'often';
  if (t.includes('sometimes')) return 'sometimes';
  if (t.includes('rarely')) return 'rarely';
  return null;
}
