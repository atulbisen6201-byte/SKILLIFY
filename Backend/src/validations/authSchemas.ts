import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1).max(120),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username must be alphanumeric and can contain underscores'),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});
