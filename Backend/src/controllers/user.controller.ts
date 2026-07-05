import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getMe(req.userId!);
  res.json({ success: true, data: { user } });
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteAccount(req.userId!);
  res.json({ success: true, message: 'Account deleted successfully', data: null });
});
