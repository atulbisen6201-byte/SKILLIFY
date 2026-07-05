'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wand2, FileText, Target, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResumeOptimizerProps {
  isOpen: boolean
  onClose: () => void
}

const tones = [
  { id: 'professional', label: 'Professional', description: 'Formal and polished' },
  { id: 'creative', label: 'Creative', description: 'Unique and engaging' },
  { id: 'ats', label: 'ATS Friendly', description: 'Optimized for systems' },
]

const suggestions = [
  { category: 'Content', items: ['Add quantifiable achievements', 'Include action verbs', 'Remove redundant phrases'] },
  { category: 'Keywords', items: ['Project Management', 'Agile/Scrum', 'Data Analysis', 'Team Leadership'] },
  { category: 'Format', items: ['Consistent date formatting', 'Proper section headers', 'Appropriate length'] },
]

export function ResumeOptimizer({ isOpen, onClose }: ResumeOptimizerProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [selectedTone, setSelectedTone] = useState('professional')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-card"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Wand2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">AI Resume Optimizer</h2>
                  <p className="text-sm text-muted-foreground">
                    Optimize your resume for specific job descriptions
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              {!showResults ? (
                <div className="space-y-6">
                  {/* Job Description */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Paste Job Description
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here to get personalized optimization suggestions..."
                      rows={6}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>

                  {/* Tone Selector */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Select Writing Tone
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {tones.map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => setSelectedTone(tone.id)}
                          className={`rounded-xl border p-4 text-left transition-colors ${
                            selectedTone === tone.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="font-medium">{tone.label}</p>
                          <p className="text-sm text-muted-foreground">{tone.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <Button
                    onClick={handleAnalyze}
                    disabled={!jobDescription || isAnalyzing}
                    className="w-full gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Analyze & Optimize
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score Card */}
                  <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Resume Match Score</h3>
                        <p className="text-sm text-muted-foreground">
                          How well your resume matches the job description
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-4xl font-bold gradient-text">78%</div>
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Applying the suggestions below could increase your score to 95%
                    </p>
                  </div>

                  {/* Suggestions */}
                  <div className="grid gap-4 md:grid-cols-3">
                    {suggestions.map((section) => (
                      <div
                        key={section.category}
                        className="rounded-xl border border-border p-4"
                      >
                        <h4 className="mb-3 font-medium">{section.category}</h4>
                        <ul className="space-y-2">
                          {section.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm"
                            >
                              {section.category === 'Keywords' ? (
                                <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                              ) : (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              )}
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Keyword Analysis */}
                  <div className="rounded-xl border border-border p-4">
                    <h4 className="mb-3 font-medium">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Cloud Computing', 'CI/CD', 'Microservices', 'REST APIs', 'SQL', 'Git'].map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-sm text-destructive"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowResults(false)}
                    >
                      Edit Job Description
                    </Button>
                    <Button className="flex-1 gap-2">
                      <Wand2 className="h-4 w-4" />
                      Apply Suggestions
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
