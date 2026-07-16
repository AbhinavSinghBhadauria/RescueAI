import React from 'react';

export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-xl bg-white/5 overflow-hidden relative ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          backgroundSize: '1000px 100%',
        }}
      />
      <div className="absolute inset-0 animate-shimmer" style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        backgroundSize: '500px 100%',
      }} />
    </div>
  );
}
