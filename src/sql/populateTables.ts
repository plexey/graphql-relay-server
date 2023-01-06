require("dotenv").config();

import chalk from "chalk";

import { generateAuthors } from "./mock/author";
import { generateBooks } from "./mock/book";
import { generateGenres } from "./mock/genre";
import { generateBookAuthors } from "./mock/bookAuthor";
import { generateBookGenres } from "./mock/bookGenre";
import { generateUsers } from "./mock/user";

import {
  insertAuthors,
  insertBookAuthors,
  insertBookGenres,
  insertBooks,
  insertGenres,
  insertUsers,
} from "./insert";

const run = async () => {
  console.log(chalk.cyan("> POPULATING TABLES") + " 📚");

  // GENERATE MOCK DATA
  console.log(chalk.white("\n> generate table data...\n"));

  console.log(chalk.blue("> generating users"));
  const users = generateUsers(100);

  console.log(chalk.blue("> generating genres"));
  const genres = generateGenres();

  console.log(chalk.blue("> generating authors"));
  const authors = generateAuthors(100);

  console.log(chalk.blue("> generating books"));
  const books = generateBooks(400);

  console.log(chalk.blue("> generating book authors"));
  const bookAuthors = generateBookAuthors(books, authors);

  console.log(chalk.blue("> generating book genres"));
  const bookGenres = generateBookGenres(books, genres);

  // INSERT MOCK DATA INTO DB
  console.log(chalk.white("\n> insert table data...\n"));

  console.log(chalk.yellow("> inserting genres"));
  await insertGenres(genres);

  console.log(chalk.yellow("> inserting authors"));
  await insertAuthors(authors);

  console.log(chalk.yellow("> inserting books"));
  await insertBooks(books);

  console.log(chalk.yellow("> inserting users"));
  await insertUsers(users);

  console.log(chalk.yellow("> inserting book authors"));
  await insertBookAuthors(bookAuthors);

  console.log(chalk.yellow("> inserting book genres"));
  await insertBookGenres(bookGenres);
};

run().finally(() => {
  console.log(chalk.green("\n> DONE ") + "✅");
  // process.exit(0);
});
