import fp from 'fastify-plugin';
import pg from 'pg';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    pg: {
      pool: pg.Pool;
    };
  }
}

function fastifyPostgres(server: FastifyInstance, options: pg.PoolConfig, next) {
  const config = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
  };
  const pool = new pg.Pool(config);
  pool.on('error', (err) => {
    server.log.error('Pg pool error: Unexpected error on idle client', err);
    process.exit(-1);
  });
  server.addHook('onClose', (server, done) => pool.end(done));
  const db = {
    pool,
  };
  server.decorate('pg', db);

  next();
}

export default fp(fastifyPostgres);
