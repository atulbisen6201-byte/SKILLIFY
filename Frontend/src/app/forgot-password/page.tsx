'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { skillifyPostJson } from '@/lib/skillify-api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    if (!email) {
      setError('Email is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      // Pass client window location origin so backend can build correct reset links
      await skillifyPostJson('/api/auth/forgot-password', {
        email,
        originUrl: window.location.origin,
      })
      setSuccess('We have sent a secure password reset link to your email address.')
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
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
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your email and we will send you a link to reset your password
            </p>
          </div>

          {success ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {success}
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
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
                      error ? 'border-destructive' : 'border-input'
                    }`}
                  />
                </div>
                {error && (
                  <p className="mt-1 text-xs text-destructive">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full gap-2 animate-pulse-subtle" disabled={isSubmitting}>
                {isSubmitting ? 'Sending link…' : 'Send Reset Link'}
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Back to Login Link */}
              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  )
}
