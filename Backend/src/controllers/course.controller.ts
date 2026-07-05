import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as courseService from '../services/course.service.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const courses = await courseService.listCourses();
  res.json({ success: true, data: { courses } });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.getCourseById(req.params.id!);
  res.json({ success: true, data: { course } });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, skillId } = req.body as {
    title: string;
    description?: string;
    skillId: string;
  };
  const course = await courseService.createCourse(title, description, skillId);
  res.status(StatusCodes.CREATED).json({ success: true, data: { course } });
});
