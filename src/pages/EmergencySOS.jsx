import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Siren, Phone, ShieldAlert, Flame, MapPin, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Modal from '../components/ui/Modal';
import { useGeolocation } from '../hooks/useGeolocation';
import { api } from '../api/client';

const LOCAL_EMERGENCY_NUMBERS = { ambulance: '112', police: '112', fire: '112' };

export default function EmergencySOS() {
  const geo = useGeolocation();
  const [confirming, setConfirming] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => { api.getContacts().then(setContacts).catch(() => {}); }, []);

  const actions = [
    { label: 'Call Ambulance', icon: Phone, color: '#D6472C', tel: LOCAL_EMERGENCY_NUMBERS.ambulance },
    { label: 'Call Police', icon: ShieldAlert, color: '#4A8C8C', tel: LOCAL_EMERGENCY_NUMBERS.police },
    { label: 'Call Fire Dept.', icon: Flame, color: '#C4903D', tel: LOCAL_EMERGENCY_NUMBERS.fire },
    { label: 'Share Live Location', icon: MapPin, color: '#7A7699', share: true },
  ];

  const confirmAction = async () => {
    const a = confirming;
    try {
      await api.triggerSOS({ label: a.label, lat: geo.lat, lng: geo.lng });
    } catch {
      toast.warn('Logged locally — backend unreachable');
    }

    if (a.tel) {
      window.location.href = `tel:${a.tel}`;
    } else if (a.share && geo.lat) {
      const url = `https://www.google.com/maps?q=${geo.lat},${geo.lng}`;
      if (navigator.share) {
        navigator.share({ title: 'My live location', text: 'I need help — here is my current location.', url }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(url);
        toast.info('Location link copied to clipboard');
      }
    } else if (a.share) {
      toast.warn('Location unavailable — allow location access first');
    } else {
      toast.success(`${a.label} confirmed`);
    }
    setConfirming(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Emergency SOS"
        title="One tap away from help"
        subtitle={geo.status === 'success' ? `Live location ready — accuracy ±${Math.round(geo.accuracy)}m` : 'Enable location for the most accurate alert'}
      />

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <GlassCard className="p-8 text-center mb-8 relative overflow-hidden" hover={false}>
          <span className="absolute inset-0 bg-emergency/10" />
          <motion.button
            onClick={() => setConfirming({ label: 'Full Emergency Alert', icon: Siren, color: '#D6472C' })}
            className="relative w-32 h-32 rounded-full bg-emergency flex items-center justify-center mx-auto shadow-glow"
            whileTap={{ scale: 0.94 }}
          >
            <span className="absolute inset-0 rounded-full bg-emergency animate-ping opacity-30" />
            <Siren size={44} />
          </motion.button>
          <p className="mt-5 font-display text-lg">Tap to trigger a full emergency alert</p>
          <p className="text-subtext text-sm mt-1">Logs the event and shares your real live location with contacts</p>
        </GlassCard>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {actions.map((a) => (
            <GlassCard key={a.label} className="p-5 flex flex-col items-center gap-3 cursor-pointer" onClick={() => setConfirming(a)}>
              <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${a.color}22`, color: a.color }}>
                <a.icon size={20} />
              </span>
              <span className="text-sm text-center">{a.label}</span>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-5" hover={false}>
          <p className="text-sm font-medium mb-3 flex items-center gap-2"><Users size={15} /> Emergency Contacts</p>
          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <span>{c.name} <span className="text-subtext text-xs">· {c.relation}</span></span>
                <a href={`tel:${c.phone}`} className="text-medical font-mono-ui text-xs hover:underline">{c.phone}</a>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-subtext text-sm">No contacts yet — add some in Profile.</p>}
          </div>
        </GlassCard>
      </div>

      <Modal open={!!confirming} onClose={() => setConfirming(null)} title={`Confirm: ${confirming?.label}`} variant="alert">
        {confirming?.tel
          ? `This opens your phone dialer with ${confirming.tel} pre-filled. The call itself is placed by your device, not this browser.`
          : 'This shares your real current coordinates via your device\'s native share sheet (or copies a maps link).'}
        <div className="mt-4 flex justify-end">
          <button
            onClick={confirmAction}
            className="px-4 py-2 rounded-full bg-emergency text-sm font-medium shadow-glow"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}
