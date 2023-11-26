import dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;
dotenv.config();

let { PGHOST, PG_PORT, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID, PG_URI } =
  process.env;

const pool = new Pool({ connectionString: PG_URI });

export async function getPgVersion() {
  const result = await pool.query(`select version()`);
  return result.rows[0];
}
