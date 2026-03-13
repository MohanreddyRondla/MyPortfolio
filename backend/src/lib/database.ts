import { Pool } from 'pg';
import { env, isDatabaseConfigured } from './env.js';
import type { StoredMessage } from '../types/message.js';

let pool: Pool | null = null;

export function getPool() {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: env.databaseUrl.includes('localhost') || env.databaseUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false },
    });
  }

  return pool;
}

export async function initializeDatabase() {
  if (!isDatabaseConfigured()) {
    return false;
  }

  const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        email VARCHAR(160) NOT NULL,
        subject VARCHAR(120) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    return true;
  } finally {
    client.release();
  }
}

export async function insertMessage(message: StoredMessage) {
  const client = await getPool().connect();
  try {
    await client.query(
      `INSERT INTO contact_messages (id, name, email, subject, message, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [message.id, message.name, message.email, message.subject, message.message, message.createdAt],
    );
  } finally {
    client.release();
  }
}

export async function getMessages(): Promise<StoredMessage[]> {
  const client = await getPool().connect();
  try {
    const result = await client.query(`
      SELECT id, name, email, subject, message, created_at
      FROM contact_messages
      ORDER BY created_at DESC
    `);

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      createdAt: new Date(row.created_at).toISOString(),
    }));
  } finally {
    client.release();
  }
}
