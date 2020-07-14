import { FastifyInstance } from 'fastify';
import { createServer } from '../../../index';
import { MockGlam } from '../../../test/__mock__/entities';

describe('GET /glam/:glamId', () => {
  let server: FastifyInstance;
  const mockGlam = new MockGlam();
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.pg.pool.query(`DELETE FROM glams WHERE id = $1`, [mockGlam.id]);
    await server.pg.pool.query('DELETE FROM glams_items WHERE glam_id = $1', [mockGlam.id]);
    await server.close();
  });

  it('Should create new GLAM', async () => {
    const result = await server.pg.pool.query('INSERT INTO glams(id, name) VALUES($1, $2)', [
      mockGlam.id,
      mockGlam.name,
    ]);
    expect(result.rowCount).toBe(1);
  });

  it('Should get GLAM data', async () => {
    const response = await server.inject({
      method: 'GET',
      path: `/glam/${mockGlam.id}`,
    });
    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.id).toBe(mockGlam.id);
    expect(json.name).toBe(mockGlam.name);
  });
});
