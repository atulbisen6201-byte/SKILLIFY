'use client'

import { useState, useRef } from 'react'
import { Image as ImageIcon, Sparkles, Send, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CreatePostCardProps {
  onPostCreated: (content: string, category: string, image?: string) => Promise<void>
  isSubmitting: boolean
}

export function CreatePostCard({ onPostCreated, isSubmitting }: CreatePostCardProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Career Question')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    'Achievement',
    'Job Update',
    'Learning Progress',
    'Career Question'
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      await onPostCreated(content, category, imagePreview || undefined)
      setContent('')
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card/45 backdrop-blur-md p-5 shadow-xl relative overflow-hidden">
      {/* Decorative top gradient boundary */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content Input Area */}
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your career update with the Skillfy community..."
            rows={3}
            className="w-full resize-none rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary transition-colors leading-relaxed"
            required
          />
        </div>

        {/* Image Preview Panel */}
        {imagePreview && (
          <div className="relative rounded-xl border border-border overflow-hidden max-h-60 bg-secondary/20 flex items-center justify-center">
            <img src={imagePreview} alt="Upload preview" className="max-h-56 object-contain" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2.5 right-2.5 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors shadow-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
          <div className="flex items-center gap-3">
            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm'
                      : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Image attachment button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-all border border-border bg-background"
              title="Add Image"
            >
              <ImageIcon className="h-4.5 w-4.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="rounded-xl px-5 font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Send className="h-3.5 w-3.5" />
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}
