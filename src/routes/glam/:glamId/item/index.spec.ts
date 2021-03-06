import { FastifyInstance } from 'fastify';
import { createServer } from '../../../../index';
import { MockMediaList, MockGlam, MockUser } from '../../../../test/__mock__/entities';
import GlamMediaItem from '@lib/models/GlamMediaItem';

describe('GET /glam/:glamId/item', () => {
  let server: FastifyInstance;
  const mockGlam = new MockGlam();
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.pg.pool.query('DELETE FROM glams_items WHERE glam_id = $1', [mockGlam.id]);
    await server.pg.pool.query(`DELETE FROM glams WHERE id = $1`, [mockGlam.id]);
    await server.close();
  });

  it('Should create new GLAM with items', async () => {
    const result = await server.pg.pool.query('INSERT INTO glams(id, name) VALUES($1, $2)', [
      mockGlam.id,
      mockGlam.name,
    ]);
    expect(result.rowCount).toBe(1);
    const insertItems = MockMediaList.map((item) => {
      return server.pg.pool.query(
        'INSERT INTO glams_items(file_path, glam_id, title, thumbnail_url, page_url, upload_date) VALUES($1, $2, $3, $4, $5, $6)',
        [
          item.file_path,
          mockGlam.id,
          item.title,
          item.thumbnail_url,
          item.page_url,
          item.upload_date,
        ],
      );
    });
    const results = await Promise.all(insertItems);
    results.forEach((result) => expect(result.rowCount).toBe(1));
  });

  it('Should get GLAM items', async () => {
    const response = await server.inject({
      method: 'GET',
      path: `/glam/${mockGlam.id}/item`,
    });
    expect(response.statusCode).toBe(200);
    const { items } = response.json();
    expect(items.length).toBe(3);
    MockMediaList.forEach((mockItem) => {
      const item = items.find((i) => i.file_path === mockItem.file_path);
      expect(item).toBeDefined();
      expect(item.file_path).toEqual(mockItem.file_path);
      expect(item.glam_id).toEqual(mockGlam.id);
      expect(item.title).toEqual(mockItem.title);
      expect(item.page_url).toEqual(mockItem.page_url);
      expect(item.thumbnail_url).toEqual(mockItem.thumbnail_url);
      expect(item.upload_date).toEqual(mockItem.upload_date);
    });
  });
});

describe('POST /glam/:glamId/item', () => {
  let server: FastifyInstance;
  const mockGlam = new MockGlam();
  const mockUser = new MockUser();
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.pg.pool.query('DELETE FROM glams_items WHERE glam_id = $1', [mockGlam.id]);
    await server.pg.pool.query(`DELETE FROM glams WHERE id = $1`, [mockGlam.id]);
    await server.close();
  });

  it('Should create new GLAM with user', async () => {
    const result = await server.pg.pool.query('INSERT INTO glams(id, name) VALUES($1, $2)', [
      mockGlam.id,
      mockGlam.name,
    ]);
    expect(result.rowCount).toBe(1);
  });

  it('Should add new media items to GLAM', async () => {
    const token = await server.signToken({ glam_id: mockGlam.id, username: mockUser.username });
    const response = await server.inject({
      method: 'POST',
      path: `/glam/${mockGlam.id}/item`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        items: MockMediaList,
      },
    });
    expect(response.statusCode).toBe(201);
    const { items } = response.json();
    expect(items).toBeDefined();
    MockMediaList.forEach((mockItem) => {
      const item = items.find((i) => i.file_path === mockItem.file_path);
      expect(item).toBeDefined();
      expect(item.file_path).toEqual(mockItem.file_path);
      expect(item.glam_id).toEqual(mockGlam.id);
      expect(item.title).toEqual(mockItem.title);
      expect(item.thumbnail_url).toEqual(mockItem.thumbnail_url);
      expect(item.page_url).toEqual(mockItem.page_url);
      expect(item.upload_date).toEqual(mockItem.upload_date);
    });
  });

  it('Items should exist in DB', async () => {
    const results = await server.pg.pool.query<GlamMediaItem>(
      `SELECT * FROM glams_items WHERE glam_id = $1`,
      [mockGlam.id],
    );
    expect(results.rowCount).toBe(MockMediaList.length);
    const items = results.rows;
    MockMediaList.forEach((mockItem) => {
      const item = items.find((i) => i.file_path === mockItem.file_path);
      expect(item).toBeDefined();
      expect(item.file_path).toEqual(mockItem.file_path);
      expect(item.glam_id).toEqual(mockGlam.id);
      expect(item.title).toEqual(mockItem.title);
      expect(item.page_url).toEqual(mockItem.page_url);
      expect(item.thumbnail_url).toEqual(mockItem.thumbnail_url);
      expect(item.upload_date).toEqual(new Date(mockItem.upload_date));
    });
  });
});
