import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ModelContext = createContext(null);

function useModelWorker(workerFactory) {
  const workerRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [progress, setProgress] = useState(0);
  const [fileProgress, setFileProgress] = useState({});
  const pendingRef = useRef(null); // { resolve, reject, onToken? }

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const worker = workerFactory();
    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'progress') {
        // transformers.js progress events: { status, file, progress, loaded, total }
        if (payload?.file) {
          setFileProgress((prev) => {
            const next = { ...prev, [payload.file]: payload.progress ?? prev[payload.file] ?? 0 };
            const values = Object.values(next);
            const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            setProgress(Math.round(avg));
            return next;
          });
        }
      } else if (type === 'ready') {
        setStatus('ready');
        setProgress(100);
        pendingRef.current?.resolve?.();
        pendingRef.current = null;
      } else if (type === 'error') {
        setStatus('error');
        pendingRef.current?.reject?.(new Error(payload));
        pendingRef.current = null;
      } else if (type === 'token') {
        pendingRef.current?.onToken?.(payload);
      } else if (type === 'done') {
        pendingRef.current?.resolve?.(payload);
        pendingRef.current = null;
      } else if (type === 'result') {
        pendingRef.current?.resolve?.(payload);
        pendingRef.current = null;
      }
    };
    workerRef.current = worker;
    return worker;
  }, [workerFactory]);

  const load = useCallback(() => {
    if (status === 'ready') return Promise.resolve();
    setStatus('loading');
    const worker = ensureWorker();
    return new Promise((resolve, reject) => {
      pendingRef.current = { resolve, reject };
      worker.postMessage({ type: 'load' });
    });
  }, [ensureWorker, status]);

  const run = useCallback((type, payload, onToken) => {
    const worker = ensureWorker();
    return new Promise((resolve, reject) => {
      pendingRef.current = { resolve, reject, onToken };
      worker.postMessage({ type, payload });
    });
  }, [ensureWorker]);

  return { status, progress, load, run };
}

export function ModelProvider({ children }) {
  const chat = useModelWorker(() => new Worker(new URL('../ai/llmWorker.js', import.meta.url), { type: 'module' }));
  const vision = useModelWorker(() => new Worker(new URL('../ai/visionWorker.js', import.meta.url), { type: 'module' }));

  const value = {
    chatModel: {
      status: chat.status,
      progress: chat.progress,
      load: chat.load,
      generate: (messages, onToken) => chat.run('generate', { messages }, onToken),
    },
    visionModel: {
      status: vision.status,
      progress: vision.progress,
      load: vision.load,
      classify: (imageDataUrl) => vision.run('classify', { imageDataUrl }),
    },
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
}

export function useModels() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error('useModels must be used within ModelProvider');
  return ctx;
}
