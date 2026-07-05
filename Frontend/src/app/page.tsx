'use client'

import { motion } from 'framer-motion'
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

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    content: 'Skillify helped me transition from marketing to tech. The AI recommendations were spot-on!',
    avatar: 'SC',
  },
  {
    name: 'Miguel Rodriguez',
    role: 'Data Scientist',
    content: 'The resume optimizer increased my interview callbacks by 300%. Absolutely game-changing.',
    avatar: 'MR',
  },
  {
    name: 'Priya Sharma',
    role: 'Product Manager',
    content: 'The multilingual support helped me explore opportunities across different countries seamlessly.',
    avatar: 'PS',
  },
]

const stats = [
  { value: '2M+', label: 'Career Paths Created' },
  { value: '150+', label: 'Countries Served' },
  { value: '98%', label: 'User Satisfaction' },
  { value: '500K+', label: 'Resumes Optimized' },
]

export default function LandingPage() {
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
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-4 text-sm text-muted-foreground">Skillify Dashboard</span>
                </div>
                <div className="p-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-4">
                      <div className="text-sm text-muted-foreground">Career Match Score</div>
                      <div className="mt-1 text-3xl font-bold text-primary">94%</div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 p-4">
                      <div className="text-sm text-muted-foreground">Skills Analyzed</div>
                      <div className="mt-1 text-3xl font-bold text-accent">28</div>
                    </div>
                    <div className="rounded-xl bg-secondary p-4">
                      <div className="text-sm text-muted-foreground">Resume Score</div>
                      <div className="mt-1 text-3xl font-bold">87/100</div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-border p-4">
                      <div className="mb-3 text-sm font-medium">Top Career Matches</div>
                      <div className="space-y-2">
                        {['Product Manager', 'UX Designer', 'Data Analyst'].map((career, i) => (
                          <div key={career} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-sm">{career}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{95 - i * 3}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border p-4">
                      <div className="mb-3 text-sm font-medium">AI Insights</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        Based on your skills and experience, you have strong potential in product-focused roles. Consider enhancing your data analysis skills for higher match rates.
                      </div>
                    </div>
                  </div>
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

      {/* Testimonials Section */}
      <section className="bg-card/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Loved by <span className="gradient-text">professionals</span> worldwide
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Join thousands of successful professionals who transformed their careers with Skillify.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="text-muted-foreground leading-relaxed">&quot;{testimonial.content}&quot;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
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
