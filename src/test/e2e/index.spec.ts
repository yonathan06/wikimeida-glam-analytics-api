import { FastifyInstance } from 'fastify';
import { createServer } from '../../index';
import { MockMediaList, MockGlam } from '../__mock__/entities';
describe('New GLAM basic flow', () => {
  let server: FastifyInstance;
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
        'INSERT INTO glams_items(file_path, glam_id, name, thumbnail_url, upload_date) VALUES($1, $2, $3, $4, $5)',
        [item.filePath, MockGlam.id, item.name, item.thumbnailURL, item.uploadDate],
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
});
