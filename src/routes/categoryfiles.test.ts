import { FastifyInstance } from 'fastify';
import { createServer } from '../index';
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

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
    const mockResponse = `{"batchcomplete":"","continue":{"cmcontinue":"file|21435745422e4a5047|4615116","continue":"-||"},"query":{"categorymembers":[{"pageid":76845837,"ns":6,"title":"File:! Keep Clear (28157633618).jpg"},{"pageid":87142704,"ns":6,"title":"File:! Smolensk Epitaph in Jasna G\u00f3ra Lech Kaczynski Maria Kaczynska.jpg"},{"pageid":82968674,"ns":6,"title":"File:! Zmar\u0142 prof. Jan Szyszko, by\u0142y minister \u015brodowiska i wieloletni pose\u0142.jpg"},{"pageid":29515863,"ns":6,"title":"File:!!! new moon !!!.jpg"},{"pageid":68745510,"ns":6,"title":"File:!!!, SXSW 2012 (8679404086).jpg"},{"pageid":68745507,"ns":6,"title":"File:!!!, SXSW 2013 (8678294943).jpg"},{"pageid":68745503,"ns":6,"title":"File:!!!, SXSW 2013 (8678302775).jpg"},{"pageid":68745506,"ns":6,"title":"File:!!!, SXSW 2013 (8679416512).jpg"},{"pageid":75091362,"ns":6,"title":"File:!7th century silver cufflinks (FindID 849966).jpg"},{"pageid":44087175,"ns":6,"title":"File:!? \u3073\u3063\u304f\u308a\u7bb1 (6202724549).jpg"}]}}`;

    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));
    const response = await server.inject({
      method: 'GET',
      path: `/categoryfiles?category=${mockCategory}`,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(mockResponse);
  });
});
