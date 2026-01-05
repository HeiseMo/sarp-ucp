import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load env vars if not already loaded (Vercel loads them automatically, but good for local dev)
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const rawDatabaseUrl = process.env.DATABASE_URL;
const databaseUrl = (() => {
  try {
    const url = new URL(rawDatabaseUrl);
    // mysql2 does not understand this option; handle TLS via the `ssl` option below.
    url.searchParams.delete('ssl-mode');
    return url.toString();
  } catch {
    // If DATABASE_URL isn't a valid URL, fall back to the raw value.
    return rawDatabaseUrl;
  }
})();

// Create a global pool to be used across serverless function invocations
// This prevents opening too many connections
const pool = mysql.createPool({
  uri: databaseUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // Aiven often requires this or a specific CA. 'false' is easier for quick start but less secure.
    // If strict security is needed, we'd need the CA cert.
  }
});

export default pool;
