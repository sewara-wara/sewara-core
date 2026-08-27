// All values come from environment variables — never hardcode secrets here
const env = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  caCert: process.env.DB_CA_CERT ? process.env.DB_CA_CERT.replace(/\\n/g, '\n') : undefined
};

module.exports = env;