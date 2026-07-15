import {
  Bandage, HeartPulse, Pill, Flame, Wind, Siren,
} from 'lucide-react';

// Static app content (labels, routes, copy). Anything that represents
// live state (weather, location, battery, contacts, history, medicine,
// model status) is fetched at runtime — see src/hooks and src/api.

export const quickActions = [
  { id: 'first-aid', label: 'First Aid', emoji: '🩹', to: '/first-aid', color: '#4FC3F7' },
  { id: 'scan', label: 'Scan Injury', emoji: '📷', to: '/scan-injury', color: '#8B5CF6' },
  { id: 'cpr', label: 'CPR', emoji: '❤️', to: '/cpr', color: '#FF4D4D' },
  { id: 'medicine', label: 'Medicine', emoji: '💊', to: '/medicine', color: '#22C55E' },
  { id: 'snake', label: 'Snake Bite', emoji: '🐍', to: '/first-aid?type=snake', color: '#F59E0B' },
  { id: 'fire', label: 'Fire Safety', emoji: '🔥', to: '/first-aid?type=fire', color: '#FF4D4D' },
  { id: 'disaster', label: 'Disaster', emoji: '🌪', to: '/first-aid?type=disaster', color: '#4FC3F7' },
  { id: 'sos', label: 'Emergency SOS', emoji: '🚨', to: '/sos', color: '#FF4D4D' },
];

export const firstAidTopics = [
  { id: 'cuts', title: 'Cuts & Wounds', icon: Bandage, severity: 'low', color: '#22C55E' },
  { id: 'burns', title: 'Burns', icon: Flame, severity: 'medium', color: '#F59E0B' },
  { id: 'fractures', title: 'Fractures', icon: HeartPulse, severity: 'high', color: '#FF4D4D' },
  { id: 'choking', title: 'Choking', icon: Wind, severity: 'high', color: '#FF4D4D' },
  { id: 'poisoning', title: 'Poisoning', icon: Pill, severity: 'high', color: '#FF4D4D' },
  { id: 'shock', title: 'Shock', icon: Siren, severity: 'high', color: '#FF4D4D' },
];

export const cprSteps = [
  { title: 'Check responsiveness', detail: 'Tap the person\'s shoulders and shout. Check for normal breathing for no more than 10 seconds.' },
  { title: 'Call for help', detail: 'Ask someone to call emergency services or use the SOS button while you begin compressions.' },
  { title: 'Position your hands', detail: 'Place the heel of one hand on the centre of the chest, the other hand on top, fingers interlocked.' },
  { title: 'Compress', detail: 'Push hard and fast, at least 5cm deep, at a rate of 100–120 compressions per minute.' },
  { title: 'Give rescue breaths', detail: 'After 30 compressions, tilt the head back and give 2 breaths, watching the chest rise.' },
  { title: 'Continue the cycle', detail: 'Repeat 30 compressions and 2 breaths until help arrives or the person responds.' },
];
