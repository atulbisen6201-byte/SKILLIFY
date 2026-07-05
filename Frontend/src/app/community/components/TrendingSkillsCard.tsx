'use client'

import { TrendingUp } from 'lucide-react'

export function TrendingSkillsCard() {
  const skills = [
    { name: 'React', postsCount: '4.2k discussions' },
    { name: 'Python', postsCount: '3.8k discussions' },
    { name: 'Next.js', postsCount: '3.1k discussions' },
    { name: 'Node.js', postsCount: '2.5k discussions' },
    { name: 'AI', postsCount: '5.6k discussions' },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card/45 backdrop-blur-md p-5 shadow-lg space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-sm">Trending Skills</h3>
      </div>
      
      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center justify-between rounded-xl border border-border/30 bg-secondary/15 p-2.5 hover:bg-secondary/40 transition-colors cursor-pointer"
          >
            <span className="font-semibold text-xs text-foreground bg-primary/5 border border-primary/10 rounded px-2 py-0.5">
              {skill.name}
            </span>
            <span className="text-[10px] text-muted-foreground">{skill.postsCount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
