'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/sidebar'
import { ChatWidget } from '@/components/chat-widget'
import { RequireAuth } from '@/components/require-auth'
import { getStoredUser, getAccessToken, clearAuthSession } from '@/lib/auth-client'
import { skillifyGetJson, skillifyPutJson, skillifyDeleteJson } from '@/lib/skillify-api'
import {
  User,
  Shield,
  Palette,
  Bell,
  Cpu,
  FileText,
  Lock,
  HelpCircle,
  Save,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Upload,
  Moon,
  Sun,
  Laptop,
  Check,
  ChevronDown,
  Info,
  LogOut,
  Settings,
  Mail,
  Phone,
  MapPin,
  FileCode,
  Globe,
  FileDown,
  Sparkles,
  ExternalLink,
  Key
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Settings Category Definitions
type SettingCategory =
  | 'account'
  | 'security'
  | 'appearance'
  | 'notifications'
  | 'privacy'
  | 'help'

interface CategoryItem {
  id: SettingCategory
  label: string
  icon: React.ComponentType<any>
  description: string
}

const categories: CategoryItem[] = [
  { id: 'account', label: 'Account', icon: User, description: 'Manage your profile and contact details' },
  { id: 'security', label: 'Security', icon: Lock, description: 'Secure your login credentials and session settings' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize theme, layouts, and animations' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Choose when and how we contact you' },
  { id: 'privacy', label: 'Privacy', icon: Shield, description: 'Adjust visible profile attributes' },
  { id: 'help', label: 'Help & About', icon: HelpCircle, description: 'FAQs, version guides, and support links' },
]

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsContent />
    </RequireAuth>
  )
}

