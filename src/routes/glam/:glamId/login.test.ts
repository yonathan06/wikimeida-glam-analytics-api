import { FastifyInstance } from 'fastify';
import { createServer } from '../../../index';
import { MockGlam, MockUser } from '../../../test/__mock__/entities';
import jwt from 'jsonwebtoken';

describe('POST /glam/:glamId/login', () => {
  let server: FastifyInstance;
  const mockGlam = new MockGlam();
  const mockUser = new MockUser();
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.pg.pool.query(`DELETE FROM glams WHERE id = $1`, [mockGlam.id]);
    await server.pg.pool.query(`DELETE FROM glams_users WHERE glam_id = $1`, [mockGlam.id]);
    await server.close();
  });

  it('Should create new GLAM with user', async () => {
    const result = await server.pg.pool.query('INSERT INTO glams(id, name) VALUES($1, $2)', [
      mockGlam.id,
      mockGlam.name,
    ]);
    expect(result.rowCount).toBe(1);
    const userResult = await server.pg.pool.query(
      "INSERT INTO glams_users(glam_id, username, password) VALUES($1, $2, crypt($3, gen_salt('bf')))",
      [mockGlam.id, mockUser.username, mockUser.password],
    );
    expect(userResult.rowCount).toBe(1);
  });

  it('Should login', async () => {
    const response = await server.inject({
      method: 'POST',
      path: `/glam/${mockGlam.id}/login`,
      payload: mockUser,
    });
    expect(response.statusCode).toBe(200);
    const { token } = response.json();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    const decoded = jwt.decode(token);
    expect(decoded.glam_id).toBe(mockGlam.id);
    expect(decoded.username).toBe(mockUser.username);
  });

  it('Should not login', async () => {
    const response = await server.inject({
      method: 'POST',
      path: `/glam/${mockGlam.id}/login`,
      payload: {
        ...mockUser,
        password: '123',
      },
    });
    expect(response.statusCode).toBe(401);
  });
});
