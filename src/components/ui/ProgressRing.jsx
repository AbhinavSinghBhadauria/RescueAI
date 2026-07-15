import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressRing({ value = 0, size = 84, stroke = 8, color = '#4FC3F7', label, sub }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-sm">{value}%</div>
      </div>
      {label && <div className="text-xs text-subtext text-center">{label}{sub && <div className="text-white/70">{sub}</div>}</div>}
    </div>
  );
}
