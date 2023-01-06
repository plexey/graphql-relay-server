require('dotenv').config();

import { pool } from "./pool";
import { readFile } from "fs/promises";
import chalk from "chalk";

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
  console.log(chalk.cyan('> INITIALIZING TABLES') + " 🔨")
  await createTables();
};

run().finally(() => {
  console.log(chalk.green("> DONE ") +"✅\n");
  // process.exit(0);
});
