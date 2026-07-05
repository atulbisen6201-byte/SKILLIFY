import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_PREFIX: z.string().default('/api'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  EMAIL_SERVICE: z.string().optional().default(''),
  EMAIL_USER: z.string().optional().default(''),
  EMAIL_PASSWORD: z.string().optional().default(''),
  GEMINI_API_KEY: z.string().optional().default(''),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  // If JWT_SECRET is not set but JWT_ACCESS_SECRET is, fallback to that to prevent breaking local dev
  if (!process.env.JWT_SECRET && process.env.JWT_ACCESS_SECRET) {
    process.env.JWT_SECRET = process.env.JWT_ACCESS_SECRET;
  }
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    throw new Error(`Invalid environment: ${JSON.stringify(msg)}`);
  }
  return parsed.data;
}

export const env = loadEnv();
