// src/app/career-recommendation/components/RoadmapStep.tsx
'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface Step {
  title: string;
  duration: string;
  icon: any;
  description?: string;
  status: 'completed' | 'current' | 'locked';
}

export default function RoadmapStep({ step }: { step: Step }) {
  const Icon = step.icon;
  const statusStyles = {
    completed: 'border-green-400 bg-green-500/10 text-green-300',
    current: 'border-blue-400 bg-blue-500/10 text-blue-300',
    locked: 'border-gray-600 bg-gray-800/30 text-gray-400',
  }[step.status];

  return (
    <motion.div
      className={`flex items-start gap-4 p-4 rounded-xl border ${statusStyles} backdrop-blur-2xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{step.title}</h3>
          <span className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" /> {step.duration}
          </span>
        </div>
        {step.description && <p className="text-xs text-gray-400 mt-1">{step.description}</p>}
      </div>
    </motion.div>
  );
}
