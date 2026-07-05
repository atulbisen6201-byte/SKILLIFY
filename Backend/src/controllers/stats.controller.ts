import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as statsService from '../services/stats.service.js';

export const get = asyncHandler(async (req: Request, res: Response) => {
  const stats = await statsService.getDashboardStats(req.userId!);
  res.json({ success: true, data: stats });
});

export const record = asyncHandler(async (req: Request, res: Response) => {
  const result = await statsService.addStatsEntry(req.userId!, req.body);
  res.json({ success: true, message: 'Analytics entry recorded', data: result });
});
