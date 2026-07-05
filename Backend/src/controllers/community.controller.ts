import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as communityService from '../services/community.service.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await communityService.listPosts();
  res.json({ success: true, data: { posts } });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const post = await communityService.createPost(req.userId!, title, content);
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Post created successfully', data: { post } });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await communityService.getPost(id!);
  res.json({ success: true, data: { post } });
});

export const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await communityService.deletePost(id!, req.userId!);
  res.json({ success: true, message: 'Post deleted successfully', data: result });
});

export const comment = asyncHandler(async (req: Request, res: Response) => {
  const { id: postId } = req.params;
  const { content } = req.body;
  const comment = await communityService.commentOnPost(postId!, req.userId!, content);
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Comment added successfully', data: { comment } });
});

export const like = asyncHandler(async (req: Request, res: Response) => {
  const { id: postId } = req.params;
  const result = await communityService.toggleLikePost(postId!, req.userId!);
  res.json({ success: true, message: result.liked ? 'Post liked' : 'Post unliked', data: result });
});
