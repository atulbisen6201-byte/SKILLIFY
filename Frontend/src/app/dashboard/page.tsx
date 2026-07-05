'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAccessToken, getStoredUser } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { skillifyGetJson, skillifyPostJson, skillifyPutJson, skillifyDeleteJson } from '@/lib/skillify-api'
import {
  Sparkles,
  TrendingUp,
  FileText,
  Target,
  Clock,
  ChevronRight,
  Brain,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from 'recharts'

interface Course {
  id: string
  title: string
  description: string | null
  skillId: string
  skill?: { title: string }
}

interface Goal {
  id: string
  title: string
  completed: boolean
}

interface DashboardStatsData {
  careerScore: string
  resumeScore: string
  skillsMatched: string
  hoursLearned: string
  analyticsData: Array<{ name: string; applications: number; views: number; matches: number }>
  careerMatches: Array<{ title: string; company: string; match: number; salary: string }>
}

const recentActivity = [
  { type: 'resume', title: 'Resume updated', time: 'Just now', icon: FileText },
  { type: 'career', title: 'New career match found', time: '5 hours ago', icon: Briefcase },
  { type: 'skill', title: 'Skill assessment completed', time: '1 day ago', icon: GraduationCap },
  { type: 'achievement', title: 'Badge earned: Resume Pro', time: '2 days ago', icon: Award },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set())
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null)

  const [stats, setStats] = useState<DashboardStatsData | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [personalization, setPersonalization] = useState<any>(null)
  const [loadingPersonalization, setLoadingPersonalization] = useState(true)

  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [isAddingGoal, setIsAddingGoal] = useState(false)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      router.replace('/login')
      return
    }

    setUser(getStoredUser())

    let active = true
    async function loadData() {
      try {
        setLoadingCourses(true)
        setLoadingStats(true)
        setLoadingPersonalization(true)

        const coursesData = await skillifyGetJson<{ courses: Course[] }>('/api/courses')
        const enrollmentsData = await skillifyGetJson<{ enrollments: Array<{ courseId: string }> }>('/api/enrollments', { token })
        const statsData = await skillifyGetJson<DashboardStatsData>('/api/stats', { token })
        const goalsData = await skillifyGetJson<{ goals: Goal[] }>('/api/goals', { token })
        const personalizationData = await skillifyGetJson<any>('/api/personalization', { token })

        if (active) {
          setCourses(coursesData.courses)
          setEnrolledCourseIds(new Set(enrollmentsData.enrollments.map((e) => e.courseId)))
          setStats(statsData)
          setGoals(goalsData.goals)
          setPersonalization(personalizationData)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        if (active) {
          setLoadingCourses(false)
          setLoadingStats(false)
          setLoadingPersonalization(false)
        }
      }
    }
    loadData()
    return () => {
      active = false
    }
  }, [])

  const handleEnroll = async (courseId: string) => {
    const token = getAccessToken()
    if (!token) return

    try {
      setEnrollingCourseId(courseId)
      await skillifyPostJson('/api/enroll', { courseId }, { token })
      setEnrolledCourseIds((prev) => {
        const next = new Set(prev)
        next.add(courseId)
        return next
      })

      // Refresh stats
      const statsData = await skillifyGetJson<DashboardStatsData>('/api/stats', { token })
      setStats(statsData)
    } catch (err) {
      console.error('Failed to enroll in course:', err)
    } finally {
      setEnrollingCourseId(null)
    }
  }

  const handleToggleGoal = async (goalId: string, currentCompleted: boolean) => {
    const token = getAccessToken()
    if (!token) return

    try {
      await skillifyPutJson(`/api/goals/${goalId}`, { completed: !currentCompleted }, { token })
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, completed: !currentCompleted } : g))
      )
      // Refresh stats
      const statsData = await skillifyGetJson<DashboardStatsData>('/api/stats', { token })
      setStats(statsData)
    } catch (err) {
      console.error('Failed to toggle goal:', err)
    }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalTitle.trim()) return

    const token = getAccessToken()
    if (!token) return

    try {
      setIsAddingGoal(true)
      const res = await skillifyPostJson<{ goal: Goal }>('/api/goals', { title: newGoalTitle }, { token })
      setGoals((prev) => [...prev, res.goal])
      setNewGoalTitle('')
      // Refresh stats
      const statsData = await skillifyGetJson<DashboardStatsData>('/api/stats', { token })
      setStats(statsData)
    } catch (err) {
      console.error('Failed to add goal:', err)
    } finally {
      setIsAddingGoal(false)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    const token = getAccessToken()
    if (!token) return

    try {
      await skillifyDeleteJson(`/api/goals/${goalId}`, { token })
      setGoals((prev) => prev.filter((g) => g.id !== goalId))
      // Refresh stats
      const statsData = await skillifyGetJson<DashboardStatsData>('/api/stats', { token })
      setStats(statsData)
    } catch (err) {
      console.error('Failed to delete goal:', err)
    }
  }

  const completedGoalsCount = goals.filter((g) => g.completed).length

  return (
    <div className="min-h-screen p-4 pt-16 lg:p-8 lg:pt-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">
              Welcome back, {user?.name || 'Explorer'}!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s your career progress overview
            </p>
          </div>
          <Link href="/resume/new">
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              Optimize Resume
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              label: 'Profile Completion',
              value: personalization?.dashboard?.profileCompletion ? `${personalization.dashboard.profileCompletion}%` : '10%',
              change: 'Supabase Active',
              icon: TrendingUp,
              color: 'text-primary',
            },
            {
              label: 'Resume Score',
              value: personalization?.resumeAnalysis?.atsScore ? `${personalization.resumeAnalysis.atsScore}/100` : '0/100',
              change: 'ATS Analyzed',
              icon: FileText,
              color: 'text-accent',
            },
            {
              label: 'Skills Matched',
              value: personalization?.skills?.length ? `${personalization.skills.length} Skills` : '0 Skills',
              change: 'Extracted',
              icon: Target,
              color: 'text-chart-3',
            },
            {
              label: 'Experience Level',
              value: personalization?.experience?.length ? `${personalization.experience.length} Roles` : 'No Roles',
              change: 'Parsed',
              icon: Clock,
              color: 'text-chart-4',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                {loadingStats || loadingPersonalization ? (
                  <div className="h-7 w-12 animate-pulse rounded bg-secondary" />
                ) : (
                  <span className="text-2xl font-bold">{stat.value}</span>
                )}
                <span className="text-xs text-green-500">{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6 lg:col-span-2"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Career Analytics</h2>
              <select className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64">
              {loadingStats ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.analyticsData || []}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.28 265)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.65 0.28 265)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.7 0.22 280)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.7 0.22 280)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="oklch(0.65 0.28 265)"
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                    <Area
                      type="monotone"
                      dataKey="matches"
                      stroke="oklch(0.7 0.22 280)"
                      fillOpacity={1}
                      fill="url(#colorMatches)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Profile Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span className="text-muted-foreground">Career Matches</span>
              </div>
            </div>
          </motion.div>

          {/* Career Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Top Career Matches</h2>
              <Link href="/career-recommendation">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {loadingPersonalization || loadingStats ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />
                  ))}
                </div>
              ) : !personalization?.careerSuggestions || personalization.careerSuggestions.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center text-center">
                  <p className="text-xs text-muted-foreground">No matches generated yet. Upload a resume to match.</p>
                  <Link href="/resume/new" className="mt-2">
                    <Button size="sm" variant="outline">Upload Resume</Button>
                  </Link>
                </div>
              ) : (
                personalization.careerSuggestions.slice(0, 3).map((career: any) => (
                  <div
                    key={career.title}
                    className="flex items-center gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{career.title}</p>
                      <p className="text-xs text-muted-foreground">{career.salary} • {career.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{career.match}%</p>
                      <p className="text-xs text-muted-foreground">match</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Resume Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="mb-4 font-semibold">Resume Score</h2>
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="var(--secondary)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${
                      ((parseInt(stats?.resumeScore || '0') || 0) / 100) * 352
                    } 352`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.65 0.28 265)" />
                      <stop offset="100%" stopColor="oklch(0.7 0.22 280)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {parseInt(stats?.resumeScore || '0') || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">out of 100</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Content Completion</span>
                <span className="font-medium">
                  {parseInt(stats?.resumeScore || '0') >= 80 ? 'Excellent' : 'Needs Optimization'}
                </span>
              </div>
            </div>
            <Link href="/resume/new" className="mt-4 block">
              <Button variant="outline" className="w-full">
                Optimize Resume
              </Button>
            </Link>
          </motion.div>

          {/* Weekly Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Weekly Goals</h2>
              <span className="text-sm text-muted-foreground">
                {completedGoalsCount}/{goals.length} completed
              </span>
            </div>

            {/* Goals form */}
            <form onSubmit={handleAddGoal} className="mb-4 flex gap-2">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Add new weekly goal..."
                className="flex-1 rounded-xl border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
              />
              <Button type="submit" size="sm" disabled={isAddingGoal} className="px-2">
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {goals.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No goals configured for this week.</p>
              ) : (
                goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="group flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
                  >
                    <div
                      onClick={() => handleToggleGoal(goal.id, goal.completed)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                          goal.completed
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {goal.completed && (
                          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs ${goal.completed ? 'text-muted-foreground line-through' : ''}`}>
                        {goal.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              <h2 className="font-semibold">AI Personalization</h2>
            </div>
            
            {loadingPersonalization ? (
              <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Analyzing resume profile...</span>
              </div>
            ) : !personalization?.hasResume ? (
              <div className="space-y-3 py-2 text-center">
                <p className="text-xs text-muted-foreground">No active resume analyzed yet.</p>
                <Link href="/resume/new" className="inline-block">
                  <Button size="sm" variant="outline">Upload Resume</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Career Summary</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                    {personalization.dashboard.careerSummary}
                  </p>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-1.5">Strengths</h3>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {personalization.dashboard.strengths.length === 0 ? (
                        <li>• Complete profile details to identify strengths</li>
                      ) : (
                        personalization.dashboard.strengths.map((str: string) => (
                          <li key={str} className="flex items-start gap-1">
                            <span className="text-green-500 font-bold">✓</span>
                            <span>{str}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1.5">Areas to Improve</h3>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {personalization.dashboard.weaknesses.length === 0 ? (
                        <li>• No critical weaknesses detected</li>
                      ) : (
                        personalization.dashboard.weaknesses.map((weak: string) => (
                          <li key={weak} className="flex items-start gap-1">
                            <span className="text-orange-400 font-bold">•</span>
                            <span>{weak}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

                {personalization.dashboard.missingSkills.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-1.5">Missing Core Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {personalization.dashboard.missingSkills.map((skill: string) => (
                        <span key={skill} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Featured Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.43 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Featured Courses & Skill Paths</h2>
              <p className="text-sm text-muted-foreground">
                Enhance your matches by enrolling in courses targeted for your skill gaps
              </p>
            </div>
            <div className="flex h-8 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Supabase Live Sync</span>
            </div>
          </div>

          {loadingCourses ? (
            <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading latest courses...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No featured courses available.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {((personalization?.learning && personalization.learning.length > 0) ? personalization.learning : courses).map((course: any) => {
                const isEnrolled = enrolledCourseIds.has(course.id)
                const isEnrolling = enrollingCourseId === course.id
                return (
                  <div
                    key={course.id}
                    className="flex flex-col justify-between rounded-xl border border-border bg-gradient-to-br from-card to-secondary/30 p-5 transition-all hover:border-primary/30"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {course.skill?.title || 'General'}
                        </span>
                        {isEnrolled ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Enrolled
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Available</span>
                        )}
                      </div>
                      <h3 className="mt-3 font-semibold">{course.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {course.description || 'Develop high-demand professional competencies.'}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                      <div className="text-xs text-muted-foreground">
                        Skillify Certified Path
                      </div>
                      {isEnrolled ? (
                        <Button variant="secondary" size="sm" disabled className="gap-1">
                          Enrolled
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="glow gap-1"
                          onClick={() => handleEnroll(course.id)}
                          disabled={isEnrolling}
                        >
                          {isEnrolling ? (
                            <>
                              <div className="h-3 w-3 animate-spin rounded-full border border-primary-foreground border-t-transparent" />
                              <span>Enrolling...</span>
                            </>
                          ) : (
                            <>
                              <span>Enroll Now</span>
                              <ChevronRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="mb-4 font-semibold">Recent Activity</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.title}
                className="flex items-center gap-3 rounded-xl border border-border p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <activity.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
