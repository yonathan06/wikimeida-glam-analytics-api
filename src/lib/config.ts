import path from 'path';

export default function loadConfig() {
  require('dotenv').config({ path: path.join(__dirname, `../../${process.env.NODE_ENV ?? 'development'}.env`) });
}
