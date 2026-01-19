import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'; // <--- NEW IMPORT
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment'; // <--- NEW IMPORT

// Initialize db variable (it will be undefined during build to prevent crashes)
let db: ReturnType<typeof drizzle>;

// Only connect to DB if we are NOT building the app
if (!building) {
    if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

    // Remove 'file:' prefix if it exists (better-sqlite3 doesn't like it)
    const path = env.DATABASE_URL.replace('file:', '');

    const client = new Database(path);

    db = drizzle(client, { schema });

    // Automatically run migrations on startup
    console.log('Running migrations...');
    migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations applied successfully.');
}

export { db };