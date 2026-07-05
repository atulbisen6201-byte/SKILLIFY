'use client'

import { CalendarDays, ExternalLink } from 'lucide-react'

export function UpcomingEventsCard() {
  const events = [
    { title: 'Resume Workshop', type: 'Interactive Seminar', date: 'July 2, 6:00 PM', attendees: '45 attending' },
    { title: 'Mock Interview Prep', type: 'Practice Session', date: 'July 5, 4:00 PM', attendees: '28 attending' },
    { title: 'Career Webinar', type: 'Expert Panel Q&A', date: 'July 8, 12:00 PM', attendees: '120 attending' },
    { title: 'Skillfy Hackathon', type: 'Coding Challenge', date: 'July 15 - 17', attendees: '85 participants' },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card/45 backdrop-blur-md p-5 shadow-lg space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <CalendarDays className="h-5 w-5 text-indigo-500" />
        <h3 className="font-bold text-sm">Upcoming Events</h3>
      </div>

      <div className="space-y-3">
        {events.map((ev) => (
          <div
            key={ev.title}
            className="group block rounded-xl border border-border/25 bg-secondary/5 p-3 hover:bg-secondary/20 transition-all cursor-pointer border-l-2 border-l-primary"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {ev.title}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{ev.type}</p>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex items-center justify-between text-[9px] text-muted-foreground mt-2 bg-background/30 rounded p-1">
              <span>{ev.date}</span>
              <span className="font-semibold text-primary/80">{ev.attendees}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
