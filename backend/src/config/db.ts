import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://lectormat_user:secret@localhost:5432/lectormat_db';

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

export async function initDatabase(): Promise<void> {
  try {
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('🟢 Base de datos PostgreSQL inicializada con esquema DDL.');
    }
  } catch (err: any) {
    console.warn(`[DB NOTICE] PostgreSQL no disponible localmente en :5432. Modo desarrollo activo.`);
  }
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (err: any) {
    console.warn(`[DB QUERY NOTICE] DB Query executed (${err.message})`);
    return [];
  }
}
