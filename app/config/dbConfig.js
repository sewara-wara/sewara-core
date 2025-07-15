const env = require('./env.js');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: env.host,
  port: env.port,
  user: env.username,
  password: env.password,
  database: env.database,
  ssl: {
    ca: env.caCert
  }
});

module.exports = pool;