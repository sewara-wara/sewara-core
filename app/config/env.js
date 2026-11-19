// All values come from environment variables — never hardcode secrets here

// Accepts the CA cert pasted with real newlines or literal \n, and tolerates
// surrounding quotes copied over from a .env file into the Netlify dashboard.
const parseCaCert = (value) => {
  if (!value) {
    return undefined;
  }

  const cert = value
    .trim()
    .replace(/^(["'])([\s\S]*)\1$/, '$2')
    .replace(/\\n/g, '\n')
    .trim();

  return cert || undefined;
};

const caCert = parseCaCert(process.env.DB_CA_CERT);

if (!caCert) {
  console.warn('[env] DB_CA_CERT is empty: DB connections will fail with "self-signed certificate in certificate chain".');
} else if (!caCert.startsWith('-----BEGIN CERTIFICATE-----') || !caCert.endsWith('-----END CERTIFICATE-----')) {
  console.warn('[env] DB_CA_CERT does not look like a PEM certificate (expected -----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----).');
}

const env = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  caCert
};

module.exports = env;
