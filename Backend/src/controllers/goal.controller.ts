import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as goalService from '../services/goal.service.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const goals = await goalService.getGoals(req.userId!);
  res.json({ success: true, data: { goals } });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { title } = req.body;
  const goal = await goalService.createGoal(req.userId!, title);
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Goal created successfully', data: { goal } });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const result = await goalService.updateGoal(id!, req.userId!, { title, completed });
  res.json({ success: true, message: 'Goal updated successfully', data: result });
});

export const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await goalService.deleteGoal(id!, req.userId!);
  res.json({ success: true, message: 'Goal deleted successfully', data: result });
});
