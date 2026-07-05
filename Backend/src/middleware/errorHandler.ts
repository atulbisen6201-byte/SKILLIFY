import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      errors: err.flatten(),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code ?? 'APP_ERROR',
      message: err.message,
      details: err.details,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: 'INTERNAL',
    message:
      env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err instanceof Error
          ? err.message
          : 'Unknown error',
  });
}
