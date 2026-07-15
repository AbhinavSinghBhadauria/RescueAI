import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mic, Camera, Send, Cpu, Zap, WifiOff, BatteryCharging, BatteryFull,
  Cloud, MapPin, Users, HardDrive, Activity, LocateFixed,
} from 'lucide-react';
import AIOrb from '../components/ui/AIOrb';
import GlassCard from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { quickActions } from '../constants/data';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeather } from '../hooks/useWeather';
import { useBattery } from '../hooks/useBattery';
import { useStorageEstimate } from '../hooks/useStorageEstimate';
import { useModels } from '../context/ModelContext';
import { api } from '../api/client';

function VoiceWave({ active }) {
  return (
    <div className="flex items-center gap-0.5 h-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-0.5 bg-medical rounded-full"
          animate={active ? { height: [4, 16, 6, 20, 4] } : { height: 4 }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [listening, setListening] = useState(false);
  const geo = useGeolocation();
  const weather = useWeather(geo.lat, geo.lng);
  const battery = useBattery();
  const storage = useStorageEstimate();
  const { chatModel, visionModel } = useModels();

  const [contacts, setContacts] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.getContacts().then(setContacts).catch(() => {});
    api.getHistory().then(setHistory).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-10 text-center">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs uppercase tracking-[0.25em] text-medical font-mono-ui mb-4"
        >
          On-device · Private · Offline-first
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
        >
          Your Offline AI
          <br />
          <span className="text-gradient">Emergency Companion</span>
        </motion.h1>

        <div className="flex justify-center my-8">
          <AIOrb size={200} listening={listening} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="max-w-2xl mx-auto glass-strong rounded-full pl-6 pr-2.5 py-2.5 flex items-center gap-3 gradient-border"
        >
          <input
            type="text"
            placeholder="Describe your emergency…"
            className="flex-1 bg-transparent outline-none placeholder:text-subtext text-sm md:text-base"
          />
          <VoiceWave active={listening} />
          <button
            onClick={() => setListening((l) => !l)}
            aria-label="Voice input"
            className={`p-2.5 rounded-full transition-colors ${listening ? 'bg-emergency text-white' : 'bg-white/8 hover:bg-white/15'}`}
          >
            <Mic size={17} />
          </button>
          <button aria-label="Camera input" className="p-2.5 rounded-full bg-white/8 hover:bg-white/15 transition-colors">
            <Camera size={17} />
          </button>
          <Link to="/assistant" aria-label="Send" className="p-2.5 rounded-full bg-emergency hover:brightness-110 transition shadow-glow">
            <Send size={17} />
          </Link>
        </motion.div>
      </section>

      {/* Quick actions */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-10">
        <h2 className="font-display text-xl mb-4">Emergency Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.04, rotateX: 3, rotateY: -3 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Link to={a.to}>
                <GlassCard className="p-5 h-32 flex flex-col justify-between cursor-pointer group relative overflow-hidden" glow="blue">
                  <span
                    className="absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-70"
                    style={{ background: a.color }}
                  />
                  <span className="text-3xl group-hover:scale-110 transition-transform">{a.emoji}</span>
                  <span className="font-medium text-sm">{a.label}</span>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Status */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-10">
        <GlassCard className="p-6" hover={false}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${chatModel.status === 'ready' ? 'bg-success/15 text-success' : 'bg-white/8 text-subtext'}`}>
                <Cpu size={22} />
              </div>
              <div>
                <p className="font-display text-lg">
                  {chatModel.status === 'ready' ? 'RescueLLM is loaded & running locally' : 'RescueLLM not loaded yet'}
                </p>
                <p className="text-subtext text-sm flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1"><WifiOff size={13} /> Offline once loaded</span>
                  <span className="flex items-center gap-1"><Zap size={13} /> WebAssembly / WebGPU</span>
                  {battery.status === 'success' && (
                    <span className="flex items-center gap-1">
                      {battery.charging ? <BatteryCharging size={13} /> : <BatteryFull size={13} />} {battery.level}% battery
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <ProgressRing
                value={chatModel.status === 'ready' ? 100 : chatModel.progress}
                color={chatModel.status === 'ready' ? '#22C55E' : '#4FC3F7'}
                label="Chat model"
                size={72}
                stroke={7}
              />
              <ProgressRing
                value={visionModel.status === 'ready' ? 100 : visionModel.progress}
                color={visionModel.status === 'ready' ? '#22C55E' : '#8B5CF6'}
                label="Vision model"
                size={72}
                stroke={7}
              />
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Dashboard widgets */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <GlassCard className="p-5 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-subtext text-xs flex items-center gap-1.5"><Cloud size={14} /> Weather</span>
          </div>
          {weather.status === 'success' ? (
            <>
              <p className="font-display text-3xl">{weather.temp}°C</p>
              <p className="text-subtext text-sm mt-1">{weather.condition}</p>
            </>
          ) : weather.status === 'loading' || geo.status === 'loading' ? (
            <p className="text-subtext text-sm">Fetching real weather…</p>
          ) : (
            <p className="text-subtext text-sm">Allow location to see live weather</p>
          )}
          <p className="text-subtext text-xs mt-2 flex items-center gap-1">
            <MapPin size={12} /> {geo.place || (geo.status === 'loading' ? 'Locating…' : geo.status === 'denied' ? 'Location permission denied' : '—')}
          </p>
        </GlassCard>

        <GlassCard className="p-5 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-subtext text-xs flex items-center gap-1.5"><Users size={14} /> Emergency Contacts</span>
          </div>
          <div className="space-y-2">
            {contacts.slice(0, 2).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <span>{c.name}</span>
                <span className="text-subtext text-xs">{c.relation}</span>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-subtext text-sm">Loading from your local server…</p>}
          </div>
          <Link to="/profile" className="text-xs text-medical mt-3 inline-block hover:underline">View all</Link>
        </GlassCard>

        <GlassCard className="p-5 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-subtext text-xs flex items-center gap-1.5"><HardDrive size={14} /> Browser Storage</span>
          </div>
          {storage.status === 'success' ? (
            <>
              <p className="font-display text-2xl">{storage.usedGB}<span className="text-subtext text-base">/{storage.quotaGB} GB</span></p>
              <div className="h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
                <motion.div
                  className="h-full bg-medical rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (storage.usedGB / storage.quotaGB) * 100)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </>
          ) : (
            <p className="text-subtext text-sm">Storage API unsupported in this browser</p>
          )}
        </GlassCard>

        <GlassCard className="p-5 md:col-span-2">
          <span className="text-subtext text-xs flex items-center gap-1.5 mb-3"><Cpu size={14} /> On-device AI Models</span>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${chatModel.status === 'ready' ? 'bg-success' : 'bg-subtext'}`} />
                Qwen1.5-0.5B-Chat (text)
              </span>
              <span className="text-subtext font-mono-ui text-xs capitalize">{chatModel.status}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${visionModel.status === 'ready' ? 'bg-success' : 'bg-subtext'}`} />
                ViT-base (vision)
              </span>
              <span className="text-subtext font-mono-ui text-xs capitalize">{visionModel.status}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 col-span-1">
          <span className="text-subtext text-xs flex items-center gap-1.5 mb-3"><BatteryCharging size={14} /> Battery Status</span>
          {battery.status === 'success' ? (
            <div className="flex items-center gap-4">
              <ProgressRing value={battery.level} color="#F59E0B" size={64} stroke={6} />
              <p className="text-sm text-subtext">{battery.charging ? 'Charging' : 'On battery'}<br />live device reading</p>
            </div>
          ) : (
            <p className="text-subtext text-sm">Battery API not supported in this browser</p>
          )}
        </GlassCard>

        <GlassCard className="p-5 md:col-span-2">
          <span className="text-subtext text-xs flex items-center gap-1.5 mb-3"><Activity size={14} /> Recent Activity</span>
          <div className="space-y-2.5">
            {history.slice(0, 4).map((h) => (
              <div key={h.id} className="flex items-center justify-between text-sm">
                <span>{h.title}</span>
                <span className="text-subtext text-xs font-mono-ui">{new Date(h.date).toLocaleString()}</span>
              </div>
            ))}
            {history.length === 0 && <p className="text-subtext text-sm">No activity yet — try the AI Assistant or Scan Injury.</p>}
          </div>
        </GlassCard>

        <GlassCard className="p-5 col-span-1">
          <span className="text-subtext text-xs flex items-center gap-1.5 mb-3"><LocateFixed size={14} /> GPS Accuracy</span>
          {geo.status === 'success' ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-subtext">Lat</span><span className="font-mono-ui">{geo.lat.toFixed(4)}</span></div>
              <div className="flex justify-between"><span className="text-subtext">Lng</span><span className="font-mono-ui">{geo.lng.toFixed(4)}</span></div>
              <div className="flex justify-between"><span className="text-subtext">Accuracy</span><span>±{Math.round(geo.accuracy)}m</span></div>
            </div>
          ) : (
            <p className="text-subtext text-sm capitalize">{geo.status}</p>
          )}
        </GlassCard>
      </section>
    </div>
  );
}
