import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as communityController from '../controllers/community.controller.js';

export const communityRouter = Router();

communityRouter.get('/posts', requireAuth, communityController.list);
communityRouter.post('/posts', requireAuth, communityController.create);
communityRouter.get('/posts/:id', requireAuth, communityController.getOne);
communityRouter.delete('/posts/:id', requireAuth, communityController.deleteOne);
communityRouter.post('/posts/:id/comment', requireAuth, communityController.comment);
communityRouter.post('/posts/:id/like', requireAuth, communityController.like);
