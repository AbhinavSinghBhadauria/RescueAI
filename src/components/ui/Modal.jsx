import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Info, XCircle, Siren } from 'lucide-react';

const icons = {
  alert: { Icon: Siren, color: '#D6472C' },
  warning: { Icon: AlertTriangle, color: '#C4903D' },
  info: { Icon: Info, color: '#4A8C8C' },
  success: { Icon: CheckCircle2, color: '#4C9A6A' },
  error: { Icon: XCircle, color: '#D6472C' },
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  variant = 'info',
  position = 'center', // center | bottom-sheet
}) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const meta = icons[variant] || icons.info;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`relative w-full ${position === 'bottom-sheet' ? 'sm:max-w-md self-end sm:self-center rounded-t-xl3 sm:rounded-xl3' : 'max-w-md rounded-xl3'} glass-strong p-6 gradient-border`}
            initial={position === 'bottom-sheet'
              ? { y: '100%', opacity: 0 }
              : { scale: 0.9, opacity: 0, y: 12 }}
            animate={position === 'bottom-sheet' ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
            exit={position === 'bottom-sheet' ? { y: '100%', opacity: 0 } : { scale: 0.9, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-subtext hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${meta.color}22`, color: meta.color }}
              >
                <meta.Icon size={20} />
              </div>
              {title && <h3 className="font-display text-lg pt-1.5">{title}</h3>}
            </div>

            <div className="text-sm text-subtext leading-relaxed">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
