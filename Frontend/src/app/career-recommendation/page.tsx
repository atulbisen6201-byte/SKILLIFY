// src/app/career-recommendation/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  Code,
  TrendingUp,
  Trophy,
  Terminal,
  BookMarked,
  Award,
  HelpCircle,
  FileText,
  Globe,
  Building2,
  Users,
  DollarSign,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { ChatWidget } from '@/components/chat-widget'
import { getAccessToken } from '@/lib/auth-client'
import { skillifyGetJson } from '@/lib/skillify-api'
import CareerSidebar from './components/CareerSidebar'
import CareerHeader from './components/CareerHeader'
import { careersData, Career } from './data/careersData'
import {
  CareerOverviewPanel,
  RequiredSkillsPanel,
  LearningRoadmapPanel,
  LearningProgressPanel,
  ProjectsPanel,
  RecommendedResourcesPanel,
  CertificationsPanel,
  InterviewQuestionsPanel,
  ResumeGuidePanel,
  PortfolioGuidePanel,
  CompaniesHiringPanel,
  JobRolesPanel,
  SalaryInsightsPanel,
  LearningTimelinePanel,
  FAQPanel,
} from './components/DetailPanels'

const gridButtons = [
  { id: 'overview', title: 'Career Overview', icon: Briefcase, color: 'hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] text-indigo-300' },
  { id: 'skills', title: 'Required Skills', icon: Code, color: 'hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] text-blue-300' },
  { id: 'roadmap', title: 'Learning Roadmap', icon: TrendingUp, color: 'hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-300' },
  { id: 'progress', title: 'Learning Progress', icon: Trophy, color: 'hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-300' },
  { id: 'projects', title: 'Projects', icon: Terminal, color: 'hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)] text-rose-300' },
  { id: 'resources', title: 'Recommended Resources', icon: BookMarked, color: 'hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] text-cyan-300' },
  { id: 'certifications', title: 'Certifications', icon: Award, color: 'hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] text-purple-300' },
  { id: 'interview', title: 'Interview Questions', icon: HelpCircle, color: 'hover:border-teal-500/50 hover:shadow-[0_0_15px_rgba(20,184,166,0.2)] text-teal-300' },
  { id: 'resume', title: 'Resume Guide', icon: FileText, color: 'hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.2)] text-pink-300' },
  { id: 'portfolio', title: 'Portfolio Guide', icon: Globe, color: 'hover:border-sky-500/50 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)] text-sky-300' },
  { id: 'companies', title: 'Companies Hiring', icon: Building2, color: 'hover:border-indigo-400/50 hover:shadow-[0_0_15px_rgba(129,140,248,0.2)] text-indigo-200' },
  { id: 'roles', title: 'Job Roles', icon: Users, color: 'hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] text-violet-300' },
  { id: 'salary', title: 'Salary Insights', icon: DollarSign, color: 'hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] text-yellow-300' },
  { id: 'timeline', title: 'Learning Timeline', icon: Calendar, color: 'hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.2)] text-emerald-200' },
  { id: 'faq', title: 'FAQs', icon: HelpCircle, color: 'hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] text-orange-300' },
]

export default function CareerRecommendationPage() {
  const [selectedCareerId, setSelectedCareerId] = useState<number>(careersData[0].id)
  const [activeSection, setActiveSection] = useState<string>('overview')

  const [personalization, setPersonalization] = useState<any>(null)
  const [loadingPersonalization, setLoadingPersonalization] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) return
    async function loadPersonalization() {
      try {
        setLoadingPersonalization(true)
        const pers = await skillifyGetJson<any>('/api/personalization', { token })
        setPersonalization(pers)
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingPersonalization(false)
      }
    }
    loadPersonalization()
  }, [])

  const selectedCareer = careersData.find((c) => c.id === selectedCareerId) ?? careersData[0]

  const renderActivePanel = () => {
    switch (activeSection) {
      case 'overview':
        return <CareerOverviewPanel career={selectedCareer} />
      case 'skills':
        return <RequiredSkillsPanel career={selectedCareer} />
      case 'roadmap':
        return <LearningRoadmapPanel career={selectedCareer} />
      case 'progress':
        return <LearningProgressPanel career={selectedCareer} />
      case 'projects':
        return <ProjectsPanel career={selectedCareer} />
      case 'resources':
        return <RecommendedResourcesPanel career={selectedCareer} />
      case 'certifications':
        return <CertificationsPanel career={selectedCareer} />
      case 'interview':
        return <InterviewQuestionsPanel career={selectedCareer} />
      case 'resume':
        return <ResumeGuidePanel career={selectedCareer} />
      case 'portfolio':
        return <PortfolioGuidePanel career={selectedCareer} />
      case 'companies':
        return <CompaniesHiringPanel career={selectedCareer} />
      case 'roles':
        return <JobRolesPanel career={selectedCareer} />
      case 'salary':
        return <SalaryInsightsPanel career={selectedCareer} />
      case 'timeline':
        return <LearningTimelinePanel career={selectedCareer} />
      case 'faq':
        return <FAQPanel career={selectedCareer} />
      default:
        return <CareerOverviewPanel career={selectedCareer} />
    }
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-slate-200">
      {/* App Navigation Sidebar */}
      <Sidebar />

      {/* Career Path Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel – Career Search Sidebar */}
        <CareerSidebar selectedCareerId={selectedCareerId} onSelect={setSelectedCareerId} />

        {/* Right Panel – Career Dashboard Details */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Top Hero Card */}
            <CareerHeader career={selectedCareer} />

            {/* 15 Button Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {gridButtons.map((btn) => {
                const BtnIcon = btn.icon
                const isActive = activeSection === btn.id
                return (
                  <motion.button
                    key={btn.id}
                    onClick={() => setActiveSection(btn.id)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group bg-white/5 backdrop-blur-md cursor-pointer ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.25)] text-white font-semibold'
                        : `border-white/10 text-gray-300 ${btn.color}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BtnIcon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-400' : ''}`} />
                      <span className="text-xs font-semibold leading-tight">{btn.title}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 ${isActive ? 'text-indigo-400' : 'text-gray-600'}`} />
                  </motion.button>
                )
              })}
            </div>

            {/* Active Section Content Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection + '-' + selectedCareerId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden"
              >
                {/* Background decorative glow */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {gridButtons.find((b) => b.id === activeSection)?.title}
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    {selectedCareer.name} Insights
                  </span>
                </div>

                {renderActivePanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Global Widget */}
      <ChatWidget />
    </div>
  )
}
