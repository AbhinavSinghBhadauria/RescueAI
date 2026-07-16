import React from 'react';
import { ShieldCheck } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';

export default function Privacy() {
  return (
    <div>
      <PageHeader eyebrow="Privacy" title="Your data stays on your device" subtitle="RescueAI is designed offline-first, by default." />
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <GlassCard className="p-6" hover={false}>
          <ShieldCheck className="text-success mb-3" size={24} />
          <p className="text-subtext text-sm leading-relaxed">
            All AI inference — chat, injury scanning, and voice — runs locally on your hardware.
            Photos and conversations are never uploaded. Diagnostics sharing is opt-in and disabled by default.
            You can delete all local data at any time from Settings.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
