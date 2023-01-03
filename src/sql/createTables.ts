import { pool } from "../pool";
import { readFile } from "fs/promises";

const createTables = async () => {
  try {
    const queryText = await readFile("./src/sql/init_db.sql", "utf8");
    const res = await pool.query(queryText);
    return res;
  } catch (e: any) {
    throw new Error(e);
  }
};

const run = async () => {
  console.log('==> Creating tables...')
  await createTables();
};

run().finally(() => {
  console.log("==> Done!");
  // process.exit(0);
});
