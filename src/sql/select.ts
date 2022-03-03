import { pool } from "../pool";

const DEFAULT_PAGE_LIMIT = 100;

type Pagination = {
  order: "desc" | "asc";
  offset?: number | null;
  limit?: number | null;
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

export const selectAuthors = async ({
  order = "asc",
  offset = 0,
  limit = DEFAULT_PAGE_LIMIT,
}: Pagination) => {
  const queryText = `select * from authors order by last_name ${order} limit ${limit} offset ${offset}`;
  const res = await pool.query(queryText);
  return res.rows;
};

export const selectBooks = async ({
  order = "asc",
  offset = 0,
  limit = DEFAULT_PAGE_LIMIT,
}: Pagination) => {
  const queryText = `select * from books order by title ${order} limit ${limit} offset ${offset}`;
  const res = await pool.query(queryText);
  return res.rows;
};

export const selectGenres = async ({
  order = "asc",
  offset = 0,
  limit = DEFAULT_PAGE_LIMIT,
}: Pagination) => {
  const queryText = `select * from genres order by category ${order} limit ${limit} offset ${offset}`;
  const res = await pool.query(queryText);
  return res.rows;
};

export const selectResource = async (
  tableName: "books" | "authors" | "genres",
  rowId: string
) => {
  const res = await pool.query(`select * from ${tableName} where id=$1`, [
    rowId,
  ]);
  return res.rows[0];
};
