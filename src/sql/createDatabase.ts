import { pool } from "../pool";
import { insertAuthors, insertBooks, insertGenres } from "./insert";
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
  await createTables();
  await insertGenres();
  await insertAuthors();
  await insertBooks();
};

run().finally(() => {
  console.log("script finished");
  // process.exit(0);
});
