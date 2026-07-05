'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAccessToken, getStoredUser, clearAuthSession } from '@/lib/auth-client'
import { skillifyGetJson, skillifyPutJson } from '@/lib/skillify-api'
import {
  User,
  Mail,
  MapPin,
  Globe,
  FileText,
  Briefcase,
  Settings,
  Edit2,
  Camera,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Heart,
  Award,
  Loader2,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { ChatWidget } from '@/components/chat-widget'
import { ThemeToggle } from '@/components/theme-toggle'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
]

const achievements = [
  { icon: Award, title: 'Resume Pro', description: 'Created 3+ resumes' },
  { icon: Heart, title: 'Community Star', description: '100+ helpful votes' },
  { icon: Briefcase, title: 'Career Explorer', description: 'Explored 10+ careers' },
]

interface SavedResume {
  id: string
  fullName: string
  updatedAt: string
  score: number
  projects?: Array<{
    id: string
    name: string
    description: string
    technologies?: string
    link?: string
  }>
}

interface ProfileData {
  bio: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  skills: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [preferredLanguage, setPreferredLanguage] = useState(languages[0])
  const [activeTab, setActiveTab] = useState('profile')
  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: '',
  })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<ProfileData>({
    bio: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: '',
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [careerMatches, setCareerMatches] = useState<any[]>([])

  useEffect(() => {
    setUser(getStoredUser())

    let active = true
    async function loadData() {
      const token = getAccessToken()
      if (!token) return

      try {
        setLoadingProfile(true)
        setLoadingResumes(true)

        // 1. Fetch Profile
        const profileData = await skillifyGetJson<{ profile: ProfileData }>('/api/profile', { token })
        if (active) {
          setProfile(profileData.profile)
          setEditForm(profileData.profile)
        }

        // 2. Fetch Resumes
        const resumesData = await skillifyGetJson<{ resumes: SavedResume[] }>('/api/resumes', { token })
        if (active) {
          setResumes(resumesData.resumes)
        }

        // 3. Fetch Career Matches (Stats)
        const statsData = await skillifyGetJson<any>('/api/stats', { token })
        if (active) {
          setCareerMatches(statsData.careerMatches || [])
        }
      } catch (err) {
        console.error('Failed to load profile data:', err)
      } finally {
        if (active) {
          setLoadingProfile(false)
          setLoadingResumes(false)
        }
      }
    }
    loadData()
    return () => {
      active = false
    }
  }, [])

  const handleSaveProfile = async () => {
    const token = getAccessToken()
    if (!token) return

    try {
      setIsSavingProfile(true)
      const res = await skillifyPutJson<{ profile: ProfileData }>('/api/profile', editForm, { token })
      setProfile(res.profile)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save profile:', err)
      alert(err instanceof Error ? err.message : 'Failed to save profile.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSignOut = () => {
    clearAuthSession()
    router.push('/login')
    router.refresh()
  }

  const skillsList = profile.skills
    ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen p-4 pt-16 lg:p-8 lg:pt-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Profile Header */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                {/* Avatar */}
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white">
                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AJ'}
                  </div>
                  <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-3 w-3" />
                        Edit Profile
                      </Button>
                    ) : (
                      <Button variant="default" size="sm" className="gap-2" onClick={handleSaveProfile} disabled={isSavingProfile}>
                        {isSavingProfile ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3" />
                        )}
                        Save Details
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {profile.bio || 'Career Explorer'}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user?.email || 'N/A'}
                    </div>
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      🇺🇸 United States
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold gradient-text">87</p>
                    <p className="text-xs text-muted-foreground">Career Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{resumes.length}</p>
                    <p className="text-xs text-muted-foreground">Resumes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{careerMatches.length}</p>
                    <p className="text-xs text-muted-foreground">Saved Careers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'resumes', label: 'Resumes', icon: FileText },
                { id: 'careers', label: 'Saved Careers', icon: Briefcase },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
              <div className="grid gap-6 lg:grid-cols-2">
                {isEditing ? (
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-4 lg:col-span-2">
                    <h2 className="font-semibold text-lg">Edit Profile Form</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Location</label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">LinkedIn URL</label>
                        <input
                          type="text"
                          value={editForm.linkedin}
                          onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">GitHub URL</label>
                        <input
                          type="text"
                          value={editForm.github}
                          onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Portfolio/Website</label>
                        <input
                          type="text"
                          value={editForm.portfolio}
                          onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Bio / Heading</label>
                      <input
                        type="text"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Skills (comma-separated)</label>
                      <textarea
                        value={editForm.skills}
                        onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                        Save Profile
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* About */}
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="mb-4 font-semibold">About</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {profile.bio || 'Provide a brief bio to tell other members about your career goals.'}
                      </p>
                    </div>

                    {/* Achievements */}
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="mb-4 font-semibold">Achievements</h2>
                      <div className="space-y-3">
                        {achievements.map((achievement) => (
                          <div
                            key={achievement.title}
                            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <achievement.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{achievement.title}</p>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="mb-4 font-semibold">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {skillsList.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No skills added yet. Edit your profile to list skills.</p>
                        ) : (
                          skillsList.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                            >
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Interests */}
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="mb-4 font-semibold">Links</h2>
                      <div className="space-y-2 text-sm">
                        {profile.linkedin && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">LinkedIn:</span>
                            <a href={profile.linkedin} target="_blank" className="text-primary hover:underline">{profile.linkedin}</a>
                          </div>
                        )}
                        {profile.github && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">GitHub:</span>
                            <a href={profile.github} target="_blank" className="text-primary hover:underline">{profile.github}</a>
                          </div>
                        )}
                        {profile.portfolio && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Portfolio:</span>
                            <a href={profile.portfolio} target="_blank" className="text-primary hover:underline">{profile.portfolio}</a>
                          </div>
                        )}
                        {!profile.linkedin && !profile.github && !profile.portfolio && (
                          <p className="text-xs text-muted-foreground">No personal links provided.</p>
                        )}
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="mb-4 font-semibold">Latest Projects</h2>
                      <div className="space-y-4">
                        {resumes.length === 0 || !resumes[0].projects || resumes[0].projects.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No projects found. Create or upload a resume with projects to view them here.</p>
                        ) : (
                          resumes[0].projects.map((project: any) => (
                            <div key={project.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-primary">{project.name}</h3>
                                {project.link && (
                                  <a 
                                    href={project.link.startsWith('http') ? project.link : `https://${project.link}`} 
                                    target="_blank" 
                                    className="text-xs text-primary/70 hover:text-primary hover:underline"
                                  >
                                    View Project
                                  </a>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{project.description}</p>
                              {project.technologies && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.technologies.split(',').map((tech: string) => (
                                    <span key={tech} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded">
                                      {tech.trim()}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'resumes' && (
              <div className="space-y-4">
                {loadingResumes ? (
                  <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading saved resumes...</span>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-2xl bg-card p-6 text-center">
                    No saved resumes found. Go to the Resume Builder to create one!
                  </div>
                ) : (
                  resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{resume.fullName || 'Untitled Resume'}</p>
                        <p className="text-sm text-muted-foreground">
                          Last Updated {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary">{resume.score}/100</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <Link href="/resume/new">
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'careers' && (
              <div className="space-y-4">
                {careerMatches.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No saved career recommendations found.</p>
                ) : (
                  careerMatches.map((career) => (
                    <div
                      key={career.title}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                        <Briefcase className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{career.title}</p>
                        <p className="text-sm text-muted-foreground">{career.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-accent">{career.match}%</p>
                        <p className="text-xs text-muted-foreground">Match</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Appearance */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 font-semibold">Appearance</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>

                {/* Language */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 font-semibold">Language Preference</h2>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setPreferredLanguage(lang)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${
                          preferredLanguage.code === lang.code
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border hover:bg-secondary'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other Settings */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 font-semibold">Account Settings</h2>
                  <div className="space-y-3">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors hover:bg-secondary text-destructive"
                    >
                      <LogOut className="h-5 w-5" />
                      <div className="flex-1">
                        <p className="font-medium">Sign Out</p>
                        <p className="text-sm text-muted-foreground">Log out of your account</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ChatWidget />
    </div>
  )
}
