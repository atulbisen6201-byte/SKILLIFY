'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Sparkles,
  Brain,
  FileText,
  Wand2,
  MessageSquare,
  Glasses,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe2,
  Briefcase,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FeatureCard } from '@/components/feature-card'
import { ChatWidget } from '@/components/chat-widget'

const features = [
  {
    icon: Brain,
    title: 'AI Career Recommendations',
    description: 'Get personalized career paths based on your skills, interests, and market trends using advanced AI.',
    href: '/career-recommendation',
  },
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'Create professional resumes with our intuitive builder featuring multiple templates and real-time preview.',
    href: '/resume/new',
  },
  {
    icon: Wand2,
    title: 'AI Resume Optimizer',
    description: 'Optimize your resume for ATS systems and specific job descriptions with AI-powered suggestions.',
    href: '/resume/new',
  },
  {
    icon: MessageSquare,
    title: 'Global AI Chatbot',
    description: 'Get career advice in 8+ languages with our multilingual AI assistant available 24/7.',
    href: '/dashboard',
  },
  {
    icon: Glasses,
    title: 'VR Career Rooms',
    description: 'Experience your future career in immersive virtual reality environments before making decisions.',
    href: '/vr-room',
  },
  {
    icon: Globe2,
    title: 'Global Opportunities',
    description: 'Discover career opportunities worldwide with localized insights and visa requirements.',
    href: '/community',
  },
]


const stats = [
  { value: '2M+', label: 'Career Paths Created' },
  { value: '150+', label: 'Countries Served' },
  { value: '98%', label: 'User Satisfaction' },
  { value: '500K+', label: 'Resumes Optimized' },
]

const careerData = [
  {
    name: 'Product Manager',
    matchScore: 95,
    skills: 28,
    resumeScore: 88,
    insights: "Based on your leadership and design background, you have exceptional alignment for product roles. Enhance Agile/Scrum metrics to boost match score to 98%."
  },
  {
    name: 'UX Designer',
    matchScore: 92,
    skills: 24,
    resumeScore: 85,
    insights: "Your design portfolio shows strong user empathy and layout sense. Learn interactive prototyping (Framer/CSS Motion) to strengthen your edge."
  },
  {
    name: 'Data Analyst',
    matchScore: 89,
    skills: 19,
    resumeScore: 80,
    insights: "Strong logical layout. To stand out for analytical roles, add hands-on projects involving SQL database architecture and data visualizations (PowerBI/Tableau)."
  }
]

