import { createServer } from 'node:http';
import { env } from './config/env.js';
// Triggering dev server reload to pick up updated .env database settings
import { createApp } from './app.js';
import { prisma } from './prisma/client.js';

const app = createApp();
const httpServer = createServer(app);

httpServer.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Skillify API listening on http://localhost:${env.PORT}${env.API_PREFIX} (${env.NODE_ENV})`);
});

const shutdown = async (signal: string) => {
  // eslint-disable-next-line no-console
  console.info(`${signal} received, shutting down…`);
  await prisma.$disconnect();
  httpServer.close(() => process.exit(0));
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
