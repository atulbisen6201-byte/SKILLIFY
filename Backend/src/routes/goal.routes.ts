import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as goalController from '../controllers/goal.controller.js';

export const goalRouter = Router();

goalRouter.get('/', requireAuth, goalController.list);
goalRouter.post('/', requireAuth, goalController.create);
goalRouter.put('/:id', requireAuth, goalController.update);
goalRouter.delete('/:id', requireAuth, goalController.deleteOne);
