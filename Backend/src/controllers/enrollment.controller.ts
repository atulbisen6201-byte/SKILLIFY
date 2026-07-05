import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as enrollmentService from '../services/enrollment.service.js';

export const enroll = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.body as { courseId: string };
  const enrollment = await enrollmentService.enrollUser(req.userId!, courseId);
  res.status(StatusCodes.CREATED).json({ success: true, data: { enrollment } });
});

export const listMine = asyncHandler(async (req: Request, res: Response) => {
  const enrollments = await enrollmentService.listEnrollmentsForUser(req.userId!);
  res.json({ success: true, data: { enrollments } });
});
