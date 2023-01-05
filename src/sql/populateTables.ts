require("dotenv").config();

import chalk from "chalk";

import {
  generateAuthors,
  generateBooks,
  generateGenres,
  generateBookAuthors,
  generateBookGenres,
  generateUsers,
} from "../mock/dbData";

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
  
  // generate mock data
  console.log(chalk.white("\n> generate table data...\n"));
  const users = generateUsers(100);
  const genres = generateGenres();
  const authors = generateAuthors(100);
  const books = generateBooks(400);
  const bookAuthors = generateBookAuthors(books, authors);
  const bookGenres = generateBookGenres(books, genres);

  // insert mock data into DB
  console.log(chalk.white("\n> insert table data...\n"));
  await insertGenres(genres);
  await insertAuthors(authors);
  await insertBooks(books);
  await insertUsers(users);
  await insertBookAuthors(bookAuthors);
  await insertBookGenres(bookGenres);
};

run().finally(() => {
  console.log(chalk.green("\n> DONE ") + "✅");
  // process.exit(0);
});
