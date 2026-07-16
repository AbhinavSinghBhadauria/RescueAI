import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Cake, Pill, AlertTriangle, Cpu, HardDrive, Users, Plus, Trash2, Check, User, WifiOff } from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { api } from '../api/client';

function EditableField({ label, icon: Icon, value, placeholder, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  return (
    <GlassCard className="p-4" hover={false}>
      <p className="text-xs text-subtext flex items-center gap-1.5 mb-1"><Icon size={13} /> {label}</p>
      {editing ? (
        <div className="flex items-center gap-2">
          <input style={{ color: '#EDEAE3' }}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm outline-none placeholder:text-subtext"
            autoFocus
          />
          <button onClick={() => { onSave(draft); setEditing(false); }} className="text-success"><Check size={16} /></button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="font-medium text-left w-full hover:text-medical transition-colors">
          {value || <span className="text-subtext italic">{placeholder || 'Tap to add'}</span>}
        </button>
      )}
    </GlassCard>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [backendError, setBackendError] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => setBackendError(true));
    api.getContacts().then(setContacts).catch(() => setBackendError(true));
  }, []);

  const save = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
    api.updateProfile({ [field]: value }).then(() => toast.success('Saved')).catch(() => toast.error('Could not save — is the backend running?'));
  };

  const addContact = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    try {
      const c = await api.addContact({ name, phone, relation: relation || 'Contact' });
      setContacts((prev) => [...prev, c]);
      setName(''); setPhone(''); setRelation('');
      toast.success('Contact added');
    } catch {
      toast.error('Could not reach the local backend');
    }
  };

  const removeContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    api.deleteContact(id).catch(() => {});
  };

  if (backendError) {
    return (
      <div className="max-w-md mx-auto px-4 md:px-6 pt-16 text-center">
        <WifiOff className="mx-auto text-emergency mb-4" size={32} />
        <p className="font-display text-lg mb-2">Can't reach the local backend</p>
        <p className="text-subtext text-sm">
          Profile, contacts, and history are stored on the local RescueAI server. Run{' '}
          <code className="bg-white/10 px-1.5 py-0.5 rounded">npm run server</code> (or{' '}
          <code className="bg-white/10 px-1.5 py-0.5 rounded">npm run dev:all</code>) in the project folder and reload this page.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const initials = profile.name?.trim() ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <div>
      <PageHeader eyebrow="Profile" title="Your medical profile" subtitle="Stored on your local RescueAI server — tap any field to edit. This starts empty; it's your real data, not a demo." />
      <div className="max-w-3xl mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-5 mb-8">
        <GlassCard className="p-6 flex flex-col items-center text-center md:col-span-1" hover={false}>
          <div className="w-20 h-20 rounded-full bg-white/8 border border-emergency/25 flex items-center justify-center font-display text-2xl mb-3">
            {initials}
          </div>
          <button
            onClick={() => {
              const v = prompt('Your name', profile.name || '');
              if (v !== null) save('name', v);
            }}
            className="font-display text-lg hover:text-medical transition-colors"
          >
            {profile.name || <span className="text-subtext italic text-base">Tap to set your name</span>}
          </button>
          <p className="text-subtext text-sm mt-1">{profile.language}</p>
        </GlassCard>

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <EditableField label="Blood Group" icon={Droplet} value={profile.bloodGroup} placeholder="e.g. O+" onSave={(v) => save('bloodGroup', v)} />
          <EditableField label="Age" icon={Cake} value={String(profile.age ?? '')} placeholder="e.g. 27" onSave={(v) => save('age', v)} />
          <div className="col-span-2"><EditableField label="Allergies" icon={AlertTriangle} value={profile.allergies.join(', ')} placeholder="e.g. Peanuts, Penicillin" onSave={(v) => save('allergies', v.split(',').map((s) => s.trim()).filter(Boolean))} /></div>
          <div className="col-span-2"><EditableField label="Conditions" icon={Pill} value={profile.conditions.join(', ')} placeholder="e.g. Asthma" onSave={(v) => save('conditions', v.split(',').map((s) => s.trim()).filter(Boolean))} /></div>
          <GlassCard className="p-4" hover={false}><p className="text-xs text-subtext flex items-center gap-1.5 mb-1"><Cpu size={13} /> AI Model</p><p className="font-medium text-sm">{profile.model}</p></GlassCard>
          <GlassCard className="p-4" hover={false}><p className="text-xs text-subtext flex items-center gap-1.5 mb-1"><HardDrive size={13} /> Storage Used</p><p className="font-medium text-sm">{profile.storageUsed}</p></GlassCard>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <h2 className="font-display text-lg mb-3 flex items-center gap-2"><Users size={18} /> Emergency Contacts</h2>
        <form onSubmit={addContact} className="glass rounded-xl2 p-4 mb-4 flex flex-wrap gap-3">
          <input style={{ color: '#EDEAE3' }} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none placeholder:text-subtext" />
          <input style={{ color: '#EDEAE3' }} value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Relation" className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none placeholder:text-subtext" />
          <input style={{ color: '#EDEAE3' }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none placeholder:text-subtext" />
          <button type="submit" className="p-2.5 rounded-full bg-medical text-[#04101a]"><Plus size={16} /></button>
        </form>
        <div className="space-y-2.5">
          {contacts.length === 0 && (
            <p className="text-subtext text-sm text-center py-6 flex flex-col items-center gap-2">
              <User size={20} className="text-subtext" />
              No emergency contacts yet — add the first one above.
            </p>
          )}
          <AnimatePresence>
            {contacts.map((c) => (
              <motion.div key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                <GlassCard className="p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{c.name} <span className="text-subtext text-xs">· {c.relation}</span></p>
                    <a href={`tel:${c.phone}`} className="text-xs text-medical font-mono-ui hover:underline">{c.phone}</a>
                  </div>
                  <button onClick={() => removeContact(c.id)} className="text-subtext hover:text-emergency p-1"><Trash2 size={15} /></button>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
