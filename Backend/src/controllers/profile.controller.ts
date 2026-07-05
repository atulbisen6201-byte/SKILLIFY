import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as profileService from '../services/profile.service.js';

export const get = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.getProfile(req.userId!);
  res.json({ success: true, data: { profile } });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.updateProfile(req.userId!, req.body);
  res.json({ success: true, message: 'Profile updated successfully', data: { profile } });
});
