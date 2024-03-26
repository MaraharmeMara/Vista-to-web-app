import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const {DATABASE_URL} = process.env;
export const pool = new pg.Pool({connectionString: DATABASE_URL});

export * from './poi.js'
export * from './panorama.js'
export * from './tour.js'
