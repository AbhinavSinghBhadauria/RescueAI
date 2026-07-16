import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-emergency text-white shadow-glow',
  secondary: 'bg-medical text-[#04101a] shadow-glowBlue',
  ghost: 'bg-white/8 text-white border border-white/15',
  purple: 'bg-purple text-white shadow-glowPurple',
  success: 'bg-success text-[#04160a]',
};

export default function Button({
  children, variant = 'primary', className = '', icon: Icon, onClick, type = 'button', ...rest
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm overflow-hidden transition-colors ${variants[variant]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
}
