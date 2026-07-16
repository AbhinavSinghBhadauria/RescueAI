import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Camera, BookOpen, Siren } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { api } from '../api/client';

const iconMap = { Chat: MessageCircle, Scan: Camera, Guide: BookOpen, SOS: Siren };

export default function History() {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    api.getHistory().then(setHistory).catch(() => setHistory([]));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="History" title="Everything, stored locally" subtitle="Pulled live from your local RescueAI server — nothing goes to the cloud." />
      <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-3">
        {history === null && [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
        {history?.length === 0 && <p className="text-subtext text-sm text-center py-8">No activity yet — try the AI Assistant or Scan Injury.</p>}
        {history?.map((h, i) => {
          const Icon = iconMap[h.type] || MessageCircle;
          return (
            <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-4 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"><Icon size={16} /></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{h.title}</p>
                  <p className="text-xs text-subtext">{h.type}</p>
                </div>
                <span className="text-xs text-subtext font-mono-ui">{new Date(h.date).toLocaleString()}</span>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
