import { Pool } from "pg";

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

if (!POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DB) {
  throw new Error("Project missing required environment variables.\nMake sure an .env file exists containing required variables.");
}

export const pool = new Pool({
  port: 5432,
  host: "localhost",
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  max: 25,
  idleTimeoutMillis: 1000,
});
