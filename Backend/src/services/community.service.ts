import { communityRepository } from '../repositories/community.repository.js';
import { AppError } from '../utils/AppError.js';

export async function createPost(userId: string, title: string, content: string) {
  if (!title || !content) throw AppError.badRequest('Title and content are required');
  return communityRepository.createPost(userId, title, content);
}

export async function listPosts() {
  const posts = await communityRepository.findManyPosts();
  return posts.map((p) => ({
    id: p.id,
    author: {
      name: p.user.fullName,
      avatar: p.user.profileImage || p.user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
      role: 'Community Member',
    },
    title: p.title,
    content: p.content,
    likes: p.likesCount,
    comments: p.comments.length,
    timeAgo: formatTimeAgo(p.createdAt),
    tags: extractTags(p.title + ' ' + p.content),
    commentsList: p.comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      user: {
        name: c.user.fullName,
        avatar: c.user.profileImage || c.user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
      },
    })),
    likesList: p.likes.map((l) => l.userId),
  }));
}

export async function getPost(id: string) {
  const post = await communityRepository.findPostById(id);
  if (!post) throw AppError.notFound('Post not found');
  return post;
}

export async function deletePost(id: string, userId: string) {
  const result = await communityRepository.deletePost(id, userId);
  if (result.count === 0) throw AppError.unauthorized('Unable to delete post');
  return { success: true };
}

export async function commentOnPost(postId: string, userId: string, content: string) {
  if (!content) throw AppError.badRequest('Comment content is required');
  const post = await communityRepository.findPostById(postId);
  if (!post) throw AppError.notFound('Post not found');

  return communityRepository.createComment(postId, userId, content);
}

export async function toggleLikePost(postId: string, userId: string) {
  const post = await communityRepository.findPostById(postId);
  if (!post) throw AppError.notFound('Post not found');

  return communityRepository.toggleLike(postId, userId);
}

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function extractTags(text: string): string[] {
  const knownTags = [
    'Career Switch', 'Product Management', 'Tech', 'Resume', 'FAANG', 'Job Search',
    'Salary', 'Negotiation', 'Career Growth', 'Design', 'Portfolio', 'Interviews',
    'AI', 'Remote', 'Kubernetes', 'AWS', 'Developer'
  ];
  return knownTags.filter((tag) => text.toLowerCase().includes(tag.toLowerCase()));
}
