require('dotenv').config();

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} wajib diisi`);
  }
  return value;
};

const env = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  caCert: required('DB_CA_CERT').replace(/\\n/g, '\n')
};


module.exports = env;
