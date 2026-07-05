'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageSquare, Share2, Bookmark, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CommentItem {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
    avatar: string
  }
}

interface PostItem {
  id: string
  author: {
    name: string
    avatar: string
    role: string
  }
  title: string
  content: string
  likes: number
  comments: number
  timeAgo: string
  tags: string[]
  commentsList: CommentItem[]
  likesList: string[]
}

interface PostCardProps {
  post: PostItem
  currentUserId?: string
  onLike: (postId: string) => Promise<void>
  onCommentSubmit: (postId: string, content: string) => Promise<void>
  isSubmittingComment: boolean
  isSaved: boolean
  onToggleSave: (postId: string) => void
}

export function PostCard({
  post,
  currentUserId,
  onLike,
  onCommentSubmit,
  isSubmittingComment,
  isSaved,
  onToggleSave,
}: PostCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [isShareSuccess, setIsShareSuccess] = useState(false)

  const isLiked = currentUserId ? post.likesList.includes(currentUserId) : false

  // Parse category prefix if available in title (e.g. [Achievement])
  const categoryMatch = post.title.match(/^\[(.*?)\]/)
  const displayCategory = categoryMatch ? categoryMatch[1] : null
  const cleanTitle = categoryMatch ? post.title.replace(/^\[.*?\]\s*/, '') : post.title

  // Extract simulated local image if saved
  const [postImage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedImages = localStorage.getItem('skillify_post_images')
      if (storedImages) {
        try {
          const parsed = JSON.parse(storedImages)
          return parsed[post.id] || null
        } catch {
          return null
        }
      }
    }
    return null
  })

  const handleCommentSubmitLocal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim()) return
    await onCommentSubmit(post.id, commentInput)
    setCommentInput('')
  }

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/community#post-${post.id}`)
      setIsShareSuccess(true)
      setTimeout(() => setIsShareSuccess(false), 2000)
    }
  }

  return (
    <div id={`post-${post.id}`} className="rounded-2xl border border-border bg-card/45 backdrop-blur-md p-5 shadow-lg space-y-4 hover:border-primary/20 transition-colors relative">
      {/* Post Author Details */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 font-bold text-white text-sm shadow-inner">
          {post.author.avatar}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight text-foreground truncate">{post.author.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{post.author.role}</p>
        </div>
        
        {/* Save/Bookmark & Time row */}
        <div className="ml-auto flex items-center gap-2.5">
          <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
          <button
            onClick={() => onToggleSave(post.id)}
            className={`rounded-full p-1.5 border border-border bg-background/50 hover:bg-secondary/40 transition-colors ${
              isSaved ? 'text-primary' : 'text-muted-foreground'
            }`}
            title={isSaved ? 'Unsave Discussion' : 'Save Discussion'}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="space-y-2">
        {/* Category Badging */}
        {displayCategory && (
          <span className="inline-block rounded-full bg-gradient-to-r from-blue-600/10 to-violet-600/10 border border-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary capitalize">
            {displayCategory}
          </span>
        )}
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {cleanTitle && cleanTitle.length > 20 && (
            <span className="block font-bold text-sm mb-1.5 text-foreground leading-normal">{cleanTitle}</span>
          )}
          {post.content}
        </p>
      </div>

      {/* Optional Post Image */}
      {postImage && (
        <div className="rounded-xl border border-border overflow-hidden bg-secondary/10 flex items-center justify-center max-h-72">
          <img src={postImage} alt="Post Attachment" className="max-h-64 object-contain" />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary/50 border border-border/20 px-2.5 py-0.5 text-[10px] text-muted-foreground font-medium"
            >
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </div>
      )}

      {/* Interactions Stats & Buttons */}
      <div className="border-t border-border/40 pt-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          {/* Like Button */}
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 transition-all hover:scale-105 ${
              isLiked ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes}</span>
          </button>

          {/* Comment toggle button */}
          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className={`flex items-center gap-1.5 transition-all hover:scale-105 ${
              isCommentsOpen ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShareClick}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-all hover:scale-105 relative"
        >
          <Share2 className="h-4 w-4" />
          <span>{isShareSuccess ? 'Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Comment Drawer list */}
      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/30 pt-3 space-y-3"
          >
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {post.commentsList.length === 0 ? (
                <p className="text-[10px] text-muted-foreground py-2 text-center">No comments yet. Write one below!</p>
              ) : (
                post.commentsList.map((c) => (
                  <div key={c.id} className="flex gap-2.5 items-start text-xs rounded-xl bg-secondary/35 p-2.5 border border-border/25">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-[9px] border border-primary/20">
                      {c.user.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[10px] text-foreground/90 leading-tight">{c.user.name}</p>
                      <p className="text-muted-foreground mt-0.5 text-[10.5px] leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment entry Form */}
            <form onSubmit={handleCommentSubmitLocal} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 rounded-xl border border-input bg-background/50 px-3.5 py-2 text-xs outline-none focus:border-primary transition-colors"
                required
              />
              <Button type="submit" size="sm" disabled={isSubmittingComment || !commentInput.trim()} className="rounded-xl text-[10px]">
                <Send className="h-3 w-3" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
