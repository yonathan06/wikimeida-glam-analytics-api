import path from 'path';
import Postgrator from 'postgrator';

export function getPostgratorInstance(): Postgrator {
  return new Postgrator({
    migrationDirectory: path.join(__dirname, '../../migrations'),
    driver: 'pg',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
    schemaTable: 'migrations',
    currentSchema: 'public',
  });
}

// export async function migrateSchema() {
//   try {
//     const postgrator = getPostgratorInstance();
//     const result = await postgrator.migrate();

//     if (result.length === 0) {
//       console.log('No migrations run for schema "public". Already at the latest one.');
//     }

//     console.log('Migration done');
//     process.exit(0);
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// }
