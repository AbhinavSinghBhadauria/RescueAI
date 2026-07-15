import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Background from './components/layout/Background';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import FloatingSOS from './components/layout/FloatingSOS';
import NotificationCenter from './components/layout/NotificationCenter';
import Skeleton from './components/ui/Skeleton';

const Home = lazy(() => import('./pages/Home'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const FirstAid = lazy(() => import('./pages/FirstAid'));
const ScanInjury = lazy(() => import('./pages/ScanInjury'));
const Medicine = lazy(() => import('./pages/Medicine'));
const CPRGuide = lazy(() => import('./pages/CPRGuide'));
const EmergencySOS = lazy(() => import('./pages/EmergencySOS'));
const OfflineMaps = lazy(() => import('./pages/OfflineMaps'));
const Downloads = lazy(() => import('./pages/Downloads'));
const HistoryPage = lazy(() => import('./pages/History'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-40 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen font-body">
      <Background />
      <TopNav />
      <Sidebar />
      <NotificationCenter />
      <FloatingSOS />

      <main className="relative z-10 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Suspense fallback={<PageFallback />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/assistant" element={<AIAssistant />} />
                <Route path="/first-aid" element={<FirstAid />} />
                <Route path="/scan-injury" element={<ScanInjury />} />
                <Route path="/medicine" element={<Medicine />} />
                <Route path="/cpr" element={<CPRGuide />} />
                <Route path="/sos" element={<EmergencySOS />} />
                <Route path="/offline-maps" element={<OfflineMaps />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
