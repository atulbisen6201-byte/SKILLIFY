import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { courseIdParamSchema, createCourseSchema } from '../validations/courseSchemas.js';
import * as courseController from '../controllers/course.controller.js';

export const courseRouter = Router();

courseRouter.get('/', courseController.list);
courseRouter.get('/:id', validate({ params: courseIdParamSchema }), courseController.getOne);
courseRouter.post('/', requireAuth, validate({ body: createCourseSchema }), courseController.create);
