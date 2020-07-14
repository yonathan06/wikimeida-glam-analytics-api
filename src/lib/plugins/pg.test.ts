import fastify, { FastifyInstance } from 'fastify';
import pgPlugin from './pg';
import { Pool } from 'pg';
describe('pg plugin', () => {
  let server: FastifyInstance;
  beforeAll(async () => {
    server = fastify();
    server.register(pgPlugin);
    await server.ready();
  });

  afterAll(() => server.close());

  it('Should have pg in server', () => {
    expect(server.pg).toBeDefined();
    expect(server.pg.pool).toBeDefined();
    expect(server.pg.pool instanceof Pool).toBeTruthy();
    expect(server.pg.pool.query).toBeDefined();
  });
});
