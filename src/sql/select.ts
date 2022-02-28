import { pool } from "../pool";

export const selectBooks = async () => {
  const res = await pool.query("select * from books");
  return res.rows;
};

export const selectBooksPlusMetaData = async () => {
  const res = await pool.query(`
  select
    books.id,
    books.title,
    books.format,
    books.publication_date,
    books.edition,
    books.edition,
    books.pages,
    books.language,
    books.author_id,
    authors.first_name,
    authors.last_name,
    books.genre_id,
    genres.type,
    genres.category
  from
    books
    inner join genres on books.genre_id = genres.id
    inner join authors on books.author_id = authors.id
`);
  return res.rows;
};

export const selectBookPlusMetaData = async (book_id: string) => {
  const res = await pool.query(`
  select
    books.id,
    books.title,
    books.format,
    books.publication_date,
    books.edition,
    books.edition,
    books.pages,
    books.language,
    books.author_id,
    authors.first_name,
    authors.last_name,
    books.genre_id,
    genres.type,
    genres.category
  from
    books
    inner join genres on books.genre_id = genres.id
    inner join authors on books.author_id = authors.id
  where books.id=$1
`, [book_id]);
  return res.rows[0];
};

export const selectBooksByAuthor = async (author_id: string) => {
  const res = await pool.query(
    "select * from books where author_id = $1 order by publication_date",
    [author_id]
  );
  return res.rows;
};

export const selectBooksByGenre = async (genre_id: string) => {
  const res = await pool.query(
    "select * from books where genre_id = $1 order by title asc",
    [genre_id]
  );

  return res.rows;
};

export const selectAuthors = async () => {
  const res = await pool.query("select * from authors");
  return res.rows;
};

export const selectGenres = async () => {
  const res = await pool.query("select * from genres");
  return res.rows;
};

export const selectResource = async (
  tableName: "books" | "authors" | "genres",
  rowId: string
) => {
  const res = await pool.query(`select * from ${tableName} where id=$1`, [
    rowId
  ])
  console.log(res)
  return res.rows[0]
};
