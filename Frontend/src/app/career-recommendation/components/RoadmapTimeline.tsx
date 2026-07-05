// src/app/career-recommendation/components/RoadmapTimeline.tsx
'use client'

import React from 'react';
import RoadmapStep from './RoadmapStep';
import { BookOpen, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';

// Example static steps – can be replaced by API data per career.
const defaultSteps = [
  { title: 'Learn Core Skills', duration: '3-6 months', icon: BookOpen, status: 'completed' as const },
  { title: 'Build Portfolio Projects', duration: '2-3 months', icon: Briefcase, status: 'current' as const },
  { title: 'Get Certifications', duration: '1-2 months', icon: GraduationCap, status: 'locked' as const },
  { title: 'Apply & Interview', duration: '1-3 months', icon: TrendingUp, status: 'locked' as const },
];

interface Props {
  steps?: typeof defaultSteps;
}

export default function RoadmapTimeline({ steps = defaultSteps }: Props) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <RoadmapStep key={i} step={step} />
      ))}
    </div>
  );
}
