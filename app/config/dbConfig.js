const env = require('./env.js');
const mySql = require('mysql2');

const pool = mySql.createConnection({
  host: env.host,
  user: env.username,
  password: env.password,
  database: env.database,
})

module.exports = {
  pool,
}