import DataLoader from "dataloader";
import { pool } from "./pool";

const queryComposer = (ids: string[], table: string, column: string) => {
  return `SELECT * FROM ${table} WHERE ${column} IN (${ids
    .map((_value, index) => `$${index + 1}`)
    .join(", ")})`;
};

export const booksLoader = new DataLoader((ids) => {
  const queryText = queryComposer(ids as string[], "books", "id");
  return pool
    .query(queryText, ids as string[])
    .then((result) =>
      ids.map(
        (id) =>
          result.rows.find((row) => row.id === id) ||
          new Error(`Row not found: ${id}`)
      )
    );
});

export const authorsLoader = new DataLoader((ids) => {
  const queryText = queryComposer(ids as string[], "authors", "id");
  return pool
    .query(queryText, ids as string[])
    .then((result) =>
      ids.map(
        (id) =>
          result.rows.find((row) => row.id === id) ||
          new Error(`Row not found: ${id}`)
      )
    );
});

export const genresLoader = new DataLoader((ids) => {
  const queryText = queryComposer(ids as string[], "genres", "id");
  return pool
    .query(queryText, ids as string[])
    .then((result) =>
      ids.map(
        (id) =>
          result.rows.find((row) => row.id === id) ||
          new Error(`Row not found: ${id}`)
      )
    );
});

export const booksByGenreLoader = new DataLoader((genreIds) => {
  const queryText = queryComposer(genreIds as string[], "books", "genre_id");
  return pool
    .query(queryText, genreIds as string[])
    .then((result) =>
      genreIds.map((genreId) =>
        result.rows.filter((book) => book.genre_id === genreId)
      )
    );
});

export const booksByAuthorLoader = new DataLoader((authorIds) => {
  const queryText = queryComposer(authorIds as string[], "books", "author_id");
  return pool.query(queryText, authorIds as string[]).then((result) => {
    const booksForAuthor = authorIds.map((authorId) => {
      const books = result.rows.filter((book) => book.author_id === authorId);
      return books;
    });
    return booksForAuthor;
  });
});