export default function LandingPage() {
  const [isScanning, setIsScanning] = useState(true)
  const [scanStep, setScanStep] = useState(0)
  const [selectedCareer, setSelectedCareer] = useState(0)

  useEffect(() => {
    if (!isScanning) return

    const timers = [
      setTimeout(() => setScanStep(1), 1000),
      setTimeout(() => setScanStep(2), 2000),
      setTimeout(() => setScanStep(3), 3000),
      setTimeout(() => setIsScanning(false), 3800),
    ]

    return () => timers.forEach(clearTimeout)
  }, [isScanning])

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="gradient-bg absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(0.65_0.28_265_/_0.1),transparent_50%)]" />
        
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Career Guidance Platform</span>
            </motion.div>
            
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-balance">AI-Powered Career Guidance</span>
              <br />
              <span className="gradient-text">for the World</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
              Get personalized career recommendations, build stunning resumes, and receive 
              multilingual AI assistance to achieve your professional dreams.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/signup">
                <Button size="lg" className="glow gap-2 text-base">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="gap-2 text-base">
                  <MessageSquare className="h-4 w-4" />
                  Try AI Chat
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative mt-16 lg:mt-24"
          >
            <div className="glass glow mx-auto max-w-5xl overflow-hidden rounded-2xl p-2">
              <div className="rounded-xl bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <span className="ml-4 text-sm text-muted-foreground font-medium">Skillify AI Dashboard</span>
                  </div>
                  {!isScanning && (
                    <button 
                      onClick={() => {
                        setIsScanning(true)
                        setScanStep(0)
                      }}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-2.5 py-1 bg-secondary/50 hover:bg-secondary cursor-pointer"
                    >
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                        <RefreshCw className="h-3 w-3" />
                      </motion.div>
                      Scan Again
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {isScanning ? (
                      <motion.div
                        key="scanner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center py-12 px-4 min-h-[320px]"
                      >
                        <div className="relative w-full max-w-md bg-secondary/20 rounded-xl border border-border p-6 overflow-hidden">
                          {/* Scanning laser line animation */}
                          <motion.div 
                            className="absolute left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-primary to-transparent"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                          />
                          
                          <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                              <Brain className="h-5 w-5 animate-pulse text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">AI Resume Parser</h4>
                              <p className="text-xs text-muted-foreground">Processing atul_resume.pdf</p>
                            </div>
                          </div>

                          <div className="space-y-4 font-mono text-xs relative z-10">
                            <div className="flex items-center gap-2.5">
                              <span className={scanStep >= 0 ? "text-primary font-bold" : "text-muted-foreground"}>
                                {scanStep > 0 ? "✓" : "●"}
                              </span>
                              <span className={scanStep >= 0 ? "text-foreground" : "text-muted-foreground"}>
                                Parsing resume file structure...
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className={scanStep >= 1 ? "text-primary font-bold" : "text-muted-foreground"}>
                                {scanStep > 1 ? "✓" : scanStep === 1 ? "●" : "○"}
                              </span>
                              <span className={scanStep >= 1 ? "text-foreground" : "text-muted-foreground"}>
                                Extracting and mapping skill vectors...
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className={scanStep >= 2 ? "text-primary font-bold" : "text-muted-foreground"}>
                                {scanStep > 2 ? "✓" : scanStep === 2 ? "●" : "○"}
                              </span>
                              <span className={scanStep >= 2 ? "text-foreground" : "text-muted-foreground"}>
                                Benchmarking match scores...
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 h-1.5 w-full bg-secondary rounded-full overflow-hidden relative z-10">
                            <motion.div 
                              className="h-full bg-primary"
                              initial={{ width: "0%" }}
                              animate={{ width: `${(scanStep / 3) * 100}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        {/* Score Cards Row */}
                        <div className="grid gap-4 md:grid-cols-3">
                          {/* Match Score */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 p-4 border border-primary/10"
                          >
                            <div className="text-sm text-muted-foreground">Career Match Score</div>
                            <div className="mt-1 flex items-baseline gap-2">
                              <motion.span 
                                key={selectedCareer}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-3xl font-bold text-primary"
                              >
                                {careerData[selectedCareer].matchScore}%
                              </motion.span>
                            </div>
                            <div className="mt-3 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${careerData[selectedCareer].matchScore}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                          </motion.div>

                          {/* Skills Analyzed */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 p-4 border border-accent/10"
                          >
                            <div className="text-sm text-muted-foreground">Skills Analyzed</div>
                            <div className="mt-1">
                              <motion.span 
                                key={selectedCareer}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-3xl font-bold text-accent"
                              >
                                {careerData[selectedCareer].skills}
                              </motion.span>
                            </div>
                            <div className="mt-3 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-accent rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(careerData[selectedCareer].skills / 35) * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                          </motion.div>

                          {/* Resume Score */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative overflow-hidden rounded-xl bg-secondary p-4 border border-border"
                          >
                            <div className="text-sm text-muted-foreground">Resume Score</div>
                            <div className="mt-1">
                              <motion.span 
                                key={selectedCareer}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-3xl font-bold"
                              >
                                {careerData[selectedCareer].resumeScore}
                              </motion.span>
                              <span className="text-muted-foreground text-sm font-medium">/100</span>
                            </div>
                            <div className="mt-3 h-1.5 w-full bg-border rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-foreground rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${careerData[selectedCareer].resumeScore}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                          </motion.div>
                        </div>

                        {/* Interactive Details Row */}
                        <div className="grid gap-4 md:grid-cols-2">
                          {/* Left Panel: Top Matches */}
                          <div className="rounded-xl border border-border p-4 bg-card/50">
                            <div className="mb-3 text-sm font-medium flex items-center justify-between">
                              <span>Top Career Matches</span>
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">Select to Analyze</span>
                            </div>
                            <div className="space-y-2">
                              {careerData.map((career, i) => (
                                <motion.div
                                  key={career.name}
                                  onClick={() => setSelectedCareer(i)}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                    selectedCareer === i 
                                      ? "bg-primary/10 border-primary/40 shadow-sm shadow-primary/5" 
                                      : "bg-transparent border-transparent hover:bg-secondary/40"
                                  }`}
                                >
                                  <CheckCircle2 className={`h-4.5 w-4.5 ${selectedCareer === i ? "text-primary" : "text-muted-foreground"}`} />
                                  <span className={`text-sm font-medium transition-colors ${selectedCareer === i ? "text-foreground" : "text-muted-foreground"}`}>
                                    {career.name}
                                  </span>
                                  <span className="ml-auto text-xs font-semibold bg-secondary/80 px-2 py-0.5 rounded text-muted-foreground">
                                    {career.matchScore}%
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Right Panel: AI Insights */}
                          <div className="rounded-xl border border-border p-4 bg-card/50 flex flex-col justify-between">
                            <div>
                              <div className="mb-3 text-sm font-medium flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                <span>AI Insights</span>
                              </div>
                              <div className="relative min-h-[90px]">
                                <AnimatePresence mode="wait">
                                  <motion.p
                                    key={selectedCareer}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm text-muted-foreground leading-relaxed"
                                  >
                                    {careerData[selectedCareer].insights}
                                  </motion.p>
                                </AnimatePresence>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>Profile: Atul Bisen</span>
                              <span className="text-primary font-medium hover:underline cursor-pointer flex items-center gap-0.5">
                                View full roadmap <ArrowRight className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold gradient-text lg:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything you need to <span className="gradient-text">succeed</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Powerful AI-driven tools designed to accelerate your career journey and help you land your dream job.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass glow relative overflow-hidden rounded-3xl p-8 text-center md:p-16"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to transform your career?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join over 2 million professionals who have already discovered their perfect career path with Skillify.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/career-recommendation">
                  <Button variant="outline" size="lg">
                    Explore Careers
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
