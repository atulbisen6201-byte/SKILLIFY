'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAccessToken, setAuthSession, clearAuthSession } from '@/lib/auth-client'
import { skillifyGetJson } from '@/lib/skillify-api'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      router.replace('/login')
      return
    }

    let active = true
    skillifyGetJson<{ user: any }>('/api/me')
      .then((data) => {
        if (active) {
          setAuthSession(token, data.user)
          setReady(true)
        }
      })
      .catch((err) => {
        console.error('Session validation failed, logging out:', err)
        if (active) {
          clearAuthSession()
          router.replace('/login')
        }
      })

    return () => {
      active = false
    }
  }, [router])

  return (
    <>
      {!ready ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-6 w-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Restoring session…</span>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  )
}
