import React, { useState } from 'react'
import { Search } from 'lucide-react'
import CareerListItem from './CareerListItem'
import { careersData, Career } from '../data/careersData'

interface CareerSidebarProps {
  selectedCareerId: number
  onSelect: (id: number) => void
}

export default function CareerSidebar({ selectedCareerId, onSelect }: CareerSidebarProps) {
  const [search, setSearch] = useState('')
  const filtered = careersData.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <aside className="w-full md:w-[30%] min-w-[280px] max-w-[360px] bg-white/5 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col">
      <h2 className="text-xl font-bold text-indigo-300 mb-4">Career Paths</h2>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search career..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
      </div>
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {filtered.map((career) => (
          <CareerListItem
            key={career.id}
            career={career}
            isActive={career.id === selectedCareerId}
            onClick={() => onSelect(career.id)}
          />
        ))}
      </div>
    </aside>
  )
}
