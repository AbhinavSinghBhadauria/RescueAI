import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'db.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

const defaultData = JSON.parse(await (await import('fs/promises')).readFile(SEED_FILE, 'utf-8'));
const db = await JSONFilePreset(DB_FILE, defaultData);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ---------- Profile ----------
app.get('/api/profile', async (req, res) => {
  res.json(db.data.profile);
});

app.put('/api/profile', async (req, res) => {
  db.data.profile = { ...db.data.profile, ...req.body };
  await db.write();
  res.json(db.data.profile);
});

// ---------- Emergency contacts ----------
app.get('/api/contacts', async (req, res) => {
  res.json(db.data.contacts);
});

app.post('/api/contacts', async (req, res) => {
  const contact = { id: nanoid(6), ...req.body };
  db.data.contacts.push(contact);
  await db.write();
  res.status(201).json(contact);
});

app.delete('/api/contacts/:id', async (req, res) => {
  db.data.contacts = db.data.contacts.filter((c) => c.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

// ---------- Medicine cabinet ----------
app.get('/api/medicine', async (req, res) => {
  res.json(db.data.medicine);
});

app.post('/api/medicine', async (req, res) => {
  const item = { id: nanoid(6), ...req.body };
  db.data.medicine.push(item);
  await db.write();
  res.status(201).json(item);
});

app.put('/api/medicine/:id', async (req, res) => {
  const idx = db.data.medicine.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.data.medicine[idx] = { ...db.data.medicine[idx], ...req.body };
  await db.write();
  res.json(db.data.medicine[idx]);
});

app.delete('/api/medicine/:id', async (req, res) => {
  db.data.medicine = db.data.medicine.filter((m) => m.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

// ---------- History ----------
app.get('/api/history', async (req, res) => {
  const sorted = [...db.data.history].sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sorted);
});

app.post('/api/history', async (req, res) => {
  const entry = { id: nanoid(8), date: new Date().toISOString(), ...req.body };
  db.data.history.unshift(entry);
  await db.write();
  res.status(201).json(entry);
});

// ---------- Notifications ----------
app.get('/api/notifications', async (req, res) => {
  res.json(db.data.notifications);
});

app.post('/api/notifications', async (req, res) => {
  const n = { id: nanoid(6), unread: true, time: 'now', ...req.body };
  db.data.notifications.unshift(n);
  await db.write();
  res.status(201).json(n);
});

app.patch('/api/notifications/:id', async (req, res) => {
  const idx = db.data.notifications.findIndex((n) => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.data.notifications[idx] = { ...db.data.notifications[idx], ...req.body };
  await db.write();
  res.json(db.data.notifications[idx]);
});

app.patch('/api/notifications', async (req, res) => {
  // mark all read
  db.data.notifications = db.data.notifications.map((n) => ({ ...n, unread: false }));
  await db.write();
  res.json(db.data.notifications);
});

app.delete('/api/notifications/:id', async (req, res) => {
  db.data.notifications = db.data.notifications.filter((n) => n.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

// ---------- SOS event log (also writes a history + notification entry) ----------
app.post('/api/sos', async (req, res) => {
  const { label, lat, lng } = req.body;
  const entry = {
    id: nanoid(8),
    type: 'SOS',
    title: `${label}${lat ? ` — location shared (${lat.toFixed(3)}, ${lng.toFixed(3)})` : ''}`,
    date: new Date().toISOString(),
  };
  db.data.history.unshift(entry);
  const notif = {
    id: nanoid(6),
    title: 'Emergency alert sent',
    body: `${label} triggered and logged.`,
    priority: 'warning',
    unread: true,
    time: 'now',
  };
  db.data.notifications.unshift(notif);
  await db.write();
  res.status(201).json({ entry, notif });
});

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'rescueai-api' }));

app.listen(PORT, () => {
  console.log(`RescueAI API listening on http://localhost:${PORT}`);
});
