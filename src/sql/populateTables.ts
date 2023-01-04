require("dotenv").config();

import chalk from "chalk";
console.log(chalk.cyan("==> POPULATING TABLES") + " 📚");
import {
  insertAuthors,
  insertBookAuthors,
  insertBookGenres,
  insertBooks,
  insertGenres,
  insertUsers,
} from "./insert";


const run = async () => {

  await insertGenres();
  await insertAuthors();
  await insertBooks();
  await insertUsers();
  await insertBookAuthors();
  await insertBookGenres();
};

run().finally(() => {
  console.log(chalk.green("==> DONE ") + "✅");
  // process.exit(0);
});
