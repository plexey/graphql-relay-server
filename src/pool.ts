import { Pool } from "pg";

export const pool = new Pool({
  port: 5432,
  host: "localhost",
  user: "root",
  password: "mysecretpassword",
  database: "athenaeum",
  max: 25,
  idleTimeoutMillis: 1000,
});
