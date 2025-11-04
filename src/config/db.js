// src/config/db.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const required = ['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGPORT'];
for (const k of required) {
  if (!process.env[k]) {
    console.warn(`⚠️  env var ${k} is not set. Make sure .env or environment contains it.`);
  }
}

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) || 5432,
  max: process.env.PG_MAX_CLIENTS ? Number(process.env.PG_MAX_CLIENTS) : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Optional event handlers for debugging
pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
});

/**
 * query - wrapper using pool.query (prepared statements)
 * @param {string} text - SQL text with $1, $2...
 * @param {Array} params - params array
 */
async function query(text, params = []) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    // attach SQL context for easier debugging
    const e = new Error(`DB query error: ${err.message}`);
    e.original = err;
    e.sql = text;
    e.params = params;
    throw e;
  }
}

/**
 * getClient - get a pooled client for transactions
 * Remember to client.release() after using it
 */
async function getClient() {
  const client = await pool.connect();
  return client;
}

async function closePool() {
  try {
    await pool.end();
  } catch (err) {
    console.error('Error closing pool', err);
  }
}

if (process.env.NODE_ENV !== 'test') {
  process.on('SIGINT', async () => {
    console.log('SIGINT received. Closing db pool...');
    await closePool();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing db pool...');
    await closePool();
    process.exit(0);
  });
}

export default pool;
export { query, getClient, closePool };
