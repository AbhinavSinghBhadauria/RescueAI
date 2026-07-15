import React from 'react';
import { ExternalLink, Shield, FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import AIOrb from '../components/ui/AIOrb';

export default function About() {
  return (
    <div>
      <PageHeader eyebrow="About" title="RescueAI" subtitle="Emergency intelligence, running entirely on your device." />
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <GlassCard className="p-8 text-center mb-6" hover={false}>
          <div className="flex justify-center mb-4"><AIOrb size={120} /></div>
          <p className="text-subtext text-sm leading-relaxed">
            RescueAI keeps emergency guidance available even without a network connection.
            All inference happens locally, so your data — photos, symptoms, conversations — never leaves this device.
          </p>
        </GlassCard>
        <div className="grid grid-cols-3 gap-3 text-center text-xs text-subtext">
          <GlassCard className="p-4"><FileText size={16} className="mx-auto mb-2" /> v1.0.0</GlassCard>
          <GlassCard className="p-4"><Shield size={16} className="mx-auto mb-2" /> Build 2026.07</GlassCard>
          <GlassCard className="p-4"><ExternalLink size={16} className="mx-auto mb-2" /> Open Source</GlassCard>
        </div>
      </div>
    </div>
  );
}
