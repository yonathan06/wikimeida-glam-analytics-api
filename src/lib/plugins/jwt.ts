import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { Unauthorized } from 'http-errors';
import { FastifyInstance, FastifyRequest } from 'fastify';

interface TokenData {
  username: string;
  glamId: string;
}

function verify(token: string, secret: string) {
  return new Promise<TokenData>((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

async function jwtPlugin(server: FastifyInstance) {
  const secret = process.env.JWT_SECRET;

  async function authenticate(req: FastifyRequest) {
    try {
      const data = await verify(req.headers.authorization.replace(/^Bearer /, ''), secret);

      req.log.info(data, 'authorized user');

      return data;
    } catch (error) {
      req.log.info(error, 'error verifying jwt');

      throw new Unauthorized();
    }
  }

  async function sign(payload: TokenData) {
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  server.decorate('signJWT', sign);

  server.decorateRequest('authenticate', authenticate);
}

export default fp(jwtPlugin);
