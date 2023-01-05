drop table if exists users;

drop table if exists book_genres;

drop table if exists book_authors;

drop table if exists books;

drop table if exists authors;

drop table if exists genres;

drop type if exists book_format;

drop type if exists genre_type;

create type book_format as enum('paper-back', 'hard-cover');

create type genre_type as enum('fiction', 'non-fiction');

create table authors (
  id uuid NOT NULL PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  created_at timestamp NOT NULL
);

create table genres (
  id uuid NOT NULL PRIMARY KEY,
  type genre_type NOT NULL,
  category text NOT NULL,
  created_at timestamp NOT NULL
);

create table books (
  id uuid NOT NULL PRIMARY KEY,
  title text NOT NULL,
  format book_format NOT NULL,
  publication_date date NOT NULL,
  edition serial NOT NULL,
  pages serial NOT NULL,
  language text NOT NULL,
  created_at timestamp NOT NULL
);

create table book_authors (
  id uuid NOT NULL PRIMARY KEY,
  book_id uuid NOT NULL,
  author_id uuid NOT NULL,
  "order" serial NOT NULL,
  created_at timestamp NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

create table book_genres (
  id uuid NOT NULL PRIMARY KEY,
  book_id uuid NOT NULL,
  genre_id uuid NOT NULL,
  created_at timestamp NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (genre_id) REFERENCES genres(id)
);

create table users (
  id uuid NOT NULL PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  password_salt text NOT NULL,
  created_at text NOT NULL
)