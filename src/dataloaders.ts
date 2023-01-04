import DataLoader from "dataloader";
import { pool } from "./pool";

const generateWhereInParams = (ids: string[]): string =>
  `(${ids.map((_value, index) => `$${index + 1}`).join(", ")})`;

const queryComposer = (ids: string[], table: string, column: string) => {
  return `SELECT * FROM ${table} WHERE ${column} IN (${ids
    .map((_value, index) => `$${index + 1}`)
    .join(", ")})`;
};

export const bookLoader = new DataLoader((ids) => {
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

export const authorLoader = new DataLoader((ids) => {
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

export const genreLoader = new DataLoader((genreIds) => {
  const queryText = queryComposer(genreIds as string[], "genres", "id");
  return pool
    .query(queryText, genreIds as string[])
    .then((result) =>
      genreIds.map(
        (id) =>
          result.rows.find((row) => row.id === id) ||
          new Error(`Row not found: ${id}`)
      )
    );
});

export const authorBooksLoader = new DataLoader((authorIds) => {
  const queryText = `
    select 
	    book_authors.author_id,
	    books.id as "book_id",
	    books.title,
	    books.format,
	    books.publication_date,
	    books.edition,
	    books.pages,
	    books.language,
	    books.created_at
    from book_authors 
    inner join books on book_authors.book_id=books.id
    where book_authors.author_id in (${authorIds
      .map((_value, index) => `$${index + 1}`)
      .join(", ")})
  `;

  return pool.query(queryText, authorIds as string[]).then((result) => {
    const booksForAuthor = authorIds.map((authorId) => {
      const books = result.rows
        .filter((book) => book.author_id === authorId)
        .map((book) => ({
          ...book,
          id: book.book_id,
        }));
      if (books.length === 0) {
        return new Error(`No rows found: ${authorId}`);
      }
      return books;
    });
    return booksForAuthor;
  });
});

export const bookAuthorsLoader = new DataLoader((bookIds) => {
  const queryText = `
    select 
      authors.id, 
      authors.first_name, 
      authors.last_name, 
      authors.created_at, 
      book_authors.book_id, 
      book_authors.order
    from book_authors 
    inner join authors on book_authors.author_id=authors.id
    where book_authors.book_id in (${bookIds
      .map((_value, index) => `$${index + 1}`)
      .join(", ")})
  `;

  return pool.query(queryText, bookIds as string[]).then((result) => {
    const authorsForBook = bookIds.map((bookId) => {
      const authors = result.rows.filter(
        (bookAuthor) => bookAuthor.book_id === bookId
      );
      return authors;
    });
    return authorsForBook;
  });
});

export const bookGenresLoader = new DataLoader((bookIds) => {
  const queryText = `
    select 
      book_genres.book_id,
      book_genres.genre_id,
      genres.type,
      genres.category,
      genres.created_at
    from book_genres 
    inner join genres on book_genres.genre_id=genres.id
    where book_genres.book_id in ${generateWhereInParams(bookIds as string[])}
  `;

  return pool.query(queryText, bookIds as string[]).then((result) => {
    const genresForBook = bookIds.map((bookId) => {
      const genres = result.rows
        .filter((bookGenre) => bookGenre.book_id === bookId)
        .map((bookGenre) => ({
          ...bookGenre,
          id: bookGenre.genre_id,
        }));
      return genres;
    });
    return genresForBook;
  });
});

export const genreBooksLoader = new DataLoader((genreIds) => {
  const queryText = `
    select 
	    book_genres.genre_id,
	    books.id as "book_id",
	    books.title,
	    books.format,
	    books.publication_date,
	    books.edition,
	    books.pages,
	    books.language,
	    books.created_at
    from book_genres 
    inner join books on book_genres.book_id=books.id
    where book_genres.genre_id in ${generateWhereInParams(genreIds as string[])}
  `;

  return pool.query(queryText, genreIds as string[]).then((result) => {
    const genresForBooks = genreIds.map((genreId) =>
      result.rows
        .filter((genreBook) => genreBook.genre_id === genreId)
        .map((genreBook) => ({
          ...genreBook,
          id: genreBook.book_id,
        }))
    );
    return genresForBooks;
  });
});

export const loaders = {
  book: bookLoader,
  author: authorLoader,
  genre: genreLoader,
  bookGenres: bookGenresLoader,
  bookAuthors: bookAuthorsLoader,
  authorBooks: authorBooksLoader,
  genreBooks: genreBooksLoader,
};
