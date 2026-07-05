// src/app/career-recommendation/components/DetailPanels.tsx
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  Code,
  GraduationCap,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Terminal,
  ExternalLink,
  Github,
  Youtube,
  FileText,
  CheckCircle2,
  Globe,
  Building2,
  DollarSign,
  Activity,
  HelpCircle,
  Trophy,
  Zap,
  Calendar,
  BookMarked,
  Users,
  Check,
  Badge,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Career, Skill, RoadmapPhase, ProjectItem, ResourceItem, CertificateItem, InterviewCategory, CompanyHiring } from '../data/careersData'

interface PanelProps {
  career: Career
}

// -----------------------------------------------------------------------------
// 1. CAREER OVERVIEW PANEL
// -----------------------------------------------------------------------------
export function CareerOverviewPanel({ career }: PanelProps) {
  const { overview } = career
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            Role Description
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">{overview.roleDescription}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            What This Role Does
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {overview.whatRoleDoes.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 mt-1 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-2">
          <span className="text-xs text-gray-400 uppercase font-semibold">Average Salary</span>
          <p className="text-2xl font-bold text-white gradient-text">{career.averageSalary}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-2">
          <span className="text-xs text-gray-400 uppercase font-semibold">Demand Level</span>
          <p className="text-2xl font-bold text-white gradient-text">{career.demand}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-2">
          <span className="text-xs text-gray-400 uppercase font-semibold">Required Education</span>
          <p className="text-sm text-white font-medium line-clamp-2 mt-1">{overview.education}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-indigo-300">Future Scope & Market Trends</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{overview.futureScope}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {overview.industries.map((ind, i) => (
            <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-full">
              {ind}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-2xl p-6 space-y-3">
          <h4 className="text-md font-bold text-emerald-400">Pros</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {overview.pros.map((pro, i) => (
              <li key={i} className="flex gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-rose-950/20 border border-rose-500/10 rounded-2xl p-6 space-y-3">
          <h4 className="text-md font-bold text-rose-400">Cons</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {overview.cons.map((con, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-rose-400 shrink-0 font-bold">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 2. REQUIRED SKILLS PANEL
// -----------------------------------------------------------------------------
export function RequiredSkillsPanel({ career }: PanelProps) {
  const [expandedSkillIdx, setExpandedSkillIdx] = useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="grid gap-4 md:grid-cols-2"
    >
      {career.skills.map((skill, idx) => {
        const isExpanded = expandedSkillIdx === idx
        return (
          <div
            key={skill.name}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <Code className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-md">{skill.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    {skill.difficulty}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                    {skill.importance}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-400 mb-4">
                <div className="flex justify-between">
                  <span>Learning Time:</span>
                  <span className="text-white font-medium">{skill.learningTime}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress:</span>
                    <span>{skill.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3">
              <button
                onClick={() => setExpandedSkillIdx(isExpanded ? null : idx)}
                className="w-full flex items-center justify-between text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                <span>{isExpanded ? 'Hide Core Topics' : 'Show Core Topics'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-250 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2.5 space-y-1.5 text-xs text-gray-300 overflow-hidden"
                  >
                    {skill.topics.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2 pl-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 3. LEARNING ROADMAP PANEL
// -----------------------------------------------------------------------------
export function LearningRoadmapPanel({ career }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="relative pl-6 border-l-2 border-indigo-500/20 space-y-8"
    >
      {career.roadmap.map((phase, idx) => (
        <div key={idx} className="relative">
          {/* Node dot icon */}
          <div className="absolute -left-[33px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A0A0A] border-2 border-indigo-500">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl hover:border-indigo-500/20 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{phase.phase}</span>
                <h4 className="text-lg font-bold text-white">{phase.title}</h4>
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                  ⏱ {phase.duration}
                </span>
                <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300 font-semibold flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  {phase.completionBadge}
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <span className="text-xs text-gray-400 font-semibold uppercase">Skills Covered</span>
                <div className="flex flex-wrap gap-1.5">
                  {phase.skills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-800/60 rounded text-xs text-gray-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs text-gray-400 font-semibold uppercase">Mini Projects</span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {phase.miniProjects.map((proj, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span>{proj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 4. LEARNING PROGRESS PANEL
// -----------------------------------------------------------------------------
export function LearningProgressPanel({ career }: PanelProps) {
  const stats = career.progressStats
  const radius = 50
  const stroke = 8
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (career.progress / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="grid gap-6 md:grid-cols-3"
    >
      {/* Circular Progress widget */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl space-y-4">
        <h4 className="font-bold text-white text-md">Overall Learning Progress</h4>
        <div className="relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="rgba(255,255,255,0.05)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="url(#progressGradient)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-xl font-bold text-white">{career.progress}%</div>
        </div>
        <div className="text-xs text-gray-400">Keep it up! Complete projects to earn XP.</div>
      </div>

      {/* Daily streak & XP points */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-white text-md">Daily Streak</h4>
          <span className="flex items-center gap-1 text-orange-400 font-semibold text-sm">
            <Zap className="h-4 w-4 fill-current" />
            {stats.streak} Days
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Experience:</span>
            <span className="text-white font-bold">{stats.xp} XP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Weekly Goal:</span>
            <span className="text-white font-semibold">{stats.weeklyGoal}</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-400" style={{ width: '80%' }} />
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
        <h4 className="font-bold text-white text-md flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Achievement Badges
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {stats.badges.map((badge, i) => (
            <div
              key={i}
              className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
              title={badge}
            >
              <Award className="h-6 w-6 text-indigo-400 mb-1" />
              <span className="text-[9px] text-gray-300 font-semibold line-clamp-1">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 5. PROJECTS PANEL
// -----------------------------------------------------------------------------
export function ProjectsPanel({ career }: PanelProps) {
  const [activeTab, setActiveTab] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const projectsList = career.projects[activeTab] || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6"
    >
      {/* Tabs list */}
      <div className="flex border-b border-white/10 p-1 bg-white/5 rounded-xl max-w-md">
        {(['beginner', 'intermediate', 'advanced'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projectsList.map((project, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            {/* Visual preview placeholder */}
            <div className={`h-40 w-full bg-gradient-to-br from-indigo-950 to-blue-900 flex items-center justify-center relative`}>
              <Terminal className="h-12 w-12 text-indigo-300/40" />
              <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-black/60 rounded text-gray-300 capitalize">
                {project.difficulty}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white">{project.title}</h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.skillsUsed.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] text-indigo-300">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-300">
                <div className="text-xs uppercase font-semibold text-gray-400">Learning Outcomes</div>
                <ul className="space-y-1.5 text-xs">
                  {project.outcomes.map((out, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <Check className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2 text-xs" onClick={() => window.open(project.githubUrl)}>
                  <Github className="h-4 w-4" />
                  GitHub Code
                </Button>
                <Button size="sm" className="flex-1 gap-2 text-xs bg-indigo-600 hover:bg-indigo-700" onClick={() => window.open(project.demoUrl)}>
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 6. RECOMMENDED RESOURCES PANEL
// -----------------------------------------------------------------------------
export function RecommendedResourcesPanel({ career }: PanelProps) {
  const sections = [
    { key: 'youtube', title: 'YouTube Tutorials', icon: Youtube, color: 'text-rose-500' },
    { key: 'documentation', title: 'Official Documentation', icon: BookMarked, color: 'text-emerald-500' },
    { key: 'books', title: 'Recommended Books', icon: BookOpen, color: 'text-amber-500' },
    { key: 'courses', title: 'Interactive Courses', icon: GraduationCap, color: 'text-blue-500' },
    { key: 'blogs', title: 'Technical Blogs', icon: FileText, color: 'text-indigo-500' },
    { key: 'communities', title: 'Developer Communities', icon: Users, color: 'text-purple-500' },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6"
    >
      {sections.map((sect) => {
        const items: ResourceItem[] = career.resources[sect.key] || []
        if (items.length === 0) return null
        const SectIcon = sect.icon

        return (
          <div key={sect.key} className="space-y-3">
            <h4 className="text-md font-bold text-white flex items-center gap-2">
              <SectIcon className={`h-5 w-5 ${sect.color}`} />
              {sect.title}
            </h4>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/20 transition-all shadow-lg"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{item.difficulty}</span>
                    <h5 className="font-semibold text-white text-sm line-clamp-1">{item.title}</h5>
                    <p className="text-xs text-gray-400">By {item.author}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 gap-1 text-xs text-indigo-300 hover:text-indigo-200 border border-white/5 hover:border-indigo-500/20 bg-white/5 w-full"
                    onClick={() => window.open(item.url)}
                  >
                    Visit Resource
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 7. CERTIFICATIONS PANEL
// -----------------------------------------------------------------------------
export function CertificationsPanel({ career }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="grid gap-4 md:grid-cols-2"
    >
      {career.certifications.map((cert, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-indigo-500/30 transition-all"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{cert.provider}</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {cert.recognition}
              </span>
            </div>
            <h4 className="text-md font-bold text-white">{cert.name}</h4>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Estimated Duration: {cert.duration}</span>
              <span>Level: {cert.difficulty}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 gap-2 text-xs border-indigo-500/30 hover:bg-indigo-600/10"
            onClick={() => window.open(cert.url)}
          >
            Visit Course Registry
            <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
          </Button>
        </div>
      ))}
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 8. INTERVIEW QUESTIONS PANEL
// -----------------------------------------------------------------------------
export function InterviewQuestionsPanel({ career }: PanelProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-4"
    >
      {career.interviewQuestions.map((cat, idx) => {
        const isExpanded = activeCategory === idx
        return (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setActiveCategory(isExpanded ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
              <div>
                <h4 className="font-bold text-white text-md">{cat.category}</h4>
                <div className="flex gap-3 text-xs text-gray-400 mt-1">
                  <span>{cat.questionsCount} Standard Questions</span>
                  <span>•</span>
                  <span className="text-indigo-300 font-medium">{cat.difficulty}</span>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5 overflow-hidden"
                >
                  <div className="p-5 space-y-4 bg-black/20">
                    {cat.questions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <div className="text-sm font-semibold text-white flex gap-2">
                          <span className="text-indigo-400">Q:</span>
                          <span>{q.q}</span>
                        </div>
                        <div className="text-xs text-gray-300 leading-relaxed pl-6 flex gap-2">
                          <span className="text-blue-400 font-semibold">A:</span>
                          <span>{q.a}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 9. RESUME GUIDE PANEL
// -----------------------------------------------------------------------------
export function ResumeGuidePanel({ career }: PanelProps) {
  const guide = career.resumeGuide
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="grid gap-6 md:grid-cols-2"
    >
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h4 className="font-bold text-white text-md flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-400" />
          Resume Optimization Checklist
        </h4>
        <ul className="space-y-2 text-sm text-gray-300">
          {guide.checklist.map((item, i) => (
            <li key={i} className="flex gap-2">
              <Check className="h-4 w-4 text-indigo-400 mt-1 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <h4 className="font-bold text-white text-md flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-400" />
            ATS (Applicant Tracking System) Tips
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {guide.atsTips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <Check className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          Download PDF Resume Template
        </Button>
      </div>
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 10. PORTFOLIO GUIDE PANEL
// -----------------------------------------------------------------------------
export function PortfolioGuidePanel({ career }: PanelProps) {
  const guide = career.portfolioGuide
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="grid gap-6 md:grid-cols-2"
    >
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h4 className="font-bold text-white text-md flex items-center gap-2">
          <Globe className="h-5 w-5 text-indigo-400" />
          Key Portfolio Sections
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {guide.sections.map((sect, i) => (
            <div key={i} className="p-2.5 bg-gray-800/60 rounded-xl flex items-center gap-2 border border-white/5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-gray-300 text-xs font-semibold">{sect}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h4 className="font-bold text-white text-md flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-blue-400" />
          Portfolio Build Guidelines
        </h4>
        <ul className="space-y-2.5 text-sm text-gray-300">
          {guide.checklists.map((check, i) => (
            <li key={i} className="flex gap-2">
              <Check className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 11. COMPANIES HIRING PANEL
// -----------------------------------------------------------------------------
export function CompaniesHiringPanel({ career }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {career.companiesDetails.map((company, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-indigo-500/20 transition-all"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center font-bold text-white text-lg">
                {company.logo}
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {company.status}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-white text-md">{company.name}</h4>
              <p className="text-xs text-gray-400 mt-1">Average Pay: {company.avgSalary}</p>
              <p className="text-xs text-indigo-300 mt-0.5">{company.openRoles} Active Job Openings</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-4 gap-1 text-xs text-indigo-300 hover:text-indigo-200 border border-white/5 bg-white/5"
            onClick={() => window.open(company.careersUrl)}
          >
            Visit Careers
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 12. JOB ROLES PANEL
// -----------------------------------------------------------------------------
export function JobRolesPanel({ career }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4"
    >
      <h4 className="font-bold text-white text-md flex items-center gap-2">
        <Building2 className="h-5 w-5 text-indigo-400" />
        Hiring Job Titles
      </h4>
      <div className="flex flex-wrap gap-2.5">
        {career.jobRoles.map((role, i) => (
          <span
            key={i}
            className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm font-semibold text-indigo-200 flex items-center gap-2 hover:bg-indigo-500/20 transition-all hover:scale-102 cursor-default"
          >
            <Briefcase className="h-4 w-4 text-indigo-400" />
            {role}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 13. SALARY INSIGHTS PANEL
// -----------------------------------------------------------------------------
export function SalaryInsightsPanel({ career }: PanelProps) {
  const insights = career.salaryInsights
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Experience insights */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h4 className="font-bold text-white text-md flex items-center gap-2 border-b border-white/5 pb-2">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            Salary By Experience
          </h4>
          <div className="space-y-3">
            {insights.experience.map((pt, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{pt.level}</span>
                <span className="text-white font-bold">{pt.salary}/yr</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global insights */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h4 className="font-bold text-white text-md flex items-center gap-2 border-b border-white/5 pb-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Salary By Region
          </h4>
          <div className="space-y-3">
            {insights.country.map((pt, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{pt.name}</span>
                <span className="text-white font-bold">{pt.salary}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Trend representation */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h4 className="font-bold text-white text-md flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            Annual Salary Trend
          </h4>
          <div className="flex items-end justify-between h-32 pt-4 px-2">
            {insights.trend.map((t, i) => {
              const maxVal = Math.max(...insights.trend.map((tr) => tr.salary))
              const minVal = Math.min(...insights.trend.map((tr) => tr.salary))
              const percent = maxVal > 0 ? (t.salary / maxVal) * 100 : 0
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-[10px] text-gray-300 font-bold">${Math.round(t.salary / 1000)}k</div>
                  <div className="w-8 bg-indigo-500/40 border border-indigo-400/30 rounded-t-md hover:bg-indigo-500 transition-colors" style={{ height: `${percent * 0.7}px` }} />
                  <div className="text-xs text-gray-400">{t.year}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Highest paying companies */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <h4 className="font-bold text-white text-md flex items-center gap-2 border-b border-white/5 pb-2">
            <DollarSign className="h-5 w-5 text-yellow-400" />
            Highest Paying Tech Companies
          </h4>
          <div className="space-y-3">
            {insights.highestPaying.map((comp, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-300 font-semibold">{comp.company}</span>
                <span className="text-white font-bold bg-indigo-600/20 border border-indigo-500/20 px-2.5 py-0.5 rounded text-xs">
                  {comp.salary}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 14. LEARNING TIMELINE PANEL
// -----------------------------------------------------------------------------
export function LearningTimelinePanel({ career }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="grid gap-6 md:grid-cols-2"
    >
      {career.timeline.map((step, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/20 transition-all space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-sm font-bold text-indigo-300 uppercase tracking-wider">{step.month}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
              {i + 1}
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Skills Focused</span>
              <div className="flex flex-wrap gap-1.5">
                {step.skills.map((sk, skIdx) => (
                  <span key={skIdx} className="px-2 py-0.5 bg-gray-800/60 rounded text-xs text-gray-300">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Key Milestones</span>
              <ul className="space-y-1 text-xs text-gray-300">
                {step.milestones.map((miles, mIdx) => (
                  <li key={mIdx} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{miles}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// 15. FAQ PANEL
// -----------------------------------------------------------------------------
export function FAQPanel({ career }: PanelProps) {
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-4"
    >
      {career.faqs.map((faq, idx) => {
        const isOpen = activeFaqIdx === idx
        return (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
              <h4 className="font-bold text-white text-sm flex gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5 overflow-hidden"
                >
                  <p className="p-5 text-xs text-gray-300 leading-relaxed bg-black/20">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </motion.div>
  )
}
