// Usage: node scripts/seed.mjs <new-password>
// Prints a SQL statement you can run against your database to set/reset
// the admin password (bcrypt hash, compatible with PHP's password_hash()).
import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/seed.mjs <new-password>');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log('\nRun this SQL against your database:\n');
console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';\n`);
console.log('(If the users table is empty, use an INSERT instead:)');
console.log(`INSERT INTO users (username, password) VALUES ('admin', '${hash}');\n`);
