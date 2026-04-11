import 'dotenv/config'; // ✅ VERY IMPORTANT
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

console.log('DB URL:', process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20, // production pool
});

export const db = drizzle(pool);
