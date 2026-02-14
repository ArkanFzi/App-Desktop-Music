const { Client } = require('pg');
require('dotenv').config();

const createDb = async () => {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default DB to create new one
    password: process.env.DB_PASSWORD || '12345678',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'music_app'");
    if (res.rowCount === 0) {
      console.log("Database 'music_app' does not exist. Creating...");
      await client.query('CREATE DATABASE music_app');
      console.log("Database 'music_app' created successfully.");
    } else {
      console.log("Database 'music_app' already exists.");
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
};

createDb();
