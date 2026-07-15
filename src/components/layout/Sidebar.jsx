import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MessageCircle, Bandage, Camera, Pill, HeartPulse,
  Siren, Map, Download, History, Settings, Info, ExternalLink, Shield, LogOut, X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assistant', label: 'AI Assistant', icon: MessageCircle },
  { to: '/first-aid', label: 'First Aid', icon: Bandage },
  { to: '/scan-injury', label: 'Scan Injury', icon: Camera },
  { to: '/medicine', label: 'Medicine', icon: Pill },
  { to: '/cpr', label: 'CPR Guide', icon: HeartPulse },
  { to: '/sos', label: 'Emergency SOS', icon: Siren },
  { to: '/offline-maps', label: 'Offline Maps', icon: Map },
  { to: '/downloads', label: 'Downloads', icon: Download },
  { to: '/history', label: 'History', icon: History },
];

const bottomItems = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/about', label: 'About', icon: Info },
  { to: 'https://github.com', label: 'GitHub', icon: ExternalLink, external: true },
  { to: '/privacy', label: 'Privacy', icon: Shield },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            className="fixed top-0 left-0 z-[75] h-full w-[280px] glass-strong p-5 flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            role="dialog" aria-label="Main navigation"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emergency via-purple to-medical">
                  <span className="font-display font-bold text-sm">R</span>
                </span>
                <span className="font-display font-semibold">RescueAI</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="p-2 rounded-full hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1 pr-1">
              {items.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                        isActive ? 'bg-white/10 text-white' : 'text-subtext hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <item.icon size={18} className="group-hover:scale-110 group-hover:text-medical transition-transform" />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
              {bottomItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  target={item.external ? '_blank' : undefined}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-subtext hover:bg-white/5 hover:text-white transition-all text-sm"
                >
                  <item.icon size={17} />
                  {item.label}
                </NavLink>
              ))}
              <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-emergency hover:bg-emergency/10 transition-all text-sm">
                <LogOut size={17} /> Logout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
