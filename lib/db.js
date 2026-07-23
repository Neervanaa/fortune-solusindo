import mysql from 'mysql2/promise';

let pool;

export function db() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 5,
      idleTimeout: 60000,
      queueLimit: 0,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    });
  }
  return pool;
}

/** Run a SELECT that returns many rows. */
export async function rows(sql, params = []) {
  const [result] = await db().query(sql, params);
  return result;
}

/** Run a SELECT that returns a single row (or null). */
export async function row(sql, params = []) {
  const all = await rows(sql, params);
  return all[0] ?? null;
}

/** Run an INSERT/UPDATE/DELETE. Returns the mysql2 result (has insertId, affectedRows). */
export async function run(sql, params = []) {
  const [result] = await db().query(sql, params);
  return result;
}
