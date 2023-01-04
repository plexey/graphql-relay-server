import chalk from "chalk";
import {
  authors,
  bookAuthors,
  bookGenres,
  books,
  genres,
  users,
} from "../mock/dbData";
import { pool } from "../pool";
import { User } from "./types";

export const insertGenres = async () => {
  console.log(chalk.yellow("> inserting genres"));
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const genreQueries = genres.map((item) => {
      return client.query(
        "INSERT INTO genres (id, category, type, created_at) values ($1, $2, $3, to_timestamp($4))",
        [item.id, item.category, item.type, item.created_at]
      );
    });
    await Promise.all(genreQueries);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export const insertAuthors = async () => {
  console.log(chalk.yellow("> inserting authors"));
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const genreQueries = authors.map((author) => {
      return client.query(
        "INSERT INTO authors (id, first_name, last_name, created_at) values ($1, $2, $3, to_timestamp($4))",
        [author.id, author.first_name, author.last_name, author.created_at]
      );
    });
    await Promise.all(genreQueries);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    throw e;
  } finally {
    client.release();
  }
};

export const insertBooks = async () => {
  console.log(chalk.yellow("> inserting books"));
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const genreQueries = books.map((book) => {
      return client.query(
        "INSERT INTO books (id, title, format, publication_date, edition, pages, language, created_at) values ($1, $2, $3, $4, $5, $6, $7, to_timestamp($8))",
        [
          book.id,
          book.title,
          book.format,
          book.publication_date,
          book.edition,
          book.pages,
          book.language,
          book.created_at,
        ]
      );
    });
    await Promise.all(genreQueries);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export const insertUsers = async () => {
  console.log(chalk.yellow("> inserting users"));
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const genreQueries = users.map((user) => {
      return client.query(
        "INSERT INTO users (id, first_name, last_name, email, password_hash, created_at) values ($1, $2, $3, $4, $5, to_timestamp($6))",
        [
          user.id,
          user.first_name,
          user.last_name,
          user.email,
          user.password_hash,
          user.created_at,
        ]
      );
    });
    await Promise.all(genreQueries);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    throw e;
  } finally {
    client.release();
  }
};

export const insertUser = async (user: User) => {
  const result = await pool.query(
    "INSERT INTO users (id, first_name, last_name, email, password_hash, created_at) values ($1, $2, $3, $4, $5, to_timestamp($6))",
    [
      user.id,
      user.first_name,
      user.last_name,
      user.email,
      user.password_hash,
      user.created_at,
    ]
  );
  return result;
};

export const insertBookAuthors = async () => {
  console.log(chalk.yellow("> inserting book authors"));
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const genreQueries = bookAuthors.map((bookAuthor) => {
      return client.query(
        'INSERT INTO book_authors (id, book_id, author_id, "order", created_at) values ($1, $2, $3, $4, to_timestamp($5))',
        [
          bookAuthor.id,
          bookAuthor.book_id,
          bookAuthor.author_id,
          bookAuthor.order,
          bookAuthor.created_at,
        ]
      );
    });
    await Promise.all(genreQueries);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    throw e;
  } finally {
    client.release();
  }
};

export const insertBookGenres = async () => {
  console.log(chalk.yellow("> inserting book genres"));
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const genreQueries = bookGenres.map((bookGenre) => {
      return client.query(
        "INSERT INTO book_genres (id, book_id, genre_id, created_at) values ($1, $2, $3, to_timestamp($4))",
        [
          bookGenre.id,
          bookGenre.book_id,
          bookGenre.genre_id,
          bookGenre.created_at,
        ]
      );
    });
    await Promise.all(genreQueries);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    throw e;
  } finally {
    client.release();
  }
};
