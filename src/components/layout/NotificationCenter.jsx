import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const priorityMeta = {
  info: { color: '#4FC3F7', Icon: Info },
  warning: { color: '#F59E0B', Icon: AlertTriangle },
  success: { color: '#22C55E', Icon: CheckCircle2 },
};

export default function NotificationCenter() {
  const { notifOpen, setNotifOpen, notifications, dismissNotification, markAllRead } = useApp();

  return (
    <AnimatePresence>
      {notifOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setNotifOpen(false)}
          />
          <motion.aside
            className="fixed top-0 right-0 z-[75] h-full w-full sm:w-[380px] glass-strong p-5 flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            role="dialog" aria-label="Notifications"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg">Notifications</h2>
              <div className="flex items-center gap-3">
                <button onClick={markAllRead} className="text-xs text-medical hover:underline">Mark all read</button>
                <button onClick={() => setNotifOpen(false)} aria-label="Close" className="p-2 rounded-full hover:bg-white/10">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              <AnimatePresence>
                {notifications.length === 0 && (
                  <p className="text-subtext text-sm text-center mt-10">You're all caught up.</p>
                )}
                {notifications.map((n) => {
                  const meta = priorityMeta[n.priority] || priorityMeta.info;
                  return (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      className="glass rounded-xl2 p-4 relative"
                    >
                      {n.unread && <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emergency" />}
                      <div className="flex items-start gap-3">
                        <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${meta.color}22`, color: meta.color }}>
                          <meta.Icon size={16} />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-subtext mt-0.5">{n.body}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] text-subtext font-mono-ui">{n.time}</span>
                            <button onClick={() => dismissNotification(n.id)} className="text-[11px] text-subtext hover:text-white">Dismiss</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
