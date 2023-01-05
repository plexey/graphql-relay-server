export type Author = {
  id: string;
  first_name: string;
  last_name: string;
  created_at: number;
};

export type GenreType = "fiction" | "non-fiction";

export type Genre = {
  id: string;
  category: string;
  type: GenreType;
  created_at: number;
};

export type BookFormat = "paper-back" | "hard-cover";

export type Book = {
  id: string;
  title: string;
  format: BookFormat;
  publication_date: Date;
  edition: number;
  pages: number;
  language: string;
  created_at: number;
};

export type BookAuthor = {
  id: string;
  book_id: string;
  author_id: string;
  created_at: number;
  order: number;
};

export type BookGenre = {
  id: string;
  book_id: string;
  genre_id: string;
  created_at: number;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  password_salt: string;
  created_at: number;
};
