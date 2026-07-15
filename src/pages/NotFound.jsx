import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
        <Compass size={48} className="text-medical mb-4" />
      </motion.div>
      <h1 className="font-display text-4xl mb-2">404</h1>
      <p className="text-subtext mb-6">This page doesn't exist — but help is still where you left it.</p>
      <Link to="/"><Button>Back to Dashboard</Button></Link>
    </div>
  );
}
