import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { Unauthorized } from 'http-errors';
import { FastifyInstance, FastifyRequest } from 'fastify';
import loadConfig from '@lib/config';
loadConfig();
interface TokenData {
  username: string;
  glamId: string;
}

async function jwtPlugin(server: FastifyInstance) {
  const secret = process.env.JWT_SECRET;

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
    return new Promise((res, rej) => {
      jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN }, (err, token) => {
        if (err) {
          rej(err);
        } else {
          res(token);
        }
      });
    });
  }

  server.decorate('signToken', sign);

  server.decorateRequest('authenticate', authenticate);
}

declare module 'fastify' {
  interface FastifyInstance {
    signToken: (payload: TokenData) => Promise<string>;
  }
  interface FastifyRequest {
    authenticate(): (req: this) => Promise<TokenData>;
  }
}

export default fp(jwtPlugin);
