import { FastifyInstance } from 'fastify';
import { createServer } from '../index';
import { MockCategoryFilesResponse, MockFilesData } from '../test/__mock__/responses';

jest.mock('../lib/wikipediaAPI', () => {
  const { MockCategoryFilesResponse, MockFilesData } = require('../test/__mock__/responses');
  function fetchFileListByCategory() {
    return Promise.resolve(MockCategoryFilesResponse);
  }
  function fetchFilesData() {
    return Promise.resolve(MockFilesData);
  }
  return { fetchFileListByCategory, fetchFilesData };
});

describe('GET /commonsapi', () => {
  let server: FastifyInstance;
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it('Receive file data', async () => {
    const mockCategory = 'CC-BY-2.0';
    const response = await server.inject({
      method: 'GET',
      path: `/categoryfiles?category=${mockCategory}`,
    });
    expect(response.statusCode).toBe(200);
    const expectedResponse = {
      items: MockFilesData,
      next: MockCategoryFilesResponse.continue.cmcontinue,
    };
    expect(response.json()).toEqual(expectedResponse);
  });
});
