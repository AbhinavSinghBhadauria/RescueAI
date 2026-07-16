import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Mic, Send, Copy, RotateCcw, ThumbsUp, ThumbsDown, Sparkles, User, Download, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import AIOrb from '../components/ui/AIOrb';
import { useModels } from '../context/ModelContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { api } from '../api/client';

const SYSTEM_PROMPT = {
  role: 'system',
  content: 'You are RescueAI, an on-device emergency first-aid assistant. Give short, calm, practical first-aid guidance. Always remind the user to call local emergency services for anything severe. Never claim to be a doctor. Keep responses under 120 words.',
};

const suggestedPrompts = [
  'Someone is choking, what do I do?',
  'How do I treat a second-degree burn?',
  'Steps for CPR on an adult',
  'Is this snake bite venomous?',
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-medical"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function AIAssistant() {
  const { chatModel } = useModels();
  const location = useLocation();
  const online = useNetworkStatus();
  const [messages, setMessages] = useState([
    { id: 'm1', role: 'ai', text: "Hi, I'm RescueAI. I run a real language model directly in this browser tab — nothing you type is sent to a server.", time: 'now' },
  ]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const autoSentRef = useRef(false);
  const scrollRef = useRef(null);

  const speech = useSpeechRecognition({
    onResult: (text) => setInput((prev) => (prev ? `${prev} ${text}` : text)),
  });

  const handleMic = () => {
    if (!speech.supported) {
      toast.info("Voice input isn't supported in this browser — try Chrome or Edge, or type instead.");
      return;
    }
    speech.toggle();
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, generating]);

  // Load the model the moment this page opens — no button click required.
  // Whether you arrived by typing on the home screen or via the sidebar,
  // if you're online, the model starts downloading immediately.
  useEffect(() => {
    if (chatModel.status !== 'idle') return;
    chatModel.load().catch((err) => {
      console.error(err);
      toast.error(`Model failed to load: ${err?.message || 'unknown error'}. Check the browser console for details.`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A message typed on the home screen lands here — once the model above
  // finishes loading, send it automatically instead of making you press
  // Send a second time.
  useEffect(() => {
    const draft = location.state?.draftMessage;
    if (!draft || autoSentRef.current || chatModel.status !== 'ready') return;
    autoSentRef.current = true;
    send(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatModel.status]);

  const send = async (text) => {
    const t = text ?? input;
    if (!t.trim() || generating) return;

    if (chatModel.status !== 'ready') {
      try {
        toast.info('Loading the on-device model…');
        await chatModel.load();
      } catch (err) {
        console.error(err);
        toast.error(`Model failed to load: ${err?.message || 'unknown error'}. Check the browser console for details.`);
        return;
      }
    }

    const userMsg = { id: crypto.randomUUID(), role: 'user', text: t, time: 'now' };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setGenerating(true);

    const aiId = crypto.randomUUID();
    setMessages((m) => [...m, { id: aiId, role: 'ai', text: '', time: 'now', streaming: true }]);

    const history = [...messages, userMsg]
      .filter((m) => m.text)
      .map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

    try {
      await chatModel.generate([SYSTEM_PROMPT, ...history], (token) => {
        setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, text: m.text + token } : m)));
      });
    } catch (err) {
      toast.error('Local model error — see console for details.');
      console.error(err);
    } finally {
      setGenerating(false);
      setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, streaming: false } : m)));
      api.addHistory({ type: 'Chat', title: t.slice(0, 60) }).catch(() => {});
    }
  };

  const loadModel = async () => {
    try {
      await chatModel.load();
      toast.success('On-device model ready — fully offline from here on.');
    } catch (err) {
      toast.error('Could not load the model. Check your connection and try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        eyebrow="AI Assistant"
        title="Talk to RescueAI"
        subtitle="A real language model runs in this tab via WebAssembly/WebGPU — your conversation never leaves the browser."
      />

      <div className="px-4 md:px-6">
        <GlassCard className="rounded-xl3 flex flex-col h-[68vh]" hover={false}>
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <AIOrb size={40} listening={generating} />
            <div className="flex-1">
              <p className="font-medium text-sm">RescueAI Assistant</p>
              {chatModel.status === 'ready' && (
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Model loaded — running on-device
                </p>
              )}
              {(chatModel.status === 'loading' || chatModel.status === 'idle') && (
                <p className="text-xs text-medical">Downloading model automatically… {chatModel.progress}%</p>
              )}
              {chatModel.status === 'error' && (
                <p className="text-xs text-emergency">Model failed to load</p>
              )}
            </div>
            {chatModel.status === 'error' && (
              <button
                onClick={loadModel}
                className="flex items-center gap-1.5 text-xs bg-emergency/15 text-emergency px-3 py-1.5 rounded-full hover:bg-emergency/25 transition-colors"
              >
                <Download size={13} />
                Retry
              </button>
            )}
          </div>

          {chatModel.status === 'loading' && (
            <div className="h-1 bg-white/5 overflow-hidden">
              <motion.div className="h-full bg-medical" animate={{ width: `${chatModel.progress}%` }} />
            </div>
          )}

          {chatModel.status === 'error' && (
            <div className="px-4 py-2 bg-emergency/10 text-emergency text-xs flex items-center gap-2">
              <AlertTriangle size={13} /> Model failed to load — check your internet connection and retry.
            </div>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'ai' && (
                    <span className="w-8 h-8 rounded-full bg-emergency flex items-center justify-center shrink-0">
                      <Sparkles size={14} />
                    </span>
                  )}
                  <div className={`max-w-[78%] ${m.role === 'user' ? 'order-1' : ''}`}>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user' ? 'bg-medical text-[#04101a]' : 'glass'
                    }`}>
                      {m.text || (m.streaming && <TypingDots />)}
                      {m.streaming && m.text && <span className="inline-block w-1.5 h-3.5 bg-medical/70 ml-0.5 animate-pulse align-middle" />}
                    </div>
                    <div className={`flex items-center gap-2 mt-1.5 text-[11px] text-subtext ${m.role === 'user' ? 'justify-end' : ''}`}>
                      <span className="font-mono-ui">{m.time}</span>
                      {m.role === 'ai' && !m.streaming && m.text && (
                        <>
                          <button onClick={() => { navigator.clipboard?.writeText(m.text); toast.success('Copied to clipboard'); }} className="hover:text-white"><Copy size={12} /></button>
                          <button onClick={() => send(messages.find((x) => x.role === 'user')?.text)} className="hover:text-white"><RotateCcw size={12} /></button>
                          <button className="hover:text-success"><ThumbsUp size={12} /></button>
                          <button className="hover:text-emergency"><ThumbsDown size={12} /></button>
                        </>
                      )}
                    </div>
                  </div>
                  {m.role === 'user' && (
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <User size={14} />
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {messages.length < 2 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-xs glass rounded-full px-3.5 py-1.5 text-subtext hover:text-white hover:bg-white/10 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="p-3.5 border-t border-white/10 flex items-center gap-2">
            <input style={{ color: '#EDEAE3' }}
              value={speech.listening && speech.interimTranscript ? `${input} ${speech.interimTranscript}` : input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={chatModel.status === 'ready' ? 'Type your emergency…' : online ? 'Type your emergency — the model loads automatically…' : 'Type your emergency… (connect once to enable the AI)'}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-subtext focus:border-medical/50"
            />
            <button
              onClick={handleMic}
              aria-label={speech.listening ? 'Stop voice input' : 'Start voice input'}
              aria-pressed={speech.listening}
              className={`p-2.5 rounded-full transition-colors ${speech.listening ? 'bg-emergency text-white' : 'bg-white/8 hover:bg-white/15'}`}
            >
              <Mic size={17} />
            </button>
            <button onClick={() => send()} aria-label="Send message" disabled={generating} className="p-2.5 rounded-full bg-emergency hover:brightness-110 shadow-glow transition disabled:opacity-50">
              <Send size={17} />
            </button>
          </div>
          {speech.error && <p className="text-emergency text-xs px-4 pb-2">{speech.error}</p>}
        </GlassCard>
      </div>
    </div>
  );
}
