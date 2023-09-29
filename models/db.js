const { Pool } = require('pg');

// Inisialisasi pool database
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.PORT_DB
});

module.exports = pool;