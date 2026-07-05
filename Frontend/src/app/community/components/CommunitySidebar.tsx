'use client'

import { Rss, FileUser, Bookmark } from 'lucide-react'

export type ActiveMenu = 'feed' | 'my-posts' | 'saved-posts'

interface CommunitySidebarProps {
  activeMenu: ActiveMenu
  setActiveMenu: (menu: ActiveMenu) => void
}

export function CommunitySidebar({ activeMenu, setActiveMenu }: CommunitySidebarProps) {
  const menuItems = [
    { id: 'feed' as const, label: 'Feed', icon: Rss, description: 'All community discussions' },
    { id: 'my-posts' as const, label: 'My Posts', icon: FileUser, description: 'Posts published by you' },
    { id: 'saved-posts' as const, label: 'Saved Posts', icon: Bookmark, description: 'Discussions you bookmarked' },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card/65 backdrop-blur-md p-3 shadow-lg space-y-1">
      {menuItems.map((item) => {
        const Icon = item.icon
        const isSelected = activeMenu === item.id

        return (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-blue-600/15 to-violet-600/15 text-primary border-l-2 border-primary shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
            }`}
          >
            <Icon className={`h-4.5 w-4.5 ${isSelected ? 'text-primary' : ''}`} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
