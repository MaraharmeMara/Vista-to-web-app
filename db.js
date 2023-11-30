import dotenv from "dotenv";
dotenv.config();
const { DATABASE_URL } = process.env;
import pg from "pg";
const { Pool } = pg;

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

export async function getTour(id) {
  const result = await pool.query(`select * from tour where tour.id = $1`, [
    id,
  ]);
  return result.rows[0];
}

export async function listTour() {
  const result = await pool.query(`select * from tour`);
  return result.rows;
}

export async function createHotSpot(tourID, name, pitch, yaw, type, siteLink) {
  const result = await pool.query(
    `insert into hotspot(parent_id,name,pitch,yaw,hotspot_type,site_link) values ($1,$2,$3,$4,$5,$6) returning *`,
    [tourID, name, pitch, yaw, type, siteLink]
  );

  return result.rows[0];
}

export async function getFirstTour() {
  const result = await pool.query(`select panorama_file from tour`);
  return result.rows[0];
}

export async function getTourHotspots(tourID) {
  console.log(tourID);
  const result = await pool.query(
    `select * from hotspot where parent_id = $1`,
    [tourID]
  );
  return result.rows;
}
