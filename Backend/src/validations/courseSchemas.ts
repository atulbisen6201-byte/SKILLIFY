import { z } from 'zod';

export const courseIdParamSchema = z.object({
  id: z.string().cuid('Invalid course ID format')
});

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  skillId: z.string().cuid('Invalid skill ID format')
});
