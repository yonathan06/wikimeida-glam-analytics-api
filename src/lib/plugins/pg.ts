import fp from 'fastify-plugin';
import pg from 'pg';
import fastifyPg from 'fastify-postgres';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    pg: pg.Client;
  }
}

async function plugin(server: FastifyInstance) {
  const config = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
  };
  server.register(fastifyPg, config);
}

export default fp(plugin);
