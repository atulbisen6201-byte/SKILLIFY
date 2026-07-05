import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { userRouter } from './user.routes.js';
import { courseRouter } from './course.routes.js';
import { enrollRouter, enrollmentsRouter } from './enrollment.routes.js';
import { resumeRouter } from './resume.routes.js';
import { profileRouter } from './profile.routes.js';
import { goalRouter } from './goal.routes.js';
import { statsRouter } from './stats.routes.js';
import { communityRouter } from './community.routes.js';
import { matchingRouter } from './matching.routes.js';
import { personalizationRouter } from './personalization.routes.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as userController from '../controllers/user.controller.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/courses', courseRouter);
apiRouter.use('/enroll', enrollRouter);
apiRouter.use('/enrollments', enrollmentsRouter);
apiRouter.use('/resumes', resumeRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/goals', goalRouter);
apiRouter.use('/stats', statsRouter);
apiRouter.use('/community', communityRouter);
apiRouter.use('/matching', matchingRouter);
apiRouter.use('/personalization', personalizationRouter);

// Main-level short auth endpoints
apiRouter.get('/me', requireAuth, userController.me);
apiRouter.delete('/account', requireAuth, userController.deleteAccount);
