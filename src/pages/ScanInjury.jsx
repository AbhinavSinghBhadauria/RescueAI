import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Camera, Image as ImageIcon, X, Download, AlertTriangle, Info, CircleDot, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useModels } from '../context/ModelContext';
import { api } from '../api/client';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ScanInjury() {
  const { visionModel } = useModels();
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const openCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('This browser does not support camera access (getUserMedia unavailable).');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      // videoRef exists once cameraOpen renders the <video>; attach on next tick
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch (err) {
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Allow camera access in your browser settings and try again.'
          : err.name === 'NotFoundError'
          ? 'No camera device found on this device.'
          : `Could not open camera: ${err.message}`
      );
    }
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    if (cameraOpen) openCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const closeCamera = () => {
    stopCamera();
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    closeCamera();
    runAnalysis(dataUrl);
  };

  const runAnalysis = async (dataUrl) => {
    setPreview(dataUrl);
    setResults(null);

    if (visionModel.status !== 'ready') {
      toast.info('Load the on-device vision model first.');
      return;
    }

    setAnalyzing(true);
    try {
      const out = await visionModel.classify(dataUrl);
      setResults(out);
      api.addHistory({ type: 'Scan', title: out?.[0]?.label ? `Photo analysed — top match: ${out[0].label}` : 'Photo analysed' }).catch(() => {});
    } catch (err) {
      toast.error('On-device analysis failed.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    runAnalysis(dataUrl);
  };

  const loadModel = async () => {
    try {
      await visionModel.load();
      toast.success('Vision model ready — images now analysed fully on-device.');
    } catch {
      toast.error('Could not load the vision model.');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Scan Injury"
        title="Let an on-device model take a look"
        subtitle="Photos never leave your browser — inference runs locally via WebAssembly/WebGPU."
      />

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="glass rounded-xl2 p-4 mb-6 flex items-start gap-3 text-xs text-subtext">
          <Info size={16} className="text-medical shrink-0 mt-0.5" />
          <p>
            This demo uses a general-purpose, publicly available on-device vision model — not a certified medical
            device. It won't produce a real injury diagnosis. Treat any output here as a technical demonstration of
            local inference, not medical advice. For real injuries, use the First Aid guide or Emergency SOS.
          </p>
        </div>

        {visionModel.status !== 'ready' && (
          <div className="flex justify-center mb-6">
            <button
              onClick={loadModel}
              disabled={visionModel.status === 'loading'}
              className="flex items-center gap-2 text-sm bg-medical/15 text-medical px-4 py-2.5 rounded-full hover:bg-medical/25 transition-colors disabled:opacity-60"
            >
              <Download size={15} />
              {visionModel.status === 'loading' ? `Downloading model… ${visionModel.progress}%` : 'Load on-device vision model (~90MB)'}
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
          >
            <GlassCard
              hover={false}
              className={`h-80 flex flex-col items-center justify-center gap-4 border-2 border-dashed transition-colors relative overflow-hidden ${dragOver ? 'border-medical bg-medical/5' : 'border-white/15'}`}
            >
              {cameraOpen ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-xl2" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                    <button onClick={closeCamera} aria-label="Cancel" className="bg-black/60 rounded-full p-3">
                      <X size={18} />
                    </button>
                    <button onClick={capturePhoto} aria-label="Capture photo" className="bg-emergency rounded-full p-4 shadow-glow">
                      <CircleDot size={22} />
                    </button>
                    <button onClick={switchCamera} aria-label="Switch camera" className="bg-black/60 rounded-full p-3">
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>
              ) : preview ? (
                <div className="relative w-full h-full p-3">
                  <img src={preview} alt="Uploaded preview" className="w-full h-full object-cover rounded-xl2" />
                  <button
                    onClick={() => { setPreview(null); setResults(null); }}
                    className="absolute top-5 right-5 bg-black/60 rounded-full p-1.5"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
                    <UploadCloud size={40} className="text-medical" />
                  </motion.div>
                  <p className="text-sm text-subtext text-center px-6">Drag & drop a photo,<br />or use your live camera</p>
                  <div className="flex gap-3">
                    <Button variant="ghost" icon={ImageIcon} onClick={() => inputRef.current?.click()}>Upload</Button>
                    <Button variant="secondary" icon={Camera} onClick={openCamera}>Camera</Button>
                  </div>
                  {cameraError && (
                    <p className="text-emergency text-xs text-center px-6 flex items-center gap-1.5">
                      <AlertTriangle size={12} /> {cameraError}
                    </p>
                  )}
                  <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                </>
              )}
            </GlassCard>
          </div>

          <GlassCard className="h-80 p-6 flex flex-col" hover={false}>
            <p className="font-medium mb-4">On-device analysis</p>
            {!preview && <p className="text-subtext text-sm">Upload or capture a photo to see real on-device model output here.</p>}

            {analyzing && (
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <p className="text-xs text-medical font-mono-ui mt-2">Running vision model locally…</p>
              </div>
            )}

            <AnimatePresence>
              {results && !analyzing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col overflow-y-auto">
                  <p className="text-xs text-subtext uppercase tracking-wide mb-2">Top predictions</p>
                  <ol className="space-y-2.5">
                    {results.map((r, i) => (
                      <motion.li
                        key={r.label}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="text-sm"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="capitalize">{r.label}</span>
                          <span className="text-subtext font-mono-ui text-xs">{(r.score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full bg-medical rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${r.score * 100}%` }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                  <p className="text-[11px] text-warning flex items-start gap-1.5 mt-4">
                    <AlertTriangle size={12} className="shrink-0 mt-0.5" /> General-purpose model output — not a medical diagnosis.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
