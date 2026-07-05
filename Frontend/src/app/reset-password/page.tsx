'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { skillifyPostJson } from '@/lib/skillify-api'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {}
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSuccess(null)

    if (!token) {
      setSubmitError('Invalid or missing password reset token.')
      return
    }

    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      await skillifyPostJson('/api/auth/reset-password', {
        token,
        password,
      })
      setSuccess('Your password has been successfully reset. You can now log in.')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Reset failed. Token might be expired.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass rounded-2xl p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">New Password</h1>
        <p className="mt-2 text-muted-foreground">
          Create a new secure password for your Skillfy account
        </p>
      </div>

      {!token ? (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive">
          Password reset token is missing or invalid. Please request a new link from the forgot password page.
          <div className="mt-4">
            <Link href="/forgot-password">
              <Button variant="outline" className="text-xs">Request New Link</Button>
            </Link>
          </div>
        </div>
      ) : success ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-sm text-muted-foreground">
            {success}
          </p>
          <p className="text-xs text-muted-foreground animate-pulse">
            Redirecting to login page…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min. 8 characters)"
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`w-full rounded-xl border bg-background py-3 pl-10 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${
                  errors.confirmPassword ? 'border-destructive' : 'border-input'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {submitError && (
            <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {submitError}
            </p>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting password…' : 'Reset Password'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
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

        {/* Suspense Boundary for useSearchParams */}
        <Suspense fallback={
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Loading reset form…
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </main>
  )
}
