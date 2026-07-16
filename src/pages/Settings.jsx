import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Languages, Accessibility, Shield, Download, Mic, Users, Lock, Info, FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-medical' : 'bg-white/15'}`}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </button>
  );
}

const rows = [
  { key: 'dark', label: 'Dark theme', icon: Moon, note: 'Always on for RescueAI', locked: true },
  { key: 'reduced', label: 'Reduced motion', icon: Accessibility, note: 'Minimises animation across the app' },
  { key: 'largeText', label: 'Large text', icon: FileText, note: 'Increase base font size' },
  { key: 'voice', label: 'Voice responses', icon: Mic, note: 'Speak AI responses aloud' },
  { key: 'privacy', label: 'Share anonymised diagnostics', icon: Shield, note: 'Off by default — fully optional' },
];

export default function Settings() {
  const [state, setState] = useState({ dark: true, reduced: false, largeText: false, voice: true, privacy: false });

  return (
    <div>
      <PageHeader eyebrow="Settings" title="Make RescueAI yours" subtitle="Every preference is stored locally on this device." />

      <div className="max-w-2xl mx-auto px-4 md:px-6 space-y-3">
        {rows.map((r) => (
          <GlassCard key={r.key} className="p-4 flex items-center justify-between" hover={false}>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"><r.icon size={16} /></span>
              <div>
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-subtext">{r.note}</p>
              </div>
            </div>
            <Toggle checked={state[r.key]} onChange={(v) => !r.locked && setState((s) => ({ ...s, [r.key]: v }))} />
          </GlassCard>
        ))}

        <GlassCard className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"><Languages size={16} /></span>
            <p className="text-sm font-medium">Language</p>
          </div>
          <span className="text-sm text-subtext">English</span>
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"><Download size={16} /></span>
            <p className="text-sm font-medium">Manage AI models</p>
          </div>
          <span className="text-xs text-medical">Open →</span>
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"><Users size={16} /></span>
            <p className="text-sm font-medium">Emergency contacts</p>
          </div>
          <span className="text-xs text-medical">Manage →</span>
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"><Lock size={16} /></span>
            <p className="text-sm font-medium">Permissions</p>
          </div>
          <span className="text-xs text-medical">Review →</span>
        </GlassCard>
      </div>
    </div>
  );
}
