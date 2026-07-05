// src/app/career-recommendation/components/CareerHeader.tsx
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
  TrendingUp,
  Clock,
  Award,
} from 'lucide-react'
import { Career } from '../data/careersData'

const careerIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

const companyLogoColors: Record<string, string> = {
  Google: 'bg-red-500/10 text-red-400 border-red-500/20',
  Meta: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Amazon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Vercel: 'bg-slate-500/10 text-slate-200 border-slate-500/20',
  Netflix: 'bg-red-600/10 text-red-500 border-red-600/20',
  Stripe: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Supabase: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Microsoft: 'bg-blue-600/10 text-blue-500 border-blue-600/20',
  Dropbox: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
  Oracle: 'bg-red-500/10 text-red-400 border-red-500/20',
  OpenAI: 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20',
  Cloudflare: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  CrowdStrike: 'bg-red-600/10 text-red-500 border-red-600/20',
  McKinsey: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Spotify: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  HashiCorp: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

interface Props {
  career: Career
}

export default function CareerHeader({ career }: Props) {
  const Icon = careerIconMap[career.icon] ?? Code
  
  const difficultyColor: Record<string, string> = {
    Easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    Hard: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  }
  const badgeClass = difficultyColor[career.difficulty] ?? difficultyColor['Medium']

  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Visual background ambient gradient */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Core Icon wrapper */}
        <div className="flex-shrink-0 p-5 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-2xl border border-white/15 shadow-inner">
          <Icon className="h-12 w-12 text-indigo-300" />
        </div>

        {/* Text descriptions */}
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{career.name}</h1>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed mt-1">{career.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-gray-300 flex items-center gap-1.5">
              💰 <span className="font-semibold">{career.averageSalary}</span> Avg. Salary
            </span>
            <span className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-gray-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-400" /> {career.learningDuration}
            </span>
            <span className={`px-3 py-1.5 rounded-full border ${badgeClass} font-semibold flex items-center gap-1`}>
              <Award className="h-3.5 w-3.5" />
              {career.difficulty}
            </span>
            <span className="px-3 py-1.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 rounded-full font-semibold flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
              {career.demand} Demand
            </span>
          </div>

          {/* Hiring companies icons preview */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Top Hiring Companies:</span>
            <div className="flex -space-x-2">
              {career.hiringCompanies.map((c, idx) => {
                const colorClass = companyLogoColors[c] || 'bg-gray-800 text-gray-400 border-gray-700'
                return (
                  <div
                    key={idx}
                    className={`h-7 w-7 rounded-full border flex items-center justify-center font-bold text-xs shadow-md transition-transform hover:scale-110 cursor-pointer ${colorClass}`}
                    title={c}
                  >
                    {c.charAt(0)}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar section at the bottom */}
      <div className="border-t border-white/5 mt-6 pt-5 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-semibold uppercase tracking-wide">Overall Learning Progress</span>
          <span className="text-indigo-300 font-bold text-sm">{career.progress}% Completed</span>
        </div>
        <div className="w-full h-2.5 bg-gray-800/80 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${career.progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
