export default {
  isDevEnv: process.env.NODE_ENV === 'production',
  isTestEnv: process.env.NODE_ENV === 'test',
  isProdEnv: process.env.NODE_ENV === 'development',
};
