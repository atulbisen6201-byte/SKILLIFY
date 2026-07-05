import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((s) => s.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (env.NODE_ENV === 'development') {
          if (
            origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:') ||
            origin.startsWith('http://172.') ||
            origin.startsWith('http://192.')
          ) {
            return callback(null, true);
          }
        }
        if (allowedOrigins.indexOf(origin) !== -1) {
          return callback(null, true);
        } else {
          return callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));
  
  // Serve resume uploads directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  app.use(apiLimiter);

  app.use(env.API_PREFIX, apiRouter);

  app.use(errorHandler);

  return app;
}
