// src/app/career-recommendation/components/CareerOverviewPanel.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Briefcase, Building2, BarChart3 } from 'lucide-react'

interface Overview {
  demand: string
  experience: string
  topCompanies: string[]
  growth: string
}

interface Props {
  overview: Overview
}

export default function CareerOverviewPanel({ overview }: Props) {
  const items = [
    { label: 'Market Demand', value: overview.demand, icon: BarChart3, color: 'text-green-400' },
    { label: 'Experience', value: overview.experience, icon: Briefcase, color: 'text-blue-400' },
    { label: 'Career Growth', value: overview.growth, icon: TrendingUp, color: 'text-cyan-400' },
  ]

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Career Overview</h3>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-gray-200">{item.value}</span>
          </div>
        ))}

        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-gray-400">Top Companies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {overview.topCompanies.map((company) => (
              <span
                key={company}
                className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-gray-300"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
