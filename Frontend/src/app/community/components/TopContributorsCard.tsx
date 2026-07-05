'use client'

import { Medal } from 'lucide-react'

export function TopContributorsCard() {
  const contributors = [
    { name: 'Sarah Chen', avatar: 'SC', points: '12.5K', rank: 1 },
    { name: 'Alex Rivera', avatar: 'AR', points: '10.2K', rank: 2 },
    { name: 'Priya Sharma', avatar: 'PS', points: '9.8K', rank: 3 },
    { name: 'Michael Kim', avatar: 'MK', points: '8.1K', rank: 4 },
    { name: 'Liam Patel', avatar: 'LP', points: '7.6K', rank: 5 },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card/45 backdrop-blur-md p-5 shadow-lg space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <Medal className="h-5 w-5 text-amber-500" />
        <h3 className="font-bold text-sm">Top Contributors</h3>
      </div>

      <div className="space-y-3">
        {contributors.map((user) => (
          <div
            key={user.name}
            className="flex items-center gap-3 rounded-xl border border-border/20 bg-secondary/10 p-2.5 hover:bg-secondary/35 transition-colors"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {user.rank}
            </span>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600/20 to-violet-600/20 text-xs font-bold text-primary border border-primary/10">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-muted-foreground">{user.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
