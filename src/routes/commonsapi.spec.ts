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
    const mockFileName = 'P.%20Fannius%20Synistor%20anagoria%20links.JPG';
    const mockResponse = `<?xml version="1.0" encoding="UTF-8"?><response version="0.92"><file><name>P. Fannius Synistor anagoria links.JPG</name><title>File:P._Fannius_Synistor_anagoria_links.JPG</title><urls><file>https://upload.wikimedia.org/wikipedia/commons/f/f6/P._Fannius_Synistor_anagoria_links.JPG</file><description>http://commons.wikimedia.org/wiki/File:P._Fannius_Synistor_anagoria_links.JPG</description><thumbnail>https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/P._Fannius_Synistor_anagoria_links.JPG/150px-P._Fannius_Synistor_anagoria_links.JPG</thumbnail></urls><size>6016149</size><width>2712</width><height>2670</height><uploader>Anagoria</uploader><upload_date>2011-04-27T20:41:40Z</upload_date><sha1>96096f6ff0b46ed9819d7f69f5039cd1240c7065</sha1><date>50-40 B.C.</date><author>&lt;div class="fn value"&gt;
    &lt;span lang="en"&gt;Unknown author&lt;/span&gt;&lt;/div&gt;</author><source>&lt;a href="http://commons.wikimedia.org/wiki/User:Anagoria" title="User:Anagoria"&gt;anagoria&lt;/a&gt;</source><permission></permission></file><description><language code="default"></language></description><categories><category>Ancient Roman frescos from Boscoreale in the Metropolitan Museum of Art</category><category>Artworks without Wikidata item</category><category>Author died more than 100 years ago public domain images</category><category>Files by User:anagoria</category><category>Template Unknown (author)</category></categories><licenses><license><name>CC-PD-Mark</name></license></licenses></response>`;

    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));
    const response = await server.inject({
      method: 'GET',
      path: `/commonsapi?fileName=${mockFileName}`,
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/xml');
    expect(response.body).toBe(mockResponse);
  });
});
