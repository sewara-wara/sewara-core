# Sewara Core

REST API for Sewara, built with Node.js + Express + MySQL, deployed as a Netlify Function.

## Requirements

- Node.js 24.x
- MySQL (with SSL CA certificate)
- Netlify CLI (installed as a dev dependency)

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
```

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development` / `production` (stack traces are hidden in production) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `DB_CA_CERT` | CA certificate, with literal `\n` for newlines |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `MAIL_USER`, `MAIL_PASS` | Gmail account + App Password for sending OTP emails |

On Netlify, set the same variables under **Site configuration → Environment variables**.

## Running

```bash
npm run serve   # local: netlify functions:serve
npm run build   # deploy to production
```

All routes are served under `/.netlify/functions/api`.

## Structure

```
functions/api.js     # Express app + serverless handler
app/routers/         # Route definitions
app/controllers/     # Request handlers
app/middlewares/     # Auth (JWT via x-access-token), rate limiting, error handling
app/helpers/         # Shared helpers
app/config/          # DB, env, JWT, and status code config
```
