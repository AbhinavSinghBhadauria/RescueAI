import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * RescueAI's signature element: a radar sweep, not a generic pulsing
 * gradient orb. It's built from the actual vocabulary of detection and
 * triage equipment (sonar/radar sweep, scan ring) rather than a decorative
 * multi-color glow — restrained to one accent, the brand's emergency red.
 */
export default function AIOrb({ size = 220, listening = false }) {
  const core = size * 0.4;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label="RescueAI on-device model, active"
    >
      {/* outer static ring — instrument bezel */}
      <div
        className="absolute rounded-full border border-white/10"
        style={{ width: size, height: size }}
      />
      {/* tick marks, like a dial */}
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute bg-white/15"
          style={{
            width: 1.5,
            height: i % 3 === 0 ? 8 : 4,
            top: 0,
            left: '50%',
            transformOrigin: `0.75px ${size / 2}px`,
            transform: `translateX(-50%) rotate(${i * 30}deg)`,
          }}
        />
      ))}

      {/* radar sweep — the signature motion */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{ width: size * 0.9, height: size * 0.9 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(214,71,44,0.55) 18deg, transparent 55deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: listening ? 1.6 : 3.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* faint scan rings */}
      {[0.9, 0.65].map((f, i) => (
        <div
          key={f}
          className="absolute rounded-full border border-emergency/15"
          style={{ width: size * f, height: size * f }}
        />
      ))}

      {/* core */}
      <motion.div
        className="relative rounded-full flex items-center justify-center glass-strong border border-emergency/30"
        style={{ width: core, height: core }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="text-ink" size={core * 0.34} strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}
