import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const particles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: Math.random() * 2.5 + 1,
  top: Math.random() * 100,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: 6 + Math.random() * 6,
}));

export default function Background() {
  const stableParticles = useMemo(() => particles, []);

  return (
    <>
      <div className="aurora-bg" aria-hidden="true">
        {/* faint instrument-panel grid instead of a rainbow mesh gradient */}
        <div className="grid-field" />

        {/* two quiet, single-hue fields — restraint over spectacle */}
        <div className="blob w-[560px] h-[560px] bg-emergency/20 -top-48 -left-48" />
        <div className="blob w-[480px] h-[480px] bg-medical/10 bottom-0 right-0" style={{ animationDelay: '4s', animationDuration: '26s' }} />

        {stableParticles.map((p) => (
          <motion.span
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              top: `${p.top}%`,
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 15%, transparent 0%, #0B0C0E 75%)' }} />
      </div>
      <div className="noise-overlay" aria-hidden="true" />
    </>
  );
}
