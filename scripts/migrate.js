// Applies pending SQL migrations from /migrations in filename order.
// Applied files are recorded in the `schema_migrations` table so each runs only once.
//
//   npm run migrate            apply pending migrations
//   npm run migrate -- status  list applied / pending migrations without changing anything

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('../app/config/env.js');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function main() {
    const statusOnly = process.argv[2] === 'status';

    const conn = await mysql.createConnection({
        host: env.host,
        port: env.port,
        user: env.username,
        password: env.password,
        database: env.database,
        ssl: env.caCert ? { ca: env.caCert } : undefined,
        multipleStatements: true
    });

    try {
        await conn.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                name        VARCHAR(255) NOT NULL PRIMARY KEY,
                applied_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const [rows] = await conn.query('SELECT name FROM schema_migrations');
        const applied = new Set(rows.map((r) => r.name));
        const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
        const pending = files.filter((f) => !applied.has(f));

        if (statusOnly) {
            files.forEach((f) => console.log(`${applied.has(f) ? '[x]' : '[ ]'} ${f}`));
            return;
        }

        if (pending.length === 0) {
            console.log('Database is up to date.');
            return;
        }

        for (const file of pending) {
            const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
            console.log(`Applying ${file} ...`);
            // MySQL auto-commits DDL, so a failed file may be partially applied;
            // fix the file or the DB by hand, then re-run.
            await conn.query(sql);
            await conn.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
        }
        console.log(`Done. Applied ${pending.length} migration(s).`);
    } finally {
        await conn.end();
    }
}

main().catch((err) => {
    console.error('Migration failed:', err.message);
    process.exit(1);
});
