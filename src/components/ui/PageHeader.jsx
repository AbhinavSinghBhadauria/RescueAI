import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.2em] text-medical font-mono-ui mb-2"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="font-display text-3xl md:text-4xl font-semibold tracking-tight"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-subtext mt-2 max-w-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {right}
    </div>
  );
}
