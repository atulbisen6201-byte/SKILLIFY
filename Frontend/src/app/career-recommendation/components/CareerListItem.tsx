// src/app/career-recommendation/components/CareerListItem.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Database,
  Layers,
  FileCode2,
  Coffee,
  Brain,
  Cloud,
  Shield,
  BarChart2,
  GitBranch,
} from 'lucide-react'

// Map icon name to actual Lucide component
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Database,
  Layers,
  FileCode2,
  Coffee,
  Brain,
  Cloud,
  Shield,
  BarChart2,
  GitBranch,
}

type Career = {
  id: number
  name: string
  icon: string
  progress: number
}

interface Props {
  career: Career
  isActive: boolean
  onClick: () => void
}

export default function CareerListItem({ career, isActive, onClick }: Props) {
  const Icon = iconMap[career.icon] ?? Code
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
        isActive
          ? 'bg-indigo-600/30 border border-indigo-400 text-indigo-200'
          : 'bg-gray-800/30 border border-gray-700 text-gray-300 hover:bg-gray-700/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span className="font-medium text-sm">{career.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-400 rounded-full"
            style={{ width: `${career.progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{career.progress}%</span>
      </div>
    </motion.button>
  )
}
