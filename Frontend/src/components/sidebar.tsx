'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Compass,
  Users,
  Glasses,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { clearAuthSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Resume Builder', href: '/resume/new' },
  { icon: Compass, label: 'Career Paths', href: '/career-recommendation' },
  { icon: Users, label: 'Community', href: '/community' },
  { icon: Glasses, label: 'VR Rooms', href: '/vr-room' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    clearAuthSession()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
          x: isMobileOpen ? 0 : typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0,
        }}
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar shrink-0',
          'lg:sticky lg:z-auto lg:shrink-0'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold"
              >
                Skillify
              </motion.span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 lg:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isCollapsed ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Link href="/settings" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}
