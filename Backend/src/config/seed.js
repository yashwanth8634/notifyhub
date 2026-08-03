import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { pool } from './db.js';
import { BCRYPT_ROUNDS } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Starting database seed...');

    // 1. Run Schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    console.log('Executing schema...');
    await client.query(schemaSql);
    console.log('Schema created/updated.');

    // 2. Check if Super Admin exists
    const adminCheck = await client.query(`SELECT id FROM users WHERE role = 'super_admin' LIMIT 1`);
    if (adminCheck.rows.length === 0) {
      console.log('Creating initial Super Admin...');
      const defaultPassword = 'admin'; // Hardcoded for initial setup
      const hash = await bcrypt.hash(defaultPassword, BCRYPT_ROUNDS);

      await client.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
        ['Super Admin', 'admin@notifyhub.com', hash, 'super_admin']
      );
      console.log('Super Admin created (admin@notifyhub.com / admin)');
    } else {
      console.log('Super Admin already exists.');
    }

    await client.query('COMMIT');
    console.log('Seed completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
  } finally {
    client.release();
    pool.end();
  }
}

runSeed();
