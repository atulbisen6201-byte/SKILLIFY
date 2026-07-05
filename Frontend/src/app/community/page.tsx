'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAccessToken, getStoredUser } from '@/lib/auth-client'
import { skillifyGetJson, skillifyPostJson } from '@/lib/skillify-api'
import { Users } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { ChatWidget } from '@/components/chat-widget'
import { RequireAuth } from '@/components/require-auth'

// Sub-components Imports
import { CommunitySidebar, ActiveMenu } from './components/CommunitySidebar'
import { CreatePostCard } from './components/CreatePostCard'
import { CommunityFeed } from './components/CommunityFeed'
import { TrendingSkillsCard } from './components/TrendingSkillsCard'
import { CareerTipCard } from './components/CareerTipCard'
import { TopContributorsCard } from './components/TopContributorsCard'
import { UpcomingEventsCard } from './components/UpcomingEventsCard'

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

export default function CommunityPage() {
  return (
    <RequireAuth>
      <CommunityContent />
    </RequireAuth>
  )
}

function CommunityContent() {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('feed')
  const [user, setUser] = useState<any>(null)

  // Saved Posts tracking
  const [savedPostsIds, setSavedPostsIds] = useState<string[]>([])

  // Submitting States
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const loadPosts = async () => {
    try {
      setLoadingPosts(true)
      const res = await skillifyGetJson<{ posts: PostItem[] }>('/api/community/posts')
      if (res?.posts) {
        setPosts(res.posts)
      }
    } catch (err) {
      console.error('Failed to load posts:', err)
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    setUser(getStoredUser())
    loadPosts()

    // Load saved posts mapping
    const storedSaved = localStorage.getItem('skillify_saved_posts')
    if (storedSaved) {
      try {
        setSavedPostsIds(JSON.parse(storedSaved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Create new post
  const handlePostCreated = async (content: string, category: string, image?: string) => {
    const token = getAccessToken()
    if (!token) {
      alert('Please sign in to publish a post.')
      return
    }

    try {
      setIsSubmittingPost(true)
      // Map category tag inside brackets in the title field
      const title = `[${category}] ${content.substring(0, 45)}...`
      const res = await skillifyPostJson<{ post: { id: string } }>(
        '/api/community/posts',
        { title, content },
        { token }
      )

      // Save image to local cache if present
      if (res?.post?.id && image) {
        const storedImages = localStorage.getItem('skillify_post_images')
        let imgObj: Record<string, string> = {}
        if (storedImages) {
          try {
            imgObj = JSON.parse(storedImages)
          } catch {}
        }
        imgObj[res.post.id] = image
        localStorage.setItem('skillify_post_images', JSON.stringify(imgObj))
      }

      await loadPosts()
    } catch (err) {
      console.error('Failed to publish post:', err)
      alert(err instanceof Error ? err.message : 'Failed to publish post.')
    } finally {
      setIsSubmittingPost(false)
    }
  }

  // Handle post like
  const handleToggleLike = async (postId: string) => {
    const token = getAccessToken()
    if (!token) {
      alert('Please sign in to like posts.')
      return
    }

    try {
      const res = await skillifyPostJson<{ likesCount: number; liked: boolean }>(
        `/api/community/posts/${postId}/like`,
        {},
        { token }
      )

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const nextLikesList = res.liked
              ? [...p.likesList, user?.id].filter(Boolean)
              : p.likesList.filter((id) => id !== user?.id)
            return {
              ...p,
              likes: res.likesCount,
              likesList: nextLikesList,
            }
          }
          return p
        })
      )
    } catch (err) {
      console.error('Failed to like post:', err)
    }
  }

  // Handle comment submit
  const handleCommentSubmit = async (postId: string, content: string) => {
    const token = getAccessToken()
    if (!token) {
      alert('Please sign in to comment.')
      return
    }

    try {
      setIsSubmittingComment(true)
      const res = await skillifyPostJson<{ comment: any }>(
        `/api/community/posts/${postId}/comment`,
        { content },
        { token }
      )

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const newCommentItem: CommentItem = {
              id: res.comment.id,
              content: res.comment.content,
              createdAt: res.comment.createdAt,
              user: {
                name: res.comment.user.name,
                avatar: res.comment.user.avatar || res.comment.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
              },
            }
            return {
              ...p,
              comments: p.comments + 1,
              commentsList: [...p.commentsList, newCommentItem],
            }
          }
          return p
        })
      )
    } catch (err) {
      console.error('Failed to submit comment:', err)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // Save/Bookmark toggle handler
  const handleToggleSave = (postId: string) => {
    let nextSaved = [...savedPostsIds]
    if (nextSaved.includes(postId)) {
      nextSaved = nextSaved.filter((id) => id !== postId)
    } else {
      nextSaved.push(postId)
    }
    setSavedPostsIds(nextSaved)
    localStorage.setItem('skillify_saved_posts', JSON.stringify(nextSaved))
  }

  // Filter feed items based on sidebar menu selection
  const filteredPosts = posts.filter((post) => {
    if (activeMenu === 'my-posts') {
      return post.author.name === user?.name
    }
    if (activeMenu === 'saved-posts') {
      return savedPostsIds.includes(post.id)
    }
    return true
  })

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* App Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen p-4 pt-16 lg:p-8 lg:pt-8 bg-background">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold lg:text-3xl flex items-center gap-2">
                <Users className="h-7 w-7 text-primary animate-pulse" /> Community Feed
              </h1>
              <p className="text-muted-foreground mt-1">Connect, share achievements, and discuss career queries with tech professionals.</p>
            </div>

            {/* Three-Column Responsive Grid */}
            <div className="grid gap-6 md:grid-cols-4">
              
              {/* Column 1: LEFT SIDEBAR (Sticky) */}
              <div className="md:col-span-1">
                <div className="sticky top-6 space-y-4">
                  <CommunitySidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                </div>
              </div>

              {/* Column 2 & 3: CENTER FEED */}
              <div className="md:col-span-2 space-y-5">
                <CreatePostCard onPostCreated={handlePostCreated} isSubmitting={isSubmittingPost} />
                <CommunityFeed
                  posts={filteredPosts}
                  loading={loadingPosts}
                  currentUserId={user?.id}
                  onLike={handleToggleLike}
                  onCommentSubmit={handleCommentSubmit}
                  isSubmittingComment={isSubmittingComment}
                  savedPostsIds={savedPostsIds}
                  onToggleSave={handleToggleSave}
                />
              </div>

              {/* Column 4: RIGHT SIDEBAR (Sticky widgets) */}
              <div className="md:col-span-1">
                <div className="sticky top-6 space-y-6">
                  <TrendingSkillsCard />
                  <CareerTipCard />
                  <TopContributorsCard />
                  <UpcomingEventsCard />
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
      <ChatWidget />
    </div>
  )
}
