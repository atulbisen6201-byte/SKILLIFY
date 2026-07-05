import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;
  const result = await authService.signup(name, username, email, password);
  res.status(StatusCodes.CREATED).json({ success: true, message: 'User signed up successfully', data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json({ success: true, message: 'Logged in successfully', data: result });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Google credential is required' });
    return;
  }
  const result = await authService.googleLogin(credential);
  res.json({ success: true, message: 'Logged in successfully via Google', data: result });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Refresh token is required' });
    return;
  }
  const result = await authService.refresh(refreshToken);
  res.json({ success: true, message: 'Token refreshed successfully', data: result });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully', data: null });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, originUrl } = req.body;
  if (!email) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Email is required' });
    return;
  }
  
  // Use client origin as default fallback for constructing URLs
  const origin = originUrl || req.headers.origin || 'http://localhost:3000';
  await authService.forgotPassword(email, origin);
  res.json({ success: true, message: 'Password reset link sent to your email address', data: null });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Token and new password are required' });
    return;
  }
  await authService.resetPassword(token, password);
  res.json({ success: true, message: 'Your password has been successfully reset', data: null });
});
