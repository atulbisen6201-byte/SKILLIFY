'use client'

import React, { useEffect, useRef, useState } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track cursor position for smooth parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates around center (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5
      const y = (e.clientY / window.innerHeight) - 0.5
      setTargetMouse({ x, y })
    }

    const checkMediaQueries = () => {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('mousemove', handleMouseMove)
    checkMediaQueries()
    window.addEventListener('resize', checkMediaQueries)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', checkMediaQueries)
    }
  }, [])

  // Smooth lerp for mouse coordinates
  useEffect(() => {
    let animationId: number
    const updateMouse = () => {
      setMouse((prev) => ({
        x: prev.x + (targetMouse.x - prev.x) * 0.08,
        y: prev.y + (targetMouse.y - prev.y) * 0.08,
      }))
      animationId = requestAnimationFrame(updateMouse)
    }
    animationId = requestAnimationFrame(updateMouse)
    return () => cancelAnimationFrame(animationId)
  }, [targetMouse])

  // Canvas rendering loop for high-performance layers (4, 6, 10)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let isVisible = true

    // Handle viewport resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Handle tab visibility (performance optimization)
    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Entity declarations
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

    // Configure limits based on mobile vs desktop
    const particleCount = isMobile ? 25 : 55
    const starCount = isMobile ? 20 : 45
    const dustCount = isMobile ? 15 : 35
    const connectionDist = isMobile ? 85 : 120

    const particles: Particle[] = []
    const stars: Star[] = []
    const dusts: Dust[] = []

    // Initialize particles (Layer 4)
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 1,
        baseRadius: Math.random() * 1.5 + 1,
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      })
    }

    // Initialize stars (Layer 6)
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 0.8 + 0.3,
        alpha: Math.random(),
        blinkSpeed: 0.005 + Math.random() * 0.012,
      })
    }

    // Initialize dust (Layer 10)
    for (let i = 0; i < dustCount; i++) {
      dusts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.05 - Math.random() * 0.12, // Slowly drifting upwards
        radius: Math.random() * 1 + 0.5,
        alpha: 0.1 + Math.random() * 0.3,
      })
    }

    // Update and draw animation loop
    const animate = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw volumetric cursor light glow (Layer 9 component inside canvas)
      if (!isMobile) {
        const mousePxX = (mouse.x + 0.5) * canvas.width
        const mousePxY = (mouse.y + 0.5) * canvas.height
        const glowRad = 350
        const glowGrad = ctx.createRadialGradient(mousePxX, mousePxY, 0, mousePxX, mousePxY, glowRad)
        glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.06)') // Indigo
        glowGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.02)') // Purple
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(mousePxX, mousePxY, glowRad, 0, Math.PI * 2)
        ctx.fill()
      }

      // 1. Render Layer 6: Blinking Stars
      for (const star of stars) {
        if (!reducedMotion) {
          star.alpha += star.blinkSpeed
          if (star.alpha > 0.85 || star.alpha < 0.1) {
            star.blinkSpeed = -star.blinkSpeed
          }
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Render Layer 10: Drifting Atmospheric Dust
      for (const dust of dusts) {
        if (!reducedMotion) {
          dust.x += dust.vx
          dust.y += dust.vy

          // Wrap boundaries
          if (dust.y < -10) dust.y = canvas.height + 10
          if (dust.x < -10) dust.x = canvas.width + 10
          if (dust.x > canvas.width + 10) dust.x = -10
        }

        ctx.fillStyle = `rgba(168, 85, 247, ${dust.alpha})`
        ctx.beginPath()
        ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 3. Render Layer 4: AI Neural Network (Particles & connection lines)
      const mousePxX = (mouse.x + 0.5) * canvas.width
      const mousePxY = (mouse.y + 0.5) * canvas.height

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (!reducedMotion) {
          // Subtle mouse attraction/repulsion logic
          const dxMouse = mousePxX - p.x
          const dyMouse = mousePxY - p.y
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
          
          if (distMouse < 220) {
            // Soft drift towards/away depending on proximity
            const force = (220 - distMouse) * 0.0001
            p.x += dxMouse * force
            p.y += dyMouse * force
          }

          p.x += p.vx
          p.y += p.vy

          // Wrap boundaries
          if (p.x < -10) p.x = canvas.width + 10
          if (p.x > canvas.width + 10) p.x = -10
          if (p.y < -10) p.y = canvas.height + 10
          if (p.y > canvas.height + 10) p.y = -10

          // Pulsing scale
          p.pulse += p.pulseSpeed
          p.radius = p.baseRadius + Math.sin(p.pulse) * 0.4
        }

        // Draw node
        ctx.fillStyle = `rgba(99, 102, 241, ${isMobile ? 0.35 : 0.5})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections (Layer 4 Neural Links)
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
  }, [reducedMotion, isMobile, mouse])

  // Parallax transform calculation for CSS elements
  const getParallaxStyle = (strength: number) => {
    if (reducedMotion) return {}
    return {
      transform: `translate3d(${mouse.x * strength}px, ${mouse.y * strength}px, 0)`,
      transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
    }
  }

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
        {/* Aurora 1 - Indigo/Violet */}
        <div 
          className="absolute -top-[30%] -left-[10%] w-[75vw] h-[75vw] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.28_265/_0.18)_0%,transparent_70%)] blur-[100px] animate-aurora-slow"
          style={getParallaxStyle(15)}
        />
        {/* Aurora 2 - Cyan/Teal */}
        <div 
          className="absolute -bottom-[20%] -right-[10%] w-[65vw] h-[65vw] rounded-full bg-[radial-gradient(circle,oklch(0.75_0.2_150/_0.15)_0%,transparent_70%)] blur-[90px] animate-aurora-mid"
          style={getParallaxStyle(-20)}
        />
        {/* Aurora 3 - Purple/Fuchsia */}
        <div 
          className="absolute top-[20%] right-[15%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_280/_0.12)_0%,transparent_70%)] blur-[110px] animate-aurora-fast"
          style={getParallaxStyle(25)}
        />
      </div>

      {/* LAYER 5: Large Blurred Glowing Spheres */}
      <div className="absolute inset-0 opacity-[0.12] mix-blend-screen overflow-hidden">
        <div 
          className="absolute top-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-primary/20 blur-[130px]"
          style={getParallaxStyle(30)}
        />
        <div 
          className="absolute bottom-[20%] right-[30%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[140px]"
          style={getParallaxStyle(-35)}
        />
      </div>

      {/* LAYER 7: 3D Perspective Grid */}
      <div className="absolute inset-0 opacity-[0.75] overflow-hidden pointer-events-none select-none">
        <div className="perspective-grid absolute inset-0" />
      </div>

      {/* LAYER 8: Floating Glass Geometry Wireframes */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-[0.25] mix-blend-screen pointer-events-none overflow-hidden">
          {/* Wireframe Hexagon */}
          <div 
            className="absolute top-[20%] left-[10%] w-16 h-16 animate-float-slow-1"
            style={getParallaxStyle(18)}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary stroke-[0.8] fill-none opacity-40">
              <polygon points="50,3 93,28 93,78 50,97 7,78 7,28" />
            </svg>
          </div>

          {/* Wireframe Cube */}
          <div 
            className="absolute top-[65%] right-[12%] w-20 h-20 animate-float-slow-2"
            style={getParallaxStyle(-22)}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-accent stroke-[0.8] fill-none opacity-45">
              <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" />
              <line x1="50" y1="15" x2="50" y2="85" />
              <line x1="15" y1="35" x2="50" y2="50" />
              <line x1="85" y1="35" x2="50" y2="50" />
            </svg>
          </div>

          {/* Floating Circle Ring */}
          <div 
            className="absolute top-[40%] right-[25%] w-12 h-12 animate-float-slow-3"
            style={getParallaxStyle(12)}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary stroke-[0.8] fill-none opacity-30">
              <circle cx="50" cy="50" r="45" strokeDasharray="5, 5" />
            </svg>
          </div>
        </div>
      )}

      {/* LAYER 9: Volumetric Breathing central glow mask */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.02)_0%,rgba(0,0,0,0)_60%)] animate-volumetric-breath pointer-events-none" />

      {/* CANVAS LAYER: Canvas particles (Layers 4, 6, 10) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  )
}
