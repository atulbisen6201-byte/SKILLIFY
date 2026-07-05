// src/app/career-recommendation/components/ProgressPanel.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, Loader2 } from 'lucide-react'

interface Props {
  personalization: any
  loading: boolean
}

export default function ProgressPanel({ personalization, loading }: Props) {
  // Derive progress values from personalization or use defaults
  const completed = personalization?.completedSkills ?? 4
  const total = personalization?.totalSkills ?? 12
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const remaining = total - completed

  // SVG circular progress
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (percentage / 100) * circumference

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Learning Progress</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* Animated circular progress */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              {/* Progress arc */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{percentage}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="w-full grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xl font-bold text-green-400">{completed}</p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xl font-bold text-gray-400">{remaining}</p>
              <p className="text-xs text-gray-400">Remaining</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
