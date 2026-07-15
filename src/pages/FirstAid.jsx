import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Modal from '../components/ui/Modal';
import { firstAidTopics } from '../constants/data';

const severityLabel = { low: 'Low urgency', medium: 'Moderate urgency', high: 'High urgency' };

export default function FirstAid() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <PageHeader
        eyebrow="First Aid Library"
        title="Step-by-step guidance, fully offline"
        subtitle="Tap a topic for on-device instructions — no internet connection required."
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {firstAidTopics.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="p-5 cursor-pointer relative overflow-hidden" onClick={() => setActive(t)} glow="blue">
              <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-30" style={{ background: t.color }} />
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ background: `${t.color}22`, color: t.color }}>
                <t.icon size={20} />
              </div>
              <p className="font-medium">{t.title}</p>
              <p className="text-xs mt-1" style={{ color: t.color }}>{severityLabel[t.severity]}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title} variant={active?.severity === 'high' ? 'alert' : 'info'}>
        <p>
          Immediate guidance for {active?.title.toLowerCase()} is generated on-device based on symptom severity.
          Keep the person calm, remove immediate hazards, and monitor breathing and responsiveness.
          If symptoms worsen or the person becomes unresponsive, use the Emergency SOS button immediately.
        </p>
      </Modal>
    </div>
  );
}
