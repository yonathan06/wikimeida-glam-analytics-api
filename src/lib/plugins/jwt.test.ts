import fastify, { FastifyInstance } from 'fastify';
import jwtPlugin from './jwt';
import jwt from 'jsonwebtoken';

describe('jwt plugin', () => {
  describe('Server decoration', () => {
    let server: FastifyInstance;
    beforeAll(async () => {
      server = fastify();
      server.register(jwtPlugin);
      await server.ready();
    });

    afterAll(() => server.close());

    it('Should have signToken in server', async (done) => {
      expect(server.signToken).toBeDefined();
      const tokenData = { glamId: 'test-id', username: 'username' };
      const mockToken = await server.signToken(tokenData);

      jwt.verify(mockToken, process.env.JWT_SECRET, (err, decoded) => {
        expect(err).toBeNull();
        expect(decoded.glamId).toBe(tokenData.glamId);
        expect(decoded.username).toBe(tokenData.username);
        done();
      });
    });
  });

  describe('Request decoration', () => {
    let server: FastifyInstance;
    beforeAll(async () => {
      server = fastify();
      server.register(jwtPlugin);
    });

    afterAll(() => server.close());
    it('Should have authenticate() in request', async (done) => {
      server.get('/', (req) => {
        expect(req.authenticate).toBeDefined();
        done();
      });
      await server.ready();
      server.inject({
        method: 'GET',
        path: '/',
      });
    });
  });
});
