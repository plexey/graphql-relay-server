import { authors, books, genres } from "../mock_data";
import { pool } from "../pool";

export const insertGenres = async () => {
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
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const genreQueries = books.map((book) => {
      return client.query(
        "INSERT INTO books (id, title, author_id, genre_id, format, publication_date, edition, pages, language, created_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, to_timestamp($10))",
        [
          book.id,
          book.title,
          book.author_id,
          book.genre_id,
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
