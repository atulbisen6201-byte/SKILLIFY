// src/app/career-recommendation/components/SkillsPanel.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface Props {
  skills: string[]
}

export default function SkillsPanel({ skills }: Props) {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Required Skills</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-4 py-2 rounded-full text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-gray-200 hover:bg-indigo-600/20 hover:border-indigo-400 transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
