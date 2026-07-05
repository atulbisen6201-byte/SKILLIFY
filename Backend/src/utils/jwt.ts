import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type Role = 'USER' | 'ADMIN';

export type AccessPayload = { sub: string; role: Role; type: 'access' };
export type RefreshPayload = { sub: string; type: 'refresh' };

export function signAccessToken(userId: string, role: Role): string {
  const payload: AccessPayload = { sub: userId, role, type: 'access' };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as AccessPayload;
  if (decoded.type !== 'access') throw new Error('Invalid token type');
  return decoded;
}

export function signRefreshToken(userId: string): string {
  const payload: RefreshPayload = { sub: userId, type: 'refresh' };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyRefreshToken(token: string): RefreshPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
  if (decoded.type !== 'refresh') throw new Error('Invalid token type');
  return decoded;
}
