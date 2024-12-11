require('dotenv').config(); // Učitavanje postavki iz .env datoteke

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

pool.on('connect', () => {
  console.log('Uspješna veza s bazom podataka!');
});

pool.on('error', (err) => {
  console.error('Greška s vezom na bazu:', err);
});

module.exports = pool;
