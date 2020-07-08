import path from 'path';

import fastify from 'fastify';
import cors from 'fastify-cors';
import now from 'fastify-now';
import swagger from 'fastify-swagger';
import jwt from "@lib/plugins/jwt";
import pg from "@lib/plugins/pg";
import { getPostgratorInstance } from '@lib/migration';

// Load env vars
import loadConfig from '@lib/config';
loadConfig();

(async function () {
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

  const server = fastify({ logger: true });

  server.register(cors, {
    credentials: true,
  });

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

  server.register(jwt);
  server.register(pg);

  server.register(now, {
    routesFolder: path.join(__dirname, './routes'),
  });

  const address = await server.listen(+process.env.PORT);

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
      server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }),
    );
  }
})();
