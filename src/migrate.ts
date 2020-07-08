import loadConfig from '@lib/config';
import { getPostgratorInstance } from "@lib/migration";

loadConfig();

async function migrateSchema() {
  try {
    const postgrator = getPostgratorInstance();
    const result = await postgrator.migrate();
    
    if (result.length === 0) {
      console.log('No migrations run for schema "public". Already at the latest one.');
    }
    
    console.log('Migration done');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

migrateSchema();