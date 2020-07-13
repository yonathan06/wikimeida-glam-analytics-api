import { FastifyInstance } from 'fastify';
import { createServer } from '../index';
jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

describe('GET /filedata', () => {
  let server: FastifyInstance;
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it('Receive file data', async () => {
    const mockFileName = 'File%3A!%20Keep%20Clear%20(28157633618).jpg';
    const mockResponse = {
      batchcomplete: '',
      query: {
        pages: {
          '87142704': {
            pageid: 87142704,
            ns: 6,
            title: 'File:! Smolensk Epitaph in Jasna Góra Lech Kaczynski Maria Kaczynska.jpg',
            imagerepository: 'local',
            imageinfo: [
              {
                timestamp: '2020-02-16T22:22:33Z',
                thumburl:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/%21_Smolensk_Epitaph_in_Jasna_G%C3%B3ra_Lech_Kaczynski_Maria_Kaczynska.jpg/250px-%21_Smolensk_Epitaph_in_Jasna_G%C3%B3ra_Lech_Kaczynski_Maria_Kaczynska.jpg',
                thumbwidth: 250,
                thumbheight: 374,
                url:
                  'https://upload.wikimedia.org/wikipedia/commons/b/b5/%21_Smolensk_Epitaph_in_Jasna_G%C3%B3ra_Lech_Kaczynski_Maria_Kaczynska.jpg',
                descriptionurl:
                  'https://commons.wikimedia.org/wiki/File:!_Smolensk_Epitaph_in_Jasna_G%C3%B3ra_Lech_Kaczynski_Maria_Kaczynska.jpg',
                descriptionshorturl: 'https://commons.wikimedia.org/w/index.php?curid=87142704',
                metadata: [
                  { name: 'Make', value: 'FUJIFILM' },
                  { name: 'Model', value: 'X-H1' },
                  { name: 'Orientation', value: 8 },
                  { name: 'XResolution', value: '72/1' },
                  { name: 'YResolution', value: '72/1' },
                  { name: 'ResolutionUnit', value: 2 },
                  { name: 'Software', value: 'Digital Camera X-H1 Ver2.01' },
                  { name: 'DateTime', value: '2020:02:02 08:42:43' },
                  { name: 'YCbCrPositioning', value: 2 },
                  { name: 'ExposureTime', value: '10/1250' },
                  { name: 'FNumber', value: '560/100' },
                  { name: 'ExposureProgram', value: 1 },
                  { name: 'ISOSpeedRatings', value: 2500 },
                  { name: 'ExifVersion', value: '0230' },
                  { name: 'DateTimeOriginal', value: '2020:02:02 08:42:43' },
                  { name: 'DateTimeDigitized', value: '2020:02:02 08:42:43' },
                  { name: 'ComponentsConfiguration', value: '\n#1\n#2\n#3\n#0' },
                  { name: 'CompressedBitsPerPixel', value: '32/10' },
                  { name: 'ShutterSpeedValue', value: '700/100' },
                  { name: 'ApertureValue', value: '500/100' },
                  { name: 'BrightnessValue', value: '242/100' },
                  { name: 'ExposureBiasValue', value: '0/100' },
                  { name: 'MaxApertureValue', value: '300/100' },
                  { name: 'MeteringMode', value: 3 },
                  { name: 'LightSource', value: 0 },
                  { name: 'Flash', value: 0 },
                  { name: 'FocalLength', value: '1600/100' },
                  { name: 'FlashPixVersion', value: '0100' },
                  { name: 'ColorSpace', value: 1 },
                  { name: 'FocalPlaneXResolution', value: '1812/1' },
                  { name: 'FocalPlaneYResolution', value: '1812/1' },
                  { name: 'FocalPlaneResolutionUnit', value: 3 },
                  { name: 'SensingMethod', value: 2 },
                  { name: 'FileSource', value: 3 },
                  { name: 'SceneType', value: 1 },
                  { name: 'CustomRendered', value: 0 },
                  { name: 'ExposureMode', value: 1 },
                  { name: 'WhiteBalance', value: 0 },
                  { name: 'FocalLengthIn35mmFilm', value: 24 },
                  { name: 'SceneCaptureType', value: 0 },
                  { name: 'Sharpness', value: 2 },
                  { name: 'SubjectDistanceRange', value: 0 },
                  { name: 'MEDIAWIKI_EXIF_VERSION', value: 1 },
                ],
              },
            ],
          },
        },
      },
    };
    fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockResponse))));
    const response = await server.inject({
      method: 'GET',
      path: `/filedata?fileName=${mockFileName}`,
    });
    expect(response.statusCode).toBe(200);
    const expectedResponse = {
      title: 'File:! Smolensk Epitaph in Jasna Góra Lech Kaczynski Maria Kaczynska.jpg',
      file_path:
        '/wikipedia/commons/b/b5/%21_Smolensk_Epitaph_in_Jasna_G%C3%B3ra_Lech_Kaczynski_Maria_Kaczynska.jpg',
      page_url: 'https://commons.wikimedia.org/wiki/File:! Keep Clear (28157633618).jpg',
      thumbnail_url:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/%21_Smolensk_Epitaph_in_Jasna_G%C3%B3ra_Lech_Kaczynski_Maria_Kaczynska.jpg/250px-%21_Smolensk_Epitaph_in_Jasna_G%C3%B3ra_Lech_Kaczynski_Maria_Kaczynska.jpg',
      upload_date: '2020-02-16T22:22:33.000Z',
    };
    expect(response.json()).toEqual(expectedResponse);
  });
});
