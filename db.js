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

export async function createTour(name, file) {
  const result = await pool.query(
    `insert into tour(name, panorama_file) values ($1, $2) returning *`,
    [name, file]
  );
  return result.rows[0];
}

export async function listTour() {
  const result = await pool.query(`select * from tour`);
  return result.rows;
}
