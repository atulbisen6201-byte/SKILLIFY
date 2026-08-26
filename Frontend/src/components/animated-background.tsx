'use client'

import React, { useEffect, useRef, useState } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track cursor position with zero React re-renders
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5
      const y = (e.clientY / window.innerHeight) - 0.5
      targetMouseRef.current = { x, y }
    }

    const checkMediaQueries = () => {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    checkMediaQueries()
    window.addEventListener('resize', checkMediaQueries)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', checkMediaQueries)
    }
  }, [])

  // Canvas rendering loop & background lerp
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let isVisible = true

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', handleVisibility)

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      baseRadius: number
      pulse: number
      pulseSpeed: number
    }

    interface Star {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      alpha: number
      blinkSpeed: number
    }

    interface Dust {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      alpha: number
    }

    const particleCount = isMobile ? 20 : 40
    const starCount = isMobile ? 15 : 35
    const dustCount = isMobile ? 10 : 25
    const connectionDist = isMobile ? 85 : 120

    const particles: Particle[] = []
    const stars: Star[] = []
    const dusts: Dust[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 1,
        baseRadius: Math.random() * 1.5 + 1,
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.003 + Math.random() * 0.005,
      })
    }

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
        radius: Math.random() * 0.9 + 0.3,
        alpha: Math.random(),
        blinkSpeed: 0.001 + Math.random() * 0.002,
      })
    }

    for (let i = 0; i < dustCount; i++) {
      dusts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.05 - Math.random() * 0.12,
        radius: Math.random() * 1 + 0.5,
        alpha: 0.1 + Math.random() * 0.3,
      })
    }

    const animate = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(animate)
        return
      }

      // Smooth lerp mouse ref
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08

      // Update CSS variables for high-performance GPU transforms
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mx', mouseRef.current.x.toFixed(4))
        containerRef.current.style.setProperty('--my', mouseRef.current.y.toFixed(4))
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouse = mouseRef.current
      const mousePxX = (mouse.x + 0.5) * canvas.width
      const mousePxY = (mouse.y + 0.5) * canvas.height

      // Glow light around cursor
      if (!isMobile) {
        const glowRad = 350
        const glowGrad = ctx.createRadialGradient(mousePxX, mousePxY, 0, mousePxX, mousePxY, glowRad)
        glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.06)')
        glowGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.02)')
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(mousePxX, mousePxY, glowRad, 0, Math.PI * 2)
        ctx.fill()
      }

      // 1. Blinking Stars
      for (const star of stars) {
        if (!reducedMotion) {
          star.x += star.vx
          star.y += star.vy

          if (star.x < -10) star.x = canvas.width + 10
          if (star.x > canvas.width + 10) star.x = -10
          if (star.y < -10) star.y = canvas.height + 10
          if (star.y > canvas.height + 10) star.y = -10

          star.alpha += star.blinkSpeed
          if (star.alpha > 0.85 || star.alpha < 0.05) {
            star.blinkSpeed = -star.blinkSpeed
          }
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, Math.min(star.alpha, 0.85))})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Atmospheric Dust
      for (const dust of dusts) {
        if (!reducedMotion) {
          dust.x += dust.vx
          dust.y += dust.vy

          if (dust.y < -10) dust.y = canvas.height + 10
          if (dust.x < -10) dust.x = canvas.width + 10
          if (dust.x > canvas.width + 10) dust.x = -10
        }

        ctx.fillStyle = `rgba(168, 85, 247, ${dust.alpha})`
        ctx.beginPath()
        ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 3. Neural Particles & Links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (!reducedMotion) {
          const dxMouse = mousePxX - p.x
          const dyMouse = mousePxY - p.y
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
          
          if (distMouse < 220) {
            const force = (220 - distMouse) * 0.0001
            p.x += dxMouse * force
            p.y += dyMouse * force
          }

          p.x += p.vx
          p.y += p.vy

          if (p.x < -10) p.x = canvas.width + 10
          if (p.x > canvas.width + 10) p.x = -10
          if (p.y < -10) p.y = canvas.height + 10
          if (p.y > canvas.height + 10) p.y = -10

          p.pulse += p.pulseSpeed
          p.radius = p.baseRadius + Math.sin(p.pulse) * 0.4
        }

        const nodeOpacity = (isMobile ? 0.25 : 0.4) + Math.sin(p.pulse) * 0.15
        ctx.fillStyle = `rgba(99, 102, 241, ${nodeOpacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p2.x - p.x
          const dy = p2.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * (isMobile ? 0.08 : 0.13)
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [reducedMotion, isMobile])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 0 }}
    >
      {/* LAYER 1: Deep Dark Gradient Base */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,#07111f_0%,#030712_50%,#020617_100%)]" 
        style={{ backgroundColor: '#020617' }}
      />

      {/* LAYER 2 & 3: Large Animated Auroras & Organic Mesh */}
      <div className="absolute inset-0 opacity-[0.24] mix-blend-screen overflow-hidden">
        <div 
          className="absolute -top-[30%] -left-[10%] w-[75vw] h-[75vw] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.28_265/_0.18)_0%,transparent_70%)] blur-[100px] animate-aurora-slow"
          style={{ transform: 'translate3d(calc(var(--mx, 0) * 15px), calc(var(--my, 0) * 15px), 0)' }}
        />
        <div 
          className="absolute -bottom-[20%] -right-[10%] w-[65vw] h-[65vw] rounded-full bg-[radial-gradient(circle,oklch(0.75_0.2_150/_0.15)_0%,transparent_70%)] blur-[90px] animate-aurora-mid"
          style={{ transform: 'translate3d(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -20px), 0)' }}
        />
        <div 
          className="absolute top-[20%] right-[15%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_280/_0.12)_0%,transparent_70%)] blur-[110px] animate-aurora-fast"
          style={{ transform: 'translate3d(calc(var(--mx, 0) * 25px), calc(var(--my, 0) * 25px), 0)' }}
        />
      </div>

      {/* LAYER 5: Large Blurred Glowing Spheres */}
      <div className="absolute inset-0 opacity-[0.12] mix-blend-screen overflow-hidden">
        <div 
          className="absolute top-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-primary/20 blur-[130px]"
          style={{ transform: 'translate3d(calc(var(--mx, 0) * 30px), calc(var(--my, 0) * 30px), 0)' }}
        />
        <div 
          className="absolute bottom-[20%] right-[30%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[140px]"
          style={{ transform: 'translate3d(calc(var(--mx, 0) * -35px), calc(var(--my, 0) * -35px), 0)' }}
        />
      </div>

      {/* LAYER 7: 3D Perspective Grid */}
      <div className="absolute inset-0 opacity-[0.75] overflow-hidden pointer-events-none select-none">
        <div className="perspective-grid absolute inset-0" />
      </div>

      {/* LAYER 8: Floating Glass Geometry Wireframes */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-[0.25] mix-blend-screen pointer-events-none overflow-hidden">
          <div 
            className="absolute top-[20%] left-[10%] w-16 h-16 animate-float-slow-1"
            style={{ transform: 'translate3d(calc(var(--mx, 0) * 18px), calc(var(--my, 0) * 18px), 0)' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary stroke-[0.8] fill-none opacity-40">
              <polygon points="50,3 93,28 93,78 50,97 7,78 7,28" />
            </svg>
          </div>

          <div 
            className="absolute top-[65%] right-[12%] w-20 h-20 animate-float-slow-2"
            style={{ transform: 'translate3d(calc(var(--mx, 0) * -22px), calc(var(--my, 0) * -22px), 0)' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-accent stroke-[0.8] fill-none opacity-45">
              <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" />
              <line x1="50" y1="15" x2="50" y2="85" />
              <line x1="15" y1="35" x2="50" y2="50" />
              <line x1="85" y1="35" x2="50" y2="50" />
            </svg>
          </div>

          <div 
            className="absolute top-[40%] right-[25%] w-12 h-12 animate-float-slow-3"
            style={{ transform: 'translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 12px), 0)' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary stroke-[0.8] fill-none opacity-30">
              <circle cx="50" cy="50" r="45" strokeDasharray="5, 5" />
            </svg>
          </div>
        </div>
      )}

      {/* LAYER 9: Volumetric Central Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.02)_0%,rgba(0,0,0,0)_60%)] animate-volumetric-breath pointer-events-none" />

      {/* CANVAS LAYER */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  )
}
