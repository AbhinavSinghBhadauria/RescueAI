import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [apiOnline, setApiOnline] = useState(null); // null = unknown, true/false once checked

  useEffect(() => {
    api.health()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
    api.getNotifications().then(setNotifications).catch(() => {});
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    api.dismissNotification(id).catch(() => {});
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    api.markAllNotificationsRead().catch(() => {});
  }, []);

  const pushNotification = useCallback((n) => {
    setNotifications((prev) => [{ id: `local-${Date.now()}`, unread: true, time: 'now', ...n }, ...prev]);
    api.addNotification(n).catch(() => {});
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const value = {
    sidebarOpen, setSidebarOpen,
    notifOpen, setNotifOpen,
    notifications, dismissNotification, markAllRead, pushNotification, unreadCount,
    apiOnline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
