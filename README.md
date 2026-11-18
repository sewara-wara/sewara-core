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
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials for listing photos |

On Netlify, set the same variables under **Site configuration → Environment variables**.

## Running

```bash
npm run serve   # local: netlify functions:serve
npm run build   # deploy to production
```

All routes are served under `/.netlify/functions/api`.

## Database migrations

The schema lives in [`migrations/`](migrations/) as numbered SQL files, applied in filename order by [`scripts/migrate.js`](scripts/migrate.js) using the DB settings from `.env`.

```bash
npm run migrate            # apply pending migrations
npm run migrate -- status  # show applied / pending migrations
```

Applied files are tracked in the `schema_migrations` table, so each file runs once.

To change the schema, add a new file with the next number (e.g. `003_add_phone_to_users.sql`). Never edit a migration that has already been applied; write a new one instead.

`CREATE TABLE IF NOT EXISTS` skips a table that already exists, even if its columns differ, so run `001` and `002` on an empty database.

## Structure

```
functions/api.js     # Express app + serverless handler
app/routers/         # Route definitions
app/controllers/     # Request handlers
app/middlewares/     # Auth (JWT via x-access-token), rate limiting, error handling
app/helpers/         # Shared helpers
app/config/          # DB, env, JWT, and status code config
migrations/          # SQL schema migrations (run with npm run migrate)
scripts/             # Maintenance scripts
```
