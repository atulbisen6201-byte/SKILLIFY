import Link from 'next/link'
import { Sparkles, Github, Twitter, Linkedin, Youtube } from 'lucide-react'

const footerLinks = {
  Features: [
    { label: 'Resume Builder', href: '/resume/new' },
    { label: 'Career Guidance', href: '/career-recommendation' },
    { label: 'VR Rooms', href: '/vr-room' },
    { label: 'Community', href: '/community' },
  ],
  Account: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Skillify</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI-powered career guidance platform helping millions achieve their professional dreams worldwide.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Skillify. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 group cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-all duration-300">
            <span>Design by</span>
            <span className="signature-text relative">
              Atul Bisen
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </span>
            <Sparkles className="h-4 w-4 text-primary signature-icon transition-transform duration-500 group-hover:rotate-180" />
          </div>
        </div>
      </div>
    </footer>
  )
}