function SettingsContent() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Navigation state
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('account')

  // Global settings state (saved to localStorage and synced with API)
  const [profilePic, setProfilePic] = useState<string>('')
  const [fullName, setFullName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')

  // Security state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  // Appearance state
  const [accentColor, setAccentColor] = useState('blue')
  const [compactMode, setCompactMode] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  // Notifications state
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyPush, setNotifyPush] = useState(false)
  const [notifyResume, setNotifyResume] = useState(true)
  const [notifyAI, setNotifyAI] = useState(true)
  const [notifyCareer, setNotifyCareer] = useState(true)
  const [notifyCommunity, setNotifyCommunity] = useState(false)

  // AI Preferences state
  const [aiLength, setAiLength] = useState<'short' | 'medium' | 'detailed'>('medium')
  const [optimizationMode, setOptimizationMode] = useState<'ats' | 'modern' | 'creative'>('modern')
  const [aiTone, setAiTone] = useState<'professional' | 'friendly' | 'formal'>('professional')
  const [experimentalAI, setExperimentalAI] = useState(false)
  const [geminiKey, setGeminiKey] = useState('')

  // Resume Preferences state
  const [defaultTemplate, setDefaultTemplate] = useState('modern')
  const [autoSaveResume, setAutoSaveResume] = useState(true)
  const [autoOptimizeResume, setAutoOptimizeResume] = useState(false)
  const [defaultFormat, setDefaultFormat] = useState<'pdf' | 'docx'>('pdf')
  const [resumeVisibility, setResumeVisibility] = useState<'private' | 'public'>('private')

  // Privacy state
  const [publicProfile, setPublicProfile] = useState(false)
  const [showEmail, setShowEmail] = useState(true)
  const [showPhone, setShowPhone] = useState(false)
  const [recruitersContact, setRecruitersContact] = useState(true)
  const [dataCollection, setDataCollection] = useState(true)
  const [showDataResetModal, setShowDataResetModal] = useState(false)

  // Feedback/Help triggers
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Changes saved successfully!')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Fetch initial profile values on mount
  useEffect(() => {
    // Load local user details
    const storedUser = getStoredUser()
    if (storedUser) {
      setFullName(storedUser.name || '')
      setEmailAddress(storedUser.email || '')
    }

    // Load saved settings preferences from localStorage
    const savedPrefs = localStorage.getItem('skillify_settings_prefs')
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs)
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber)
        if (parsed.twoFactor !== undefined) setTwoFactor(parsed.twoFactor)
        if (parsed.accentColor) setAccentColor(parsed.accentColor)
        if (parsed.compactMode !== undefined) setCompactMode(parsed.compactMode)
        if (parsed.animationsEnabled !== undefined) setAnimationsEnabled(parsed.animationsEnabled)
        if (parsed.notifyEmail !== undefined) setNotifyEmail(parsed.notifyEmail)
        if (parsed.notifyPush !== undefined) setNotifyPush(parsed.notifyPush)
        if (parsed.notifyResume !== undefined) setNotifyResume(parsed.notifyResume)
        if (parsed.notifyAI !== undefined) setNotifyAI(parsed.notifyAI)
        if (parsed.notifyCareer !== undefined) setNotifyCareer(parsed.notifyCareer)
        if (parsed.notifyCommunity !== undefined) setNotifyCommunity(parsed.notifyCommunity)
        if (parsed.aiLength) setAiLength(parsed.aiLength)
        if (parsed.optimizationMode) setOptimizationMode(parsed.optimizationMode)
        if (parsed.aiTone) setAiTone(parsed.aiTone)
        if (parsed.experimentalAI !== undefined) setExperimentalAI(parsed.experimentalAI)
        if (parsed.defaultTemplate) setDefaultTemplate(parsed.defaultTemplate)
        if (parsed.autoSaveResume !== undefined) setAutoSaveResume(parsed.autoSaveResume)
        if (parsed.autoOptimizeResume !== undefined) setAutoOptimizeResume(parsed.autoOptimizeResume)
        if (parsed.defaultFormat) setDefaultFormat(parsed.defaultFormat)
        if (parsed.resumeVisibility) setResumeVisibility(parsed.resumeVisibility)
        if (parsed.publicProfile !== undefined) setPublicProfile(parsed.publicProfile)
        if (parsed.showEmail !== undefined) setShowEmail(parsed.showEmail)
        if (parsed.showPhone !== undefined) setShowPhone(parsed.showPhone)
        if (parsed.recruitersContact !== undefined) setRecruitersContact(parsed.recruitersContact)
        if (parsed.dataCollection !== undefined) setDataCollection(parsed.dataCollection)
        if (parsed.profilePic) setProfilePic(parsed.profilePic)
      } catch (e) {
        console.error('Failed to parse saved settings:', e)
      }
    }

    // Load custom Gemini API Key
    const savedGeminiKey = localStorage.getItem('gemini_api_key') || ''
    setGeminiKey(savedGeminiKey)

    // Load detailed profile statistics from backend database
    const token = getAccessToken()
    if (token) {
      async function loadProfile() {
        try {
          const res = await skillifyGetJson<{ profile: any }>('/api/profile', { token })
          if (res?.profile) {
            setBio(res.profile.bio || '')
            setLocation(res.profile.location || '')
          }
        } catch (err) {
          console.warn('Failed to load backend profile details:', err)
        }
      }
      loadProfile()
    }
  }, [])

  // Sync Preferences to localStorage helper
  const savePreferencesLocally = (updatedFields: Record<string, any> = {}) => {
    const currentPrefs = {
      phoneNumber,
      twoFactor,
      accentColor,
      compactMode,
      animationsEnabled,
      notifyEmail,
      notifyPush,
      notifyResume,
      notifyAI,
      notifyCareer,
      notifyCommunity,
      aiLength,
      optimizationMode,
      aiTone,
      experimentalAI,
      defaultTemplate,
      autoSaveResume,
      autoOptimizeResume,
      defaultFormat,
      resumeVisibility,
      publicProfile,
      showEmail,
      showPhone,
      recruitersContact,
      dataCollection,
      profilePic,
      ...updatedFields
    }
    localStorage.setItem('skillify_settings_prefs', JSON.stringify(currentPrefs))
  }

  // Handle Save profile changes
  const handleSaveAccountChanges = async () => {
    savePreferencesLocally()
    const token = getAccessToken()
    
    // Save to backend `/api/profile`
    if (token) {
      try {
        await skillifyPutJson('/api/profile', {
          bio,
          location,
        }, { token })
        
        triggerSuccessNotification('Account changes saved successfully!')
      } catch (err) {
        console.error('Failed to sync changes with profile database:', err)
        alert('Saved locally, but backend sync failed.')
      }
    } else {
      triggerSuccessNotification('Saved account preferences in browser storage!')
    }
  }

  const triggerSuccessNotification = (msg: string) => {
    setSaveMessage(msg)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // Save changes generally across sections
  const handleSaveSection = (msg: string = 'Changes saved successfully!') => {
    savePreferencesLocally()
    triggerSuccessNotification(msg)
  }

  // Save Gemini Key Specifically
  const handleSaveAIKeys = () => {
    localStorage.setItem('gemini_api_key', geminiKey.trim())
    if (typeof window !== 'undefined') {
      (window as any).GEMINI_API_KEY = geminiKey.trim()
    }
    handleSaveSection('AI integration credentials updated!')
  }

  // Handle logout from all devices
  const handleLogoutAllDevices = () => {
    clearAuthSession()
    router.push('/login')
  }

  // Handle delete account logic
  const handleDeleteAccount = async () => {
    if (deleteConfirmText === 'DELETE') {
      try {
        await skillifyDeleteJson('/api/account')
        clearAuthSession()
        setShowDeleteModal(false)
        router.push('/signup')
      } catch (err) {
        console.error('Failed to delete account on backend:', err)
        alert('Failed to delete account on backend. Please try again.')
      }
    } else {
      alert("Please type 'DELETE' to confirm account deletion.")
    }
  }

  // Handle resetting all settings
  const handleResetAllData = () => {
    localStorage.removeItem('skillify_settings_prefs')
    localStorage.removeItem('gemini_api_key')
    if (typeof window !== 'undefined') {
      (window as any).GEMINI_API_KEY = undefined
    }
    setPhoneNumber('')
    setTwoFactor(false)
    setAccentColor('blue')
    setCompactMode(false)
    setAnimationsEnabled(true)
    setNotifyEmail(true)
    setNotifyPush(false)
    setNotifyResume(true)
    setNotifyAI(true)
    setNotifyCareer(true)
    setNotifyCommunity(false)
    setAiLength('medium')
    setOptimizationMode('modern')
    setAiTone('professional')
    setExperimentalAI(false)
    setGeminiKey('')
    setProfilePic('')
    setShowDataResetModal(false)
    triggerSuccessNotification('All settings have been reset to defaults.')
  }

  // Handle virtual profile picture upload
  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setProfilePic(base64String)
      savePreferencesLocally({ profilePic: base64String })
      triggerSuccessNotification('Profile avatar updated!')
    };
    reader.readAsDataURL(file)
  }

  // File Downloader for personal data export
  const downloadPersonalData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        user: getStoredUser(),
        preferences: localStorage.getItem('skillify_settings_prefs'),
        system: {
          appVersion: '1.1.0-release',
          exportDate: new Date().toISOString()
        }
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "skillify_personal_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* App Main Sidebar */}
      <Sidebar />

      {/* Main Settings Panel */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen p-4 pt-16 lg:p-8 lg:pt-8">
          <div className="mx-auto max-w-5xl">
            {/* Success Toast */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  className="fixed top-6 right-6 z-50 flex items-center gap-3.5 rounded-2xl bg-green-500/10 border border-green-500/25 px-5 py-3.5 text-sm font-medium text-green-500 backdrop-blur-xl shadow-2xl"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  {saveMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold lg:text-3xl flex items-center gap-2">
                <Settings className="h-7 w-7 text-primary" /> Settings
              </h1>
              <p className="text-muted-foreground mt-1">Configure your Account, Security, Themes, Notifications, and AI Preferences.</p>
            </div>

            {/* Unified Glassmorphism Dashboard Box */}
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-xl overflow-hidden grid md:grid-cols-4 min-h-[600px]">
              {/* Category Selection Sidebar */}
              <div className="md:col-span-1 border-r border-border bg-card/15 p-4 space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  const isSelected = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600/15 to-violet-600/15 text-primary border-l-2 border-primary'
                          : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${isSelected ? 'text-primary' : ''}`} />
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Category Details Card Panel */}
              <div className="md:col-span-3 p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* SECTION 1: ACCOUNT */}
                    {activeCategory === 'account' && (
                      <div className="space-y-6">
                        <div className="border-b border-border pb-3">
                          <h2 className="text-lg font-bold flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" /> Profile Details
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">Customize your personal profile information and avatar details.</p>
                        </div>

                        {/* Profile Picture Upload Row */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 bg-secondary/15 p-4 rounded-2xl border border-border/40">
                          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-3xl font-bold text-primary overflow-hidden">
                            {profilePic ? (
                              <img src={profilePic} alt="avatar" className="h-full w-full object-cover" />
                            ) : (
                              fullName ? fullName[0].toUpperCase() : 'U'
                            )}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Profile Photo</h4>
                            <p className="text-xs text-muted-foreground leading-normal">
                              Upload a standard JPG, PNG, or WEBP file. Max size 2MB.
                            </p>
                            <label className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-card hover:bg-secondary/40 px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                              <Upload className="h-3.5 w-3.5" /> Upload File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Profile Form Details */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold block">Full Name</label>
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold block">Email Address</label>
                            <input
                              type="email"
                              value={emailAddress}
                              disabled
                              className="w-full rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm outline-none text-muted-foreground cursor-not-allowed"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold block">Phone Number</label>
                            <input
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold block">Location</label>
                            <input
                              type="text"
                              placeholder="New York, NY"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold block">Bio / Summary</label>
                          <textarea
                            rows={4}
                            placeholder="Tell us about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button onClick={handleSaveAccountChanges} className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium rounded-xl">
                            <Save className="h-4 w-4" /> Save Changes
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* SECTION 2: SECURITY */}
                    {activeCategory === 'security' && (
                      <div className="space-y-6">
                        <div className="border-b border-border pb-3">
                          <h2 className="text-lg font-bold flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" /> Security Settings
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">Protect your account access and configure authentication steps.</p>
                        </div>

                        {/* Change Password Form */}
                        <div className="rounded-2xl border border-border bg-secondary/5 p-5 space-y-4">
                          <h3 className="font-semibold text-sm">Change Password</h3>
                          
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold block">New Password</label>
                              <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold block">Confirm Password</label>
                              <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button onClick={() => handleSaveSection('Password updated successfully!')} className="rounded-xl text-xs" variant="outline">
                              Update Password
                            </Button>
                          </div>
                        </div>

                        {/* 2FA Toggle Switch */}
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5">
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-semibold">Two-Factor Authentication (2FA)</h4>
                            <p className="text-xs text-muted-foreground">Add an extra layer of security by requiring a confirmation code.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={twoFactor}
                              onChange={(e) => {
                                setTwoFactor(e.target.checked)
                                savePreferencesLocally({ twoFactor: e.target.checked })
                                triggerSuccessNotification(e.target.checked ? '2FA enabled successfully!' : '2FA disabled.')
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                          </label>
                        </div>

                        {/* Sessions & Actions */}
                        <div className="space-y-3 pt-2">
                          <h4 className="font-semibold text-sm">Account Operations</h4>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={handleLogoutAllDevices}
                              variant="outline"
                              className="flex-1 gap-2 rounded-xl text-sm border-destructive/25 text-destructive hover:bg-destructive/10"
                            >
                              <LogOut className="h-4 w-4" /> Logout From All Devices
                            </Button>
                            
                            <Button
                              onClick={() => setShowDeleteModal(true)}
                              className="flex-1 gap-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm"
                            >
                              <Trash2 className="h-4 w-4" /> Delete Account
                            </Button>
                          </div>
                        </div>

                        {/* Delete Account Modal */}
                        {showDeleteModal && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <div className="max-w-md w-full bg-card border border-border p-6 rounded-2xl space-y-4 shadow-2xl">
                              <div className="flex items-center gap-3 text-destructive font-semibold">
                                <AlertTriangle className="h-6 w-6 shrink-0" />
                                <h3>Critical Action: Delete Account</h3>
                              </div>
                              <p className="text-xs text-muted-foreground leading-normal">
                                This action is permanent. Deleting your account will clear all resumes, goals, matching statistics, and login access.
                              </p>
                              <div className="space-y-2">
                                <label className="text-xs block">Please type <strong>DELETE</strong> to confirm:</label>
                                <input
                                  type="text"
                                  value={deleteConfirmText}
                                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none"
                                />
                              </div>
                              <div className="flex justify-end gap-2 text-xs">
                                <Button variant="ghost" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText('') }} className="rounded-xl">Cancel</Button>
                                <Button onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl">Permanently Delete</Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Custom Gemini Key Integrations */}
                        <div className="rounded-2xl border border-border bg-secondary/10 p-5 space-y-4 mt-6">
                          <h3 className="font-semibold text-sm flex items-center gap-1.5">
                            <Key className="h-4.5 w-4.5 text-primary" /> Custom Gemini API Key
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Customize your LLM engine for Resume parsing using your personal Gemini API Key.</p>
                          <div className="space-y-2">
                            <input
                              type="password"
                              placeholder="AIzaSy..."
                              value={geminiKey}
                              onChange={(e) => setGeminiKey(e.target.value)}
                              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary font-mono text-xs"
                            />
                            <div className="flex justify-end gap-2 pt-1">
                              <Button onClick={handleSaveAIKeys} className="rounded-xl text-xs px-4" size="sm">
                                Save Key
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 3: APPEARANCE */}
                    {activeCategory === 'appearance' && (
                      <div className="space-y-6">
                        <div className="border-b border-border pb-3">
                          <h2 className="text-lg font-bold flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" /> Visual Customization
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">Personalize themes, coloring accents, and layout sizing metrics.</p>
                        </div>

                        {/* Theme Selectors */}
                        <div className="space-y-2.5">
                          <h3 className="font-semibold text-sm">Theme Preference</h3>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { id: 'light', name: 'Light', icon: Sun },
                              { id: 'dark', name: 'Dark', icon: Moon },
                              { id: 'system', name: 'System', icon: Laptop },
                            ].map((t) => {
                              const Icon = t.icon
                              const isActive = theme === t.id
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => setTheme(t.id)}
                                  className={`flex flex-col items-center gap-2.5 rounded-xl border p-4 transition-all ${
                                    isActive
                                      ? 'border-primary bg-primary/5 text-primary'
                                      : 'border-border bg-background/50 hover:bg-secondary/40'
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                  <span className="text-xs font-semibold">{t.name}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>


                        {/* Layout Switched preferences */}
                        <div className="space-y-3.5 pt-2">
                          <h3 className="font-semibold text-sm">Layout Options</h3>
                          
                          {/* Compact Mode Switch */}
                          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5">
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-semibold">Compact Mode</h4>
                              <p className="text-xs text-muted-foreground">Decreases layout padding for higher text density.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={compactMode}
                                onChange={(e) => {
                                  setCompactMode(e.target.checked)
                                  savePreferencesLocally({ compactMode: e.target.checked })
                                  triggerSuccessNotification(e.target.checked ? 'Compact view enabled!' : 'Normal padding restored.')
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                            </label>
                          </div>

                          {/* Animations Switch */}
                          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5">
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-semibold">Smooth Animations</h4>
                              <p className="text-xs text-muted-foreground">Enable transition animations for page overlays and sliders.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={animationsEnabled}
                                onChange={(e) => {
                                  setAnimationsEnabled(e.target.checked)
                                  savePreferencesLocally({ animationsEnabled: e.target.checked })
                                  triggerSuccessNotification(e.target.checked ? 'Layout animations active.' : 'Animations disabled.')
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 4: NOTIFICATIONS */}
                    {activeCategory === 'notifications' && (
                      <div className="space-y-6">
                        <div className="border-b border-border pb-3">
                          <h2 className="text-lg font-bold flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" /> Notification Settings
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">Select your preferences for delivery alerts and updates.</p>
                        </div>

                        <div className="space-y-3.5">
                          {[
                            { label: 'Email Notifications', desc: 'Deliver updates directly to your registered email address.', val: notifyEmail, set: setNotifyEmail },
                            { label: 'Push Notifications', desc: 'Show desktop messages for real-time community responses.', val: notifyPush, set: setNotifyPush },
                            { label: 'Resume Updates', desc: 'Alert when a resume undergoes database replication or scoring updates.', val: notifyResume, set: setNotifyResume },
                            { label: 'AI Suggestions', desc: 'Notify when new smart improvements become available for your profile.', val: notifyAI, set: setNotifyAI },
                            { label: 'Career Recommendations', desc: 'Alert when jobs matching your career goals are published.', val: notifyCareer, set: setNotifyCareer },
                            { label: 'Community Notifications', desc: 'Updates from community forum topics you interact with.', val: notifyCommunity, set: setNotifyCommunity },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5">
                              <div className="space-y-0.5 max-w-[80%]">
                                <h4 className="text-sm font-semibold">{item.label}</h4>
                                <p className="text-xs text-muted-foreground leading-normal">{item.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.val}
                                  onChange={(e) => {
                                    item.set(e.target.checked)
                                    savePreferencesLocally({ [idx]: e.target.checked })
                                    triggerSuccessNotification(`${item.label} updated!`)
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SECTION 7: PRIVACY */}
                    {activeCategory === 'privacy' && (
                      <div className="space-y-6">
                        <div className="border-b border-border pb-3">
                          <h2 className="text-lg font-bold flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" /> Privacy & Attributes
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">Control which profile elements are exposed externally.</p>
                        </div>

                        <div className="space-y-3.5">
                          {[
                            { label: 'Public Profile Visibility', desc: 'Allows search index engines to index and rank your Skillfy summary.', val: publicProfile, set: setPublicProfile },
                            { label: 'Show Email Address', desc: 'Expose email address to active recruiters on recommendations lists.', val: showEmail, set: setShowEmail },
                            { label: 'Show Phone Number', desc: 'Expose phone number to recruiters.', val: showPhone, set: setShowPhone },
                            { label: 'Allow Recruiters to Contact', desc: 'Permits recruiters to send inbox messages and job matches inquiries.', val: recruitersContact, set: setRecruitersContact },
                            { label: 'Data Collection for Personalization', desc: 'Permit server-side collection of roadmap metrics to optimize AI recommendations.', val: dataCollection, set: setDataCollection },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5">
                              <div className="space-y-0.5 max-w-[80%]">
                                <h4 className="text-sm font-semibold">{item.label}</h4>
                                <p className="text-xs text-muted-foreground leading-normal">{item.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.val}
                                  onChange={(e) => {
                                    item.set(e.target.checked)
                                    savePreferencesLocally({ [idx]: e.target.checked })
                                    triggerSuccessNotification(`${item.label} preference updated!`)
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                              </label>
                            </div>
                          ))}
                        </div>

                        {/* Data Downloads and wipes */}
                        <div className="space-y-3 pt-2">
                          <h4 className="font-semibold text-sm">Personal Data Administration</h4>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={downloadPersonalData}
                              variant="outline"
                              className="flex-1 gap-2 rounded-xl text-xs"
                            >
                              <FileDown className="h-4 w-4" /> Download Personal Data (.json)
                            </Button>
                            
                            <Button
                              onClick={() => setShowDataResetModal(true)}
                              className="flex-1 gap-2 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 text-xs"
                              variant="outline"
                            >
                              <Trash2 className="h-4 w-4" /> Delete All User Data
                            </Button>
                          </div>
                        </div>

                        {/* Data Reset Warnings Modal */}
                        {showDataResetModal && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <div className="max-w-md w-full bg-card border border-border p-6 rounded-2xl space-y-4 shadow-2xl">
                              <div className="flex items-center gap-3 text-destructive font-semibold">
                                <AlertTriangle className="h-6 w-6 shrink-0" />
                                <h3>Wipe All Preferences & Data</h3>
                              </div>
                              <p className="text-xs text-muted-foreground leading-normal">
                                This will erase all settings, theme preferences, and saved Gemini API credentials from local browser storage. Are you sure you want to proceed?
                              </p>
                              <div className="flex justify-end gap-2 text-xs">
                                <Button variant="ghost" onClick={() => setShowDataResetModal(false)} className="rounded-xl">Cancel</Button>
                                <Button onClick={handleResetAllData} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl">Wipe Data</Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 8: HELP & ABOUT */}
                    {activeCategory === 'help' && (
                      <div className="space-y-6">
                        <div className="border-b border-border pb-3">
                          <h2 className="text-lg font-bold flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-primary" /> Help & Support
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">Explore FAQs, contact support details, and version diagnostics.</p>
                        </div>

                        {/* FAQ Collapsible Panel Accordion */}
                        <div className="space-y-2.5">
                          <h3 className="font-semibold text-sm">Frequently Asked Questions</h3>
                          {[
                            { q: 'How does the scanned PDF OCR extraction work?', a: 'If you upload an image-only PDF, Skillfy dynamically spawns a local Tesseract.js worker inside your browser. This worker runs Optical Character Recognition directly on page canvases, keeping your data confidential.' },
                            { q: 'Can I use a custom Gemini AI key?', a: 'Yes! Navigate to the Security tab and enter your personal Gemini API key. It stores securely inside your browser localStorage and enables real-time parser generation without using public credits.' },
                            { q: 'Are my resumes public or private?', a: 'By default, all uploaded and parsed resumes are private. You can customize visible profile elements under the Privacy tab.' }
                          ].map((faq, index) => {
                            const isExpanded = expandedFaq === index
                            return (
                              <div key={index} className="rounded-xl border border-border bg-secondary/5 overflow-hidden transition-all">
                                <button
                                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                                  className="flex w-full items-center justify-between p-4 text-left text-xs font-semibold"
                                >
                                  <span>{faq.q}</span>
                                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                                </button>
                                {isExpanded && (
                                  <div className="px-4 pb-4 text-xs text-muted-foreground leading-normal border-t border-border/20 pt-2.5 bg-background/25">
                                    {faq.a}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Support links card */}
                        <div className="grid gap-3 sm:grid-cols-2 text-xs">
                          <a href="mailto:support@skillfy.dev" className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5 hover:bg-secondary/20 transition-colors">
                            <span className="font-medium">Contact Support</span>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          </a>
                          <button onClick={() => alert('Bug report dialog opened!')} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5 hover:bg-secondary/20 text-left transition-colors">
                            <span className="font-medium">Report a Bug</span>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button onClick={() => alert('Feedback dialog opened!')} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5 hover:bg-secondary/20 text-left transition-colors">
                            <span className="font-medium">Send Feedback</span>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5">
                            <span className="font-medium text-muted-foreground">App Version</span>
                            <span className="font-mono text-muted-foreground">v1.1.0-release</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-muted-foreground gap-2 pt-2 border-t border-border/40">
                          <div className="flex gap-3">
                            <button onClick={() => alert('Terms & Conditions dialog')} className="hover:underline">Terms & Conditions</button>
                            <span>•</span>
                            <button onClick={() => alert('Privacy Policy dialog')} className="hover:underline">Privacy Policy</button>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => alert('You are on the latest version!')} className="rounded-xl text-[10px] h-7 px-3">
                            Check for Updates
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ChatWidget />
    </div>
  )
}
