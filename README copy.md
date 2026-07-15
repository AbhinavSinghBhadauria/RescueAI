# RescueAI — On-Device AI Emergency Assistant

A real, working RescueAI build: genuine on-device AI (runs in your browser
tab via WebAssembly/WebGPU, no server round trip), real browser/device data
(geolocation, weather, battery, storage), and a real local backend
(Express + JSON database) for profile, contacts, medicine cabinet, and
history — all wired up, nothing mocked.

## What's real here

| Feature | How |
|---|---|
| AI chat | A real LLM (`Qwen1.5-0.5B-Chat`) runs **in the browser** via [`@huggingface/transformers`](https://github.com/huggingface/transformers.js), streamed token-by-token. First run downloads ~400MB from the Hugging Face CDN and caches it; every run after that is fully offline. |
| Injury photo analysis | A real image-classification model (`ViT-base`) also runs on-device in a Web Worker. It's a **general-purpose vision model, not a medical device** — the UI says so plainly; treat it as a demo of local inference, not a diagnosis. |
| Weather | Live data from [Open-Meteo](https://open-meteo.com) (free, no API key) using your real coordinates. |
| Location | Real browser Geolocation API + free reverse-geocoding (BigDataCloud). |
| Battery | Real device battery via the Battery Status API (Chromium browsers only — Firefox/Safari removed it). |
| Storage | Real usage/quota via `navigator.storage.estimate()`. |
| Network status | Real `navigator.onLine` + a live backend health check. |
| Profile / contacts / medicine cabinet / history / notifications | Persisted in a real local backend (Express + a JSON file database) — survives refreshes, editable from the UI. |
| Emergency SOS | Real `tel:` links to dial (device places the call, not the browser), real location sharing via the native Web Share API or a Google Maps link, and every trigger is logged to the backend. |

## Stack
- React 18 + Vite, Tailwind CSS, Framer Motion, React Router, Lucide icons
- `@huggingface/transformers` (transformers.js) running in Web Workers for on-device inference
- Express + `lowdb` (JSON file, zero setup — no external database needed)

## Getting started

```bash
npm install
npm run dev:all      # starts both the Vite frontend and the local API
```
This runs the frontend at `http://localhost:5173` and the API at
`http://localhost:4000`. Or run them separately:

```bash
npm run dev       # frontend only
npm run server    # backend only
```

The frontend talks to the backend via `VITE_API_URL` in `.env` (defaults to
`http://localhost:4000/api`).

### First-run notes
- **Load the models**: on the AI Assistant and Scan Injury pages, tap the
  "Load model" button. This is a real download (a few hundred MB total) —
  it needs an internet connection once, then works offline.
- **Location/weather/battery**: your browser will prompt for location
  permission. Battery API is Chromium-only; other browsers show a graceful
  "not supported" state instead of fake data.
- **Backend must be running** for profile, contacts, medicine, and history
  to load — if it's down, the UI shows toasts/errors rather than silently
  falling back to fake data.

## Structure
```
server/             Express API + seed.json (initial data) + db.json (generated, gitignored)
src/
  ai/                Web Workers running the real on-device models
  api/client.js       Fetch wrapper for the local backend
  hooks/              useGeolocation, useWeather, useBattery, useNetworkStatus, useStorageEstimate
  context/
    AppContext.jsx     sidebar / notifications (backend-synced)
    ModelContext.jsx    lifecycle + status for the two on-device models
  components/
    layout/            TopNav, Sidebar, Background (aurora), FloatingSOS, NotificationCenter
    ui/                 GlassCard, Button, Modal, AIOrb, ProgressRing, Skeleton, PageHeader
  pages/               Home, AIAssistant, FirstAid, ScanInjury, Medicine, CPRGuide,
                       EmergencySOS, OfflineMaps, Downloads, History, Profile, Settings,
                       About, Privacy, NotFound
```

## Honest limitations
- **Offline Maps** and generic first-aid step content are still static —
  there's no open, key-less routing/tiles API that works well without a
  paid key, so this page is left as a UI demo.
- The vision model is a genuine general-purpose classifier, not a trained
  injury-detection model — no such open, browser-ready model exists, and
  faking medical confidence scores would be actively misleading.
- `tel:` links and the Web Share API are as close as a web app can get to
  "really calling someone" or "really sharing your location" without a
  native app shell.
