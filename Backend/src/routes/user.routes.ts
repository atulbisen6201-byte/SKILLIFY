import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as userController from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.get('/me', requireAuth, userController.me);
