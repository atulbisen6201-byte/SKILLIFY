import { prisma } from '../prisma/client.js';

export class CommunityRepository {
  async createPost(userId: string, title: string, content: string) {
    return prisma.communityPost.create({
      data: {
        userId,
        title,
        content,
        likesCount: 0,
      },
      include: {
        user: {
          select: { id: true, fullName: true, profileImage: true },
        },
      },
    });
  }

  async findPostById(id: string) {
    return prisma.communityPost.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, profileImage: true } },
        comments: {
          include: {
            user: { select: { id: true, fullName: true, profileImage: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
      },
    });
  }

  async findManyPosts() {
    return prisma.communityPost.findMany({
      include: {
        user: { select: { id: true, fullName: true, profileImage: true } },
        comments: {
          include: {
            user: { select: { id: true, fullName: true, profileImage: true } },
          },
        },
        likes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePost(id: string, userId: string, data: { title?: string; content?: string }) {
    return prisma.communityPost.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deletePost(id: string, userId: string) {
    return prisma.communityPost.deleteMany({
      where: { id, userId },
    });
  }

  async createComment(postId: string, userId: string, content: string) {
    return prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
      include: {
        user: { select: { id: true, fullName: true, profileImage: true } },
      },
    });
  }

  async deleteComment(id: string, userId: string) {
    return prisma.comment.deleteMany({
      where: { id, userId },
    });
  }

  async toggleLike(postId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.postLike.findUnique({
        where: {
          postId_userId: { postId, userId },
        },
      });

      if (existing) {
        // Unlike
        await tx.postLike.delete({
          where: {
            postId_userId: { postId, userId },
          },
        });
        const post = await tx.communityPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        });
        return { liked: false, likesCount: post.likesCount };
      } else {
        // Like
        await tx.postLike.create({
          data: { postId, userId },
        });
        const post = await tx.communityPost.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        });
        return { liked: true, likesCount: post.likesCount };
      }
    });
  }
}

export const communityRepository = new CommunityRepository();
