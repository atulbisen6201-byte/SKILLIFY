import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as profileController from '../controllers/profile.controller.js';

export const profileRouter = Router();

profileRouter.get('/', requireAuth, profileController.get);
profileRouter.put('/', requireAuth, profileController.update);
