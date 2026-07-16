import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Download, Navigation } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const regions = [
  { name: 'Delhi NCR', size: '340MB', downloaded: true },
  { name: 'Mumbai Metro', size: '410MB', downloaded: false },
  { name: 'Bengaluru Urban', size: '295MB', downloaded: false },
];

export default function OfflineMaps() {
  return (
    <div>
      <PageHeader
        eyebrow="Offline Maps"
        title="Navigate without signal"
        subtitle="Download regional maps so routing keeps working when the network doesn't."
      />

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <GlassCard className="h-64 mb-6 relative overflow-hidden flex items-center justify-center" hover={false}>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(79,195,247,0.15), transparent 60%), radial-gradient(circle at 70% 70%, rgba(139,92,246,0.15), transparent 60%)' }} />
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border border-medical/30"
              style={{ width: 60 + i * 60, height: 60 + i * 60 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
          <MapPin className="text-medical relative z-10" size={30} />
        </GlassCard>

        <div className="space-y-3">
          {regions.map((r) => (
            <GlassCard key={r.name} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-subtext font-mono-ui">{r.size}</p>
              </div>
              {r.downloaded ? (
                <span className="text-xs text-success flex items-center gap-1"><Navigation size={13} /> Ready offline</span>
              ) : (
                <Button variant="ghost" icon={Download}>Download</Button>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
