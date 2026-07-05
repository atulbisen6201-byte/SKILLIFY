'use client'

import { PostCard } from './PostCard'
import { Loader2, MessageSquareDashed } from 'lucide-react'

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

interface CommunityFeedProps {
  posts: PostItem[]
  loading: boolean
  currentUserId?: string
  onLike: (postId: string) => Promise<void>
  onCommentSubmit: (postId: string, content: string) => Promise<void>
  isSubmittingComment: boolean
  savedPostsIds: string[]
  onToggleSave: (postId: string) => void
}

export function CommunityFeed({
  posts,
  loading,
  currentUserId,
  onLike,
  onCommentSubmit,
  isSubmittingComment,
  savedPostsIds,
  onToggleSave,
}: CommunityFeedProps) {
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((num) => (
          <div key={num} className="rounded-2xl border border-border bg-card/45 p-5 animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-secondary rounded-full" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-28 bg-secondary rounded" />
                <div className="h-2 w-20 bg-secondary rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-secondary rounded" />
              <div className="h-3 w-5/6 bg-secondary rounded" />
              <div className="h-3 w-4/6 bg-secondary rounded" />
            </div>
            <div className="h-8 bg-secondary/60 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border border-dashed p-10 flex flex-col items-center justify-center text-center bg-card/20 space-y-3">
        <MessageSquareDashed className="h-12 w-12 text-muted-foreground animate-bounce" />
        <h4 className="font-semibold text-sm text-foreground">No discussions found</h4>
        <p className="text-xs text-muted-foreground max-w-sm">
          Be the first to share an achievement, job update, or ask a career question!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onLike={onLike}
          onCommentSubmit={onCommentSubmit}
          isSubmittingComment={isSubmittingComment}
          isSaved={savedPostsIds.includes(post.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  )
}
