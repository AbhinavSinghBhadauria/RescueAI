import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { api } from '../api/client';

const stockColors = { 'In stock': '#4C9A6A', 'Low stock': '#C4903D', 'Out of stock': '#D6472C' };
const nextStock = { 'In stock': 'Low stock', 'Low stock': 'Out of stock', 'Out of stock': 'In stock' };

export default function Medicine() {
  const [items, setItems] = useState(null);
  const [name, setName] = useState('');
  const [use, setUse] = useState('');

  const load = () => api.getMedicine().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const item = await api.addMedicine({ name, use: use || 'General use', stock: 'In stock', color: '#4C9A6A' });
      setItems((prev) => [...prev, item]);
      setName(''); setUse('');
      toast.success('Added to your medicine cabinet');
    } catch {
      toast.error('Could not reach the local backend');
    }
  };

  const cycleStock = async (item) => {
    const stock = nextStock[item.stock];
    const color = stockColors[stock];
    setItems((prev) => prev.map((m) => (m.id === item.id ? { ...m, stock, color } : m)));
    api.updateMedicine(item.id, { stock, color }).catch(() => {});
  };

  const remove = async (id) => {
    setItems((prev) => prev.filter((m) => m.id !== id));
    api.deleteMedicine(id).catch(() => {});
  };

  return (
    <div>
      <PageHeader
        eyebrow="Medicine"
        title="Your medicine cabinet"
        subtitle="Synced with your local RescueAI server — tap a stock badge to update it."
      />

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <form onSubmit={addItem} className="glass rounded-xl2 p-4 mb-6 flex flex-wrap gap-3">
          <input style={{ color: '#EDEAE3' }}
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Medicine name"
            className="flex-1 min-w-[160px] bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none placeholder:text-subtext"
          />
          <input style={{ color: '#EDEAE3' }}
            value={use} onChange={(e) => setUse(e.target.value)}
            placeholder="Used for…"
            className="flex-1 min-w-[160px] bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none placeholder:text-subtext"
          />
          <Button type="submit" icon={Plus}>Add</Button>
        </form>

        <div className="space-y-3">
          {items === null && [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}

          <AnimatePresence>
            {items?.map((m) => (
              <motion.div key={m.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                <GlassCard className="p-4 flex items-center justify-between" glow="blue">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-medical/15 text-medical flex items-center justify-center">
                      <Pill size={18} />
                    </span>
                    <div>
                      <p className="font-medium text-sm">{m.name}</p>
                      <p className="text-subtext text-xs">{m.use}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cycleStock(m)}
                      className="text-xs font-medium px-3 py-1 rounded-full transition-transform hover:scale-105"
                      style={{ background: `${m.color}22`, color: m.color }}
                    >
                      {m.stock}
                    </button>
                    <button onClick={() => remove(m.id)} aria-label={`Remove ${m.name}`} className="text-subtext hover:text-emergency p-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>

          {items?.length === 0 && <p className="text-subtext text-sm text-center py-8">No items yet — add your first medicine above.</p>}
        </div>
      </div>
    </div>
  );
}
