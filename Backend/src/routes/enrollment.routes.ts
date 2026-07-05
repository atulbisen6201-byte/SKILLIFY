import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { enrollSchema } from '../validations/enrollmentSchemas.js';
import * as enrollmentController from '../controllers/enrollment.controller.js';

export const enrollRouter = Router();
enrollRouter.post('/', requireAuth, validate({ body: enrollSchema }), enrollmentController.enroll);

export const enrollmentsRouter = Router();
enrollmentsRouter.get('/', requireAuth, enrollmentController.listMine);
