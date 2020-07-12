import { FastifyInstance } from 'fastify';
import { createServer } from '../../index';
import { MockMediaList, newMockGlam } from '../__mock__/entities';

describe('New GLAM basic flow', () => {
  let server: FastifyInstance;
  const MockGlam = newMockGlam();
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.pg.pool.query('DELETE FROM glams_items WHERE glam_id = $1', [MockGlam.id]);
    await server.pg.pool.query(`DELETE FROM glams WHERE id = $1`, [MockGlam.id]);
    await server.close();
  });

  it('Should create new GLAM with items', async () => {
    const result = await server.pg.pool.query('INSERT INTO glams(id, name) VALUES($1, $2)', [
      MockGlam.id,
      MockGlam.name,
    ]);
    expect(result.rowCount).toBe(1);
    const insertItems = MockMediaList.map((item) => {
      return server.pg.pool.query(
        'INSERT INTO glams_items(file_path, glam_id, name, thumbnail_url, file_url, upload_date) VALUES($1, $2, $3, $4, $5, $6)',
        [
          item.file_path,
          MockGlam.id,
          item.name,
          item.thumbnail_url,
          item.file_url,
          item.upload_date,
        ],
      );
    });
    const results = await Promise.all(insertItems);
    results.forEach((result) => expect(result.rowCount).toBe(1));
  });

  it('Should get GLAM data', async () => {
    const response = await server.inject({
      method: 'GET',
      path: `/glam/${MockGlam.id}`,
    });
    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.id).toBe(MockGlam.id);
    expect(json.name).toBe(MockGlam.name);
  });

  it('Should get GLAM items', async () => {
    const response = await server.inject({
      method: 'GET',
      path: `/glam/${MockGlam.id}/item`,
    });
    expect(response.statusCode).toBe(200);
    const { items } = response.json();
    expect(items.length).toBe(3);
    MockMediaList.forEach((mockItem) => {
      const item = items.find((i) => i.file_path === mockItem.file_path);
      expect(item).toBeDefined();
      expect(item.file_path).toEqual(mockItem.file_path);
      expect(item.glam_id).toEqual(MockGlam.id);
      expect(item.name).toEqual(mockItem.name);
      expect(item.thumbnail_url).toEqual(mockItem.thumbnail_url);
      expect(item.upload_date).toEqual(mockItem.upload_date);
    });
  });
});
