import { FastifyInstance } from 'fastify';
import { startServer } from '../../index';
import { Glam } from '@lib/data-layer/glams';

const MockMediaList = [
  {
    name: 'Sphinx Metropolitan.jpg',
    filePath: '/wikipedia/commons/9/96/Sphinx_Metropolitan.jpg',
    thumbnailURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sphinx_Metropolitan.jpg/150px-Sphinx_Metropolitan.jpg',
    fileURL: 'http://commons.wikimedia.org/wiki/File:Sphinx_Metropolitan.jpg',
    uploadDate: '2008-02-29T15:04:26Z',
  },
  {
    name: 'The Burghers of Calais NY.jpg',
    filePath: '/wikipedia/commons/2/21/The_Burghers_of_Calais_NY.jpg',
    thumbnailURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/The_Burghers_of_Calais_NY.jpg/112px-The_Burghers_of_Calais_NY.jpg',
    fileURL: 'http://commons.wikimedia.org/wiki/File:The_Burghers_of_Calais_NY.jpg',
    uploadDate: '2008-02-29T13:43:37Z',
  },
  {
    name: "Nicolas Poussin - L'Enlèvement des Sabines (1634-5).jpg",
    filePath: "/wikipedia/commons/a/a8/Nicolas_Poussin_-_L'Enlèvement_des_Sabines_(1634-5).jpg",
    thumbnailURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nicolas_Poussin_-_L%27Enl%C3%A8vement_des_Sabines_%281634-5%29.jpg/150px-Nicolas_Poussin_-_L%27Enl%C3%A8vement_des_Sabines_%281634-5%29.jpg',
    fileURL:
      "http://commons.wikimedia.org/wiki/File:Nicolas_Poussin_-_L'Enlèvement_des_Sabines_(1634-5).jpg",
    uploadDate: '2018-04-01T10:40:42Z',
  },
];

describe('New GLAM basic flow', () => {
  let server: FastifyInstance;
  const glam: Partial<Glam> = {
    id: 'test-glam',
    name: 'Test Glam',
  };
  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(async () => {
    await server.pg.pool.query('DELETE FROM glams_items WHERE glam_id = $1', [glam.id]);
    await server.pg.pool.query(`DELETE FROM glams WHERE id = $1`, [glam.id]);
    await server.close();
  });

  it('Should create new GLAM with items', async () => {
    const result = await server.pg.pool.query('INSERT INTO glams(id, name) VALUES($1, $2)', [
      glam.id,
      glam.name,
    ]);
    expect(result.rowCount).toBe(1);
    const insertItems = MockMediaList.map((item) => {
      return server.pg.pool.query(
        'INSERT INTO glams_items(file_path, glam_id, name, thumbnail_url, upload_date) VALUES($1, $2, $3, $4, $5)',
        [item.filePath, glam.id, item.name, item.thumbnailURL, item.uploadDate],
      );
    });
    const results = await Promise.all(insertItems);
    results.forEach((result) => expect(result.rowCount).toBe(1));
  });

  it('Should get GLAM data', async () => {
    const response = await server.inject({
      method: 'GET',
      path: `/glam/${glam.id}`,
    });
    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.id).toBe(glam.id);
    expect(json.name).toBe(glam.name);
  });
});
