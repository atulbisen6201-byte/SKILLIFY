import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as personalizationService from '../services/personalization.service.js';

export const getData = asyncHandler(async (req: Request, res: Response) => {
  const data = await personalizationService.getPersonalizationData(req.userId!);
  res.json({ success: true, data });
});

export const mentor = asyncHandler(async (req: Request, res: Response) => {
  const { message, language } = req.body;
  const reply = await personalizationService.generateMentorReply(req.userId!, message || '', language || 'en');
  res.json({ success: true, data: { reply } });
});
