import path from 'path';

export default function loadConfig(): void {
  require('dotenv').config({
    path: path.join(__dirname, `../../${process.env.NODE_ENV ?? 'development'}.env`),
  });
}
