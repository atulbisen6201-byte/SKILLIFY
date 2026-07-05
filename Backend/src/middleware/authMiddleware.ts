import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import type { Role } from '../utils/jwt.js';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    userRole?: Role;
  }
}

function extractBearer(req: Request): string | null {
  const h = req.header('Authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return h.slice(7).trim();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractBearer(req);
    if (!token) throw AppError.unauthorized();
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    next(AppError.unauthorized());
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.userId || !req.userRole) {
      return next(AppError.unauthorized());
    }
    if (!roles.includes(req.userRole)) {
      return next(new AppError(StatusCodes.FORBIDDEN, 'Insufficient permissions', 'FORBIDDEN'));
    }
    next();
  };
}
