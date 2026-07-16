import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import { useModels } from '../context/ModelContext';

export default function Downloads() {
  const { chatModel, visionModel } = useModels();

  const models = [
    { name: 'Qwen2.5-0.5B-Instruct', desc: 'On-device conversation model (~400MB)', m: chatModel },
    { name: 'ViT-base-patch16-224', desc: 'On-device vision classifier (~90MB)', m: visionModel },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Downloads"
        title="On-device AI models"
        subtitle="Real model weights, fetched once from the Hugging Face CDN and cached by your browser."
      />
      <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-3">
        {models.map((mod) => (
          <GlassCard key={mod.name} className="p-4 flex items-center justify-between" hover={false}>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-purple/15 text-purple flex items-center justify-center">
                <Download size={16} />
              </span>
              <div>
                <p className="text-sm font-medium">{mod.name}</p>
                <p className="text-xs text-subtext">{mod.desc}</p>
              </div>
            </div>
            {mod.m.status === 'ready' ? (
              <span className="text-xs text-success flex items-center gap-1"><CheckCircle2 size={14} /> Ready offline</span>
            ) : mod.m.status === 'loading' ? (
              <span className="text-xs text-medical flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> {mod.m.progress}%</span>
            ) : (
              <button onClick={() => mod.m.load()} className="text-xs text-medical hover:underline">Download</button>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
