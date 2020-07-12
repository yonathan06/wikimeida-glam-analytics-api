import { createServer } from './index';
describe('Server', () => {
  it('Should return server instance', async () => {
    const server = await createServer();
    expect(server).toBeDefined();
    expect(server.pg).toBeDefined();
    await server.close();
  });
});
