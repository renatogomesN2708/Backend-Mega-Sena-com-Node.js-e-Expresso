const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'megasena',
  password: 'sua_senha_aqui', // coloque sua senha do PostgreSQL
  port: 5432,
});

module.exports = pool;
