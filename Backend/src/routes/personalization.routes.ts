import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as personalizationController from '../controllers/personalization.controller.js';

export const personalizationRouter = Router();

personalizationRouter.use(requireAuth);

personalizationRouter.get('/', personalizationController.getData);
personalizationRouter.post('/mentor', personalizationController.mentor);
