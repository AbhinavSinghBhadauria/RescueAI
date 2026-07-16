const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getProfile: () => request('/profile'),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  getContacts: () => request('/contacts'),
  addContact: (data) => request('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  deleteContact: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),

  getMedicine: () => request('/medicine'),
  addMedicine: (data) => request('/medicine', { method: 'POST', body: JSON.stringify(data) }),
  updateMedicine: (id, data) => request(`/medicine/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMedicine: (id) => request(`/medicine/${id}`, { method: 'DELETE' }),

  getHistory: () => request('/history'),
  addHistory: (data) => request('/history', { method: 'POST', body: JSON.stringify(data) }),

  getNotifications: () => request('/notifications'),
  addNotification: (data) => request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
  markNotificationRead: (id) => request(`/notifications/${id}`, { method: 'PATCH', body: JSON.stringify({ unread: false }) }),
  markAllNotificationsRead: () => request('/notifications', { method: 'PATCH', body: JSON.stringify({}) }),
  dismissNotification: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),

  triggerSOS: (data) => request('/sos', { method: 'POST', body: JSON.stringify(data) }),

  health: () => request('/health'),
};
