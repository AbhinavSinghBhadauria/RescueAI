import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Play, Pause } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { cprSteps } from '../constants/data';

export default function CPRGuide() {
  const [beating, setBeating] = useState(true);

  return (
    <div>
      <PageHeader
        eyebrow="CPR Guide"
        title="CPR, step by step"
        subtitle="Follow this rhythm — 100 to 120 compressions per minute — until help arrives."
        right={<Button variant={beating ? 'ghost' : 'primary'} icon={beating ? Pause : Play} onClick={() => setBeating((b) => !b)}>{beating ? 'Pause rhythm' : 'Start rhythm'}</Button>}
      />

      <div className="max-w-4xl mx-auto px-4 md:px-6 grid md:grid-cols-[220px_1fr] gap-8">
        <div className="flex md:flex-col items-center justify-center gap-4">
          <motion.div
            className="w-28 h-28 rounded-full bg-emergency/15 flex items-center justify-center text-emergency"
            animate={beating ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <HeartPulse size={44} />
          </motion.div>
          <p className="font-mono-ui text-sm text-subtext text-center">110 <span className="text-white">compressions/min</span></p>
        </div>

        <div className="relative pl-6 border-l border-white/10 space-y-8">
          {cprSteps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emergency shadow-glow" />
              <GlassCard className="p-4" hover={false}>
                <p className="font-medium mb-1">{i + 1}. {s.title}</p>
                <p className="text-subtext text-sm">{s.detail}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
