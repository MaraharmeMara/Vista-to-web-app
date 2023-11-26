import dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;
dotenv.config();
const { DATABASE_URL } = process.env;

const pool = new Pool({ connectionString: DATABASE_URL });

export async function getPgVersion() {
  const result = await pool.query(`select version()`);
  return result.rows[0];
}
