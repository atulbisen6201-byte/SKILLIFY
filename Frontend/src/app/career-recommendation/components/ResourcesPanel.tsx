// src/app/career-recommendation/components/ResourcesPanel.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ExternalLink } from 'lucide-react'

interface Resource {
  title: string
  url: string
  type: string
}

interface Props {
  resources: Resource[]
}

export default function ResourcesPanel({ resources }: Props) {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Recommended Resources</h3>
      </div>
      <div className="space-y-3">
        {resources.map((r) => (
          <a
            key={r.title}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{r.title}</p>
              <p className="text-xs text-gray-500">{r.type}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
          </a>
        ))}
      </div>
    </motion.div>
  )
}
