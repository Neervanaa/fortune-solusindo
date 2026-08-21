import pg from 'pg';

const { Pool } = pg;

let pool;

export function db() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      max: 5,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 10000,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

/**
 * Convert MySQL-style '?' placeholders to PostgreSQL '$1, $2, ...' style.
 * Ignores '?' inside string literals to avoid false replacements.
 */
function convertPlaceholders(sql) {
  let idx = 0;
  return sql.replace(/\?/g, () => `$${++idx}`);
}

/** Run a SELECT that returns many rows. */
export async function rows(sql, params = []) {
  const result = await db().query(convertPlaceholders(sql), params);
  return result.rows;
}

/** Run a SELECT that returns a single row (or null). */
export async function row(sql, params = []) {
  const all = await rows(sql, params);
  return all[0] ?? null;
}

/**
 * Run an INSERT/UPDATE/DELETE.
 * Returns { insertId, affectedRows } for compatibility with mysql2 usage.
 * IMPORTANT: For INSERT queries that need insertId, add "RETURNING id" to your SQL.
 */
export async function run(sql, params = []) {
  const result = await db().query(convertPlaceholders(sql), params);
  const insertedRow = result.rows?.[0];
  return {
    insertId: insertedRow?.id ?? null,
    affectedRows: result.rowCount ?? 0,
  };
}
