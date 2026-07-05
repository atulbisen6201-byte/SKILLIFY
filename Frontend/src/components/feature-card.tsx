'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

const MotionLink = motion.create(Link)


interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  index: number
  href?: string
}

export function FeatureCard({ icon: Icon, title, description, index, href }: FeatureCardProps) {
  const CardContent = (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </>
  )

  const cardProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: index * 0.1, duration: 0.5 },
    whileHover: { y: -5, transition: { duration: 0.2 } },
    className: "group relative block overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md cursor-pointer",
  }

  if (href) {
    return (
      <MotionLink href={href} {...cardProps}>
        {CardContent}
      </MotionLink>
    )
  }

  return (
    <motion.div {...cardProps}>
      {CardContent}
    </motion.div>
  )
}

