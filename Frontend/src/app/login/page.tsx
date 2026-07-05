'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatWidget } from '@/components/chat-widget'
import { skillifyPostJson } from '@/lib/skillify-api'
import { setAuthSession, type SkillifyUser } from '@/lib/auth-client'

declare global {
  interface Window {
    google?: any
  }
}

type LoginResponse = { user: SkillifyUser; accessToken: string }

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const handleGoogleSignIn = async (credential: string) => {
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const data = await skillifyPostJson<LoginResponse>('/api/auth/google', {
        credential,
      })
      setAuthSession(data.accessToken, data.user)
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Google sign in failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    let active = true

    const initializeGoogle = () => {
      if (!active) return

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com'
      const isPlaceholder = clientId === 'your-google-client-id.apps.googleusercontent.com' || !clientId

      const btnContainer = document.getElementById('google-signin-btn')
      if (btnContainer) {
        if (isPlaceholder) {
          // Render a custom button for mock login when no Client ID is configured
          btnContainer.innerHTML = ''
          const button = document.createElement('button')
          button.type = 'button'
          button.className = 'flex w-full items-center justify-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground'
          button.innerHTML = `
            <svg class="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Sign in with Google</span>
          `
          button.onclick = () => {
            const email = window.prompt(
              'Enter your Gmail address to sign in with Google (Dev Sandbox Mode):',
              'yourname@gmail.com'
            )
            if (!email) return
            if (!email.includes('@')) {
              alert('Please enter a valid email address')
              return
            }
            handleGoogleSignIn(email)
          }
          btnContainer.appendChild(button)
        } else if (typeof window !== 'undefined' && window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => handleGoogleSignIn(response.credential),
          })
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: btnContainer.offsetWidth || 382,
          })
        }
      }
    }

    if (typeof window !== 'undefined') {
      if (window.google) {
        initializeGoogle()
      } else {
        const interval = setInterval(() => {
          if (window.google) {
            initializeGoogle()
            clearInterval(interval)
          }
        }, 100)
        return () => {
          active = false
          clearInterval(interval)
        }
      }
    }

    return () => {
      active = false
    }
  }, [router])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const data = await skillifyPostJson<LoginResponse>('/api/auth/login', { email, password })
      setAuthSession(data.accessToken, data.user)
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-20">
      {/* Animated Background */}
      <div className="gradient-bg absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(0.65_0.28_265_/_0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,oklch(0.7_0.22_280_/_0.1),transparent_50%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Skillify</span>
        </Link>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue your career journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${
                    errors.email ? 'border-destructive' : 'border-input'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border bg-background py-3 pl-10 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${
                    errors.password ? 'border-destructive' : 'border-input'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-input bg-background accent-primary"
                />
                <span>Remember Me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {submitError && (
              <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {submitError}
              </p>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign In'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3">
            <div id="google-signin-btn" className="w-full flex justify-center min-h-[44px]"></div>
            <Button variant="outline" className="w-full gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>
          
          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
