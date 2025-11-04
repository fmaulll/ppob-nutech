// src/server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // ensure DB connection works
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to DB on startup:', err);
    process.exit(1);
  }
}

start();
