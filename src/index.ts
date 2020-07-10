import path from 'path';

import fastify from 'fastify';
import cors from 'fastify-cors';
import now from 'fastify-now';
import swagger from 'fastify-swagger';
import jwt from '@lib/plugins/jwt';
import pg from '@lib/plugins/pg';
import { getPostgratorInstance } from '@lib/migration';

// Load env vars
import loadConfig from '@lib/config';
loadConfig();

export async function startServer() {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
  });
  server.register(cors, {
    credentials: true,
  });
  if (process.env.NODE_ENV !== 'test') {
    server.register(swagger, {
      swagger: {
        info: {
          title: 'Wikimedia GLAM Analytics API',
          description: 'api server wikimedia glam analytics',
          version: '0.1',
        },
      },
      exposeRoute: true,
    });
  }

  server.register(jwt);
  server.register(pg);

  server.register(now, {
    routesFolder: path.join(__dirname, './routes'),
  });

  await server.listen(+process.env.API_PORT, process.env.API_HOST);
  return server;
}

async function spinProcess() {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const postgrator = getPostgratorInstance();

  const expectedVersion = await postgrator.getMaxVersion();
  const currentVersion = await postgrator.getDatabaseVersion();

  if (currentVersion !== expectedVersion) {
    console.error(`expected version ${expectedVersion}, but db is at version ${currentVersion}`);
    process.exit(1);
  }

  const server = await startServer();

  if (process.env.NODE_ENV === 'production') {
    for (const signal of ['SIGINT', 'SIGTERM']) {
      process.on(signal, () =>
        server.close().then((err) => {
          console.log(`close application on ${signal}`);
          process.exit(err ? 1 : 0);
        }),
      );
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  spinProcess();
}
