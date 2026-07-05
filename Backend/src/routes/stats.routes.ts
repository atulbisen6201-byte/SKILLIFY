import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as statsController from '../controllers/stats.controller.js';

export const statsRouter = Router();

statsRouter.get('/', requireAuth, statsController.get);
statsRouter.post('/record', requireAuth, statsController.record);
