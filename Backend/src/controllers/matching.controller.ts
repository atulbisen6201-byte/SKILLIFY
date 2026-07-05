import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as matchingService from '../services/matching.service.js';

export const match = asyncHandler(async (req: Request, res: Response) => {
  const matches = await matchingService.matchCareers(req.userId!);
  res.json({ success: true, message: 'Career matching complete', data: { matches } });
});
