import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1.5,
  top: Math.random() * 100,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: 5 + Math.random() * 6,
}));

export default function Background() {
  const stableParticles = useMemo(() => particles, []);

  return (
    <>
      <div className="aurora-bg" aria-hidden="true">
        <div className="blob w-[520px] h-[520px] bg-emergency/30 -top-40 -left-40" />
        <div className="blob w-[600px] h-[600px] bg-medical/25 top-1/3 -right-56" style={{ animationDelay: '3s', animationDuration: '22s' }} />
        <div className="blob w-[480px] h-[480px] bg-purple/30 bottom-0 left-1/4" style={{ animationDelay: '6s', animationDuration: '20s' }} />
        <div className="blob w-[380px] h-[380px] bg-success/10 bottom-10 right-10" style={{ animationDelay: '2s', animationDuration: '26s' }} />

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

        {/* radial vignette to keep foreground legible */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 20%, transparent 0%, #050816 78%)' }} />
      </div>
      <div className="noise-overlay" aria-hidden="true" />
    </>
  );
}
