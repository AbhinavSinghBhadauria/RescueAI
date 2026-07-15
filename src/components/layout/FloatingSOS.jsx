import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Siren, Phone, ShieldAlert, Flame, MapPin, Users, MessageSquareWarning, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGeolocation } from '../../hooks/useGeolocation';
import { api } from '../../api/client';

const actions = [
  { label: 'Call Ambulance', icon: Phone, color: '#FF4D4D', tel: '112' },
  { label: 'Police', icon: ShieldAlert, color: '#4FC3F7', tel: '112' },
  { label: 'Fire', icon: Flame, color: '#F59E0B', tel: '112' },
  { label: 'Share Location', icon: MapPin, color: '#8B5CF6', share: true },
  { label: 'Emergency Contacts', icon: Users, color: '#22C55E', link: '/sos' },
  { label: 'SOS Message', icon: MessageSquareWarning, color: '#FF4D4D', link: '/sos' },
];

export default function FloatingSOS() {
  const [open, setOpen] = useState(false);
  const geo = useGeolocation();

  const handleAction = async (a) => {
    setOpen(false);
    api.triggerSOS({ label: a.label, lat: geo.lat, lng: geo.lng }).catch(() => {});

    if (a.tel) {
      window.location.href = `tel:${a.tel}`;
    } else if (a.share) {
      if (geo.lat) {
        const url = `https://www.google.com/maps?q=${geo.lat},${geo.lng}`;
        if (navigator.share) navigator.share({ title: 'My live location', url }).catch(() => {});
        else { navigator.clipboard?.writeText(url); toast.info('Location link copied'); }
      } else {
        toast.warn('Location unavailable — allow location access first');
      }
    } else if (a.link) {
      window.location.href = a.link;
    }
  };

  return (
    <div className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div className="flex flex-col items-end gap-2.5 mb-1" initial="hidden" animate="show" exit="hidden">
            {actions.map((a, i) => (
              <motion.button
                key={a.label}
                onClick={() => handleAction(a)}
                initial={{ opacity: 0, x: 30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.8 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.05 }}
                className="glass-strong flex items-center gap-2.5 pl-4 pr-3 py-2.5 rounded-full text-sm shadow-glass"
              >
                <span>{a.label}</span>
                <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${a.color}25`, color: a.color }}>
                  <a.icon size={16} />
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label="Emergency SOS actions"
        className="relative w-16 h-16 rounded-full bg-emergency flex items-center justify-center shadow-glow"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="absolute inset-0 rounded-full bg-emergency animate-ping opacity-40" />
        <span className="absolute inset-0 rounded-full bg-emergency animate-pulseGlow" />
        <span className="relative z-10">
          {open ? <X size={26} /> : <Siren size={26} />}
        </span>
      </motion.button>
    </div>
  );
}
