'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skillifyPostJson } from '@/lib/skillify-api'
import { getAccessToken } from '@/lib/auth-client'
import {
  MessageSquare,
  X,
  Send,
  Globe,
  Sparkles,
  History,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your AI career assistant. How can I help you today? I can assist with career recommendations, resume tips, and job search strategies.',
    timestamp: new Date(),
  },
]

const suggestedQuestions = [
  'What career paths match my skills?',
  'How can I improve my resume?',
  'What skills are in demand?',
  'Help me prepare for interviews',
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentLang, setCurrentLang] = useState(languages[0])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    const userPrompt = input.trim()
    if (!userPrompt) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const token = getAccessToken()
      const data = await skillifyPostJson<{ reply: string }>(
        '/api/personalization/mentor',
        { message: userPrompt, language: currentLang.code },
        { token: token || undefined }
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error(err)
      const errMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I had trouble reaching the Skillfy AI engine. Please ensure your backend server is active and try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (question: string) => {
    setInput(question)
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="glow h-14 w-14 rounded-full p-0 shadow-lg"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="sr-only">Open chat</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:bottom-6 sm:right-6"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
              <div className="flex items-center gap-3">
                {showHistory ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHistory(false)}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">
                    {showHistory ? 'Chat History' : 'Skillify AI'}
                  </h3>
                  {!showHistory && (
                    <p className="text-xs text-muted-foreground">
                      Always here to help
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!showHistory && (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Globe className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setCurrentLang(lang)}
                          >
                            <span className="mr-2">{lang.flag}</span>
                            {lang.name}
                            {currentLang.code === lang.code && (
                              <span className="ml-auto text-primary">✓</span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowHistory(true)}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            {showHistory ? (
              <div className="h-96 overflow-y-auto p-4">
                <div className="space-y-3">
                  {[
                    { title: 'Career advice session', date: 'Today' },
                    { title: 'Resume review', date: 'Yesterday' },
                    { title: 'Interview preparation', date: '2 days ago' },
                  ].map((chat, i) => (
                    <button
                      key={i}
                      onClick={() => setShowHistory(false)}
                      className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary"
                    >
                      <div className="font-medium">{chat.title}</div>
                      <div className="text-xs text-muted-foreground">{chat.date}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="rounded-2xl bg-secondary px-4 py-3">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Suggestions */}
                {messages.length === 1 && (
                  <div className="border-t border-border px-4 py-3">
                    <p className="mb-2 text-xs text-muted-foreground">Suggested questions</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question) => (
                        <button
                          key={question}
                          onClick={() => handleSuggestionClick(question)}
                          className="rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="h-10 w-10 rounded-xl"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Chatting in {currentLang.flag} {currentLang.name}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
