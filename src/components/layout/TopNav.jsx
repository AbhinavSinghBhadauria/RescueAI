import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Bell, Search, Settings, WifiOff, Wifi } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { motion } from 'framer-motion';

export default function TopNav() {
  const { setSidebarOpen, setNotifOpen, unreadCount } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const online = useNetworkStatus();

  return (
    <header className="sticky top-0 z-40 px-4 md:px-6 pt-4">
      <div className="glass rounded-xl2 h-16 flex items-center justify-between px-4 md:px-5">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emergency via-purple to-medical shadow-glow">
              <span className="absolute inset-0 rounded-full animate-pulseGlow bg-emergency/40" />
              <span className="relative font-display font-bold text-sm">R</span>
            </span>
            <span className="font-display font-semibold text-lg tracking-tight hidden sm:inline">RescueAI</span>
          </Link>

          <span className={`hidden md:flex items-center gap-1.5 text-xs font-mono-ui rounded-full px-3 py-1 ml-2 border ${
            online ? 'text-warning bg-warning/10 border-warning/25' : 'text-success bg-success/10 border-success/25'
          }`}>
            {online ? <Wifi size={12} /> : <WifiOff size={12} />}
            {online ? 'Online (models cached offline)' : 'Offline Ready'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="relative hidden sm:block">
            <motion.div
              initial={false}
              animate={{ width: searchOpen ? 220 : 0, opacity: searchOpen ? 1 : 0 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search RescueAI…"
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm outline-none placeholder:text-subtext"
              />
            </motion.div>
          </div>
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Search size={19} />
          </button>

          <button
            aria-label="Notifications"
            onClick={() => setNotifOpen(true)}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-emergency text-white font-semibold">
                {unreadCount}
              </span>
            )}
          </button>

          <NavLink to="/settings" aria-label="Settings" className="p-2 rounded-full hover:bg-white/10 transition-colors hidden sm:inline-flex">
            <Settings size={19} />
          </NavLink>

          <Link to="/profile" aria-label="Profile" className="ml-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-medical to-purple flex items-center justify-center font-display text-sm font-semibold">
              AM
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
