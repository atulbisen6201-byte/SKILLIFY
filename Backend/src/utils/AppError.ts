import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(StatusCodes.BAD_REQUEST, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(StatusCodes.UNAUTHORIZED, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(StatusCodes.FORBIDDEN, message, 'FORBIDDEN');
  }

  static notFound(message = 'Not found') {
    return new AppError(StatusCodes.NOT_FOUND, message, 'NOT_FOUND');
  }

  static conflict(message: string) {
    return new AppError(StatusCodes.CONFLICT, message, 'CONFLICT');
  }

  static tooMany(message = 'Too many requests') {
    return new AppError(StatusCodes.TOO_MANY_REQUESTS, message, 'RATE_LIMIT');
  }

  static internal(message = 'Internal server error') {
    return new AppError(StatusCodes.INTERNAL_SERVER_ERROR, message, 'INTERNAL');
  }
}
