import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as matchingController from '../controllers/matching.controller.js';

export const matchingRouter = Router();

matchingRouter.post('/match', requireAuth, matchingController.match);
