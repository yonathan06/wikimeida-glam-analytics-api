import { FastifyInstance } from 'fastify';
import { createServer } from '../../../../../index';
import { MockMediaList, MockGlam } from '../../../../../test/__mock__/entities';

describe('DELETE /glam/:glamId/item/:filePath', () => {
  let server: FastifyInstance;
  const mockGlam = new MockGlam();
  const mockItem = MockMediaList[0];
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.pg.pool.query('DELETE FROM glams_items WHERE glam_id = $1', [mockGlam.id]);
    await server.pg.pool.query(`DELETE FROM glams WHERE id = $1`, [mockGlam.id]);
    await server.close();
  });

  it('Should create new GLAM with one item', async () => {
    const result = await server.pg.pool.query('INSERT INTO glams(id, name) VALUES($1, $2)', [
      mockGlam.id,
      mockGlam.name,
    ]);
    expect(result.rowCount).toBe(1);
    const itemResult = await server.pg.pool.query(
      'INSERT INTO glams_items(file_path, glam_id, title, thumbnail_url, page_url, upload_date) VALUES($1, $2, $3, $4, $5, $6)',
      [
        mockItem.file_path,
        mockGlam.id,
        mockItem.title,
        mockItem.thumbnail_url,
        mockItem.page_url,
        mockItem.upload_date,
      ],
    );
    expect(itemResult.rowCount).toBe(1);
  });

  it('Should delete GLAM item', async () => {
    const token = await server.signToken({ glam_id: mockGlam.id, username: 'admin' });
    const queryString = `SELECT * FROM glams_items WHERE glam_id=$1 AND file_path=$2`;
    const itemResult = await server.pg.pool.query(queryString, [mockGlam.id, mockItem.file_path]);
    expect(itemResult.rowCount).toBe(1);
    const response = await server.inject({
      method: 'DELETE',
      path: `/glam/${mockGlam.id}/item/${encodeURIComponent(mockItem.file_path)}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(response.statusCode).toBe(200);
    const emptyResult = await server.pg.pool.query(queryString, [mockGlam.id, mockItem.file_path]);
    expect(emptyResult.rowCount).toBe(0);
  });
});
