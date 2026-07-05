import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as resumeController from '../controllers/resume.controller.js';

export const resumeRouter = Router();

resumeRouter.use(requireAuth);

resumeRouter.post('/', resumeController.create);
resumeRouter.post('/upload', resumeController.upload);
resumeRouter.get('/', resumeController.list);
resumeRouter.get('/:id', resumeController.getOne);
resumeRouter.delete('/:id', resumeController.deleteOne);
