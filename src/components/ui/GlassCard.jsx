import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow,
  as: Component = motion.div,
  ...rest
}) {
  const glowClass = glow === 'red' ? 'hover:shadow-glow'
    : glow === 'blue' ? 'hover:shadow-glowBlue'
    : glow === 'purple' ? 'hover:shadow-glowPurple'
    : '';

  return (
    <Component
      className={`glass rounded-xl2 ${hover ? `transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.09] ${glowClass}` : ''} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
