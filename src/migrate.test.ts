import { migrateSchema } from './migrate';
jest.mock('postgrator');

const Postgrator = require('postgrator');
describe('migrate', () => {
  it('performs migrations', async () => {
    const mockMigrate = jest.fn().mockResolvedValue([]);
    const mockExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => null) as (code?: number) => never);
    const mockLog = jest.spyOn(console, 'log').mockImplementation(() => null);
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => null);

    Postgrator.mockImplementation(() => ({ migrate: mockMigrate }));

    await migrateSchema();

    expect(mockMigrate).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockError).toHaveBeenCalledTimes(0);
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('logs and exits on error', async () => {
    const mockMigrate = jest.fn().mockImplementation(async () => {
      throw new Error();
    });

    const mockError = jest.spyOn(console, 'error').mockImplementation(() => null);

    Postgrator.mockImplementation(() => ({ migrate: mockMigrate }));

    await migrateSchema();

    expect(mockMigrate).toHaveBeenCalledTimes(1);
    expect(mockError).toHaveBeenCalledTimes(1);
  });
});
