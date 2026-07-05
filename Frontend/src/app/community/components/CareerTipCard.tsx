'use client'

import { useState, useEffect } from 'react'
import { BrainCircuit, RefreshCcw } from 'lucide-react'

const tips = [
  "Tailor your resume for ATS systems by copying high-impact keywords directly from the target job description into your bullets.",
  "Use the STAR method (Situation, Task, Action, Result) in interview responses to construct clear, quantitative stories.",
  "A public portfolio displaying real, working deployment URLs makes your competence 10x more believable to hiring managers.",
  "Continuous micro-learning: commit 15 minutes a day to read framework updates or documentation to stay ahead technically.",
  "Informational interviews: reach out to senior engineering practitioners for advice rather than immediate job referrals.",
]

export function CareerTipCard() {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    // Pick a random tip on mount
    setTipIndex(Math.floor(Math.random() * tips.length))
  }, [])

  const rotateTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length)
  }

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-600/5 to-violet-600/5 p-5 shadow-lg space-y-3 relative overflow-hidden">
      {/* Decorative colored glow */}
      <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/10 rounded-full blur-xl" />
      
      <div className="flex items-center justify-between border-b border-border/40 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-violet-500" />
          <h3 className="font-bold text-sm">AI Career Tip</h3>
        </div>
        <button
          onClick={rotateTip}
          className="rounded-full p-1 hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
          title="Next Tip"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="text-xs text-muted-foreground leading-relaxed pt-1 select-none min-h-[70px] relative z-10">
        "{tips[tipIndex]}"
      </div>
    </div>
  )
}
