import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * The AI Orb is RescueAI's signature element — a breathing on-device
 * "brain" represented as layered rings + a glowing core. Reused at
 * different sizes across the hero, chat header, and loading states so the
 * whole product shares one visual heartbeat.
 */
export default function AIOrb({ size = 220, listening = false }) {
  const core = size * 0.42;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label="RescueAI on-device model, active"
    >
      {/* outer ring */}
      <div
        className="absolute rounded-full border border-medical/30 animate-spinSlow"
        style={{ width: size, height: size }}
      />
      {/* mid ring */}
      <div
        className="absolute rounded-full border border-dashed border-purple/40 animate-spinSlowReverse"
        style={{ width: size * 0.78, height: size * 0.78 }}
      />
      {/* glow halo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.86,
          height: size * 0.86,
          background: 'radial-gradient(circle, rgba(255,77,77,0.35), rgba(139,92,246,0.25) 55%, transparent 75%)',
          filter: 'blur(18px)',
        }}
        animate={{ scale: listening ? [1, 1.18, 1] : [1, 1.08, 1] }}
        transition={{ duration: listening ? 1.1 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* core */}
      <motion.div
        className="relative rounded-full flex items-center justify-center gradient-border glass-strong shadow-glow"
        style={{ width: core, height: core }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="text-white" size={core * 0.36} strokeWidth={1.6} />
      </motion.div>

      {/* orbiting particles */}
      {[0, 120, 240].map((deg, i) => (
        <motion.span
          key={deg}
          className="absolute rounded-full bg-medical"
          style={{ width: 6, height: 6, top: '50%', left: '50%' }}
          animate={{
            x: [
              Math.cos((deg * Math.PI) / 180) * (size * 0.46),
              Math.cos(((deg + 360) * Math.PI) / 180) * (size * 0.46),
            ],
            y: [
              Math.sin((deg * Math.PI) / 180) * (size * 0.46),
              Math.sin(((deg + 360) * Math.PI) / 180) * (size * 0.46),
            ],
          }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}
