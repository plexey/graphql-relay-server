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
  author_id uuid NOT NULL,
  genre_id uuid NOT NULL,
  format book_format NOT NULL,
  publication_date date NOT NULL,
  edition serial NOT NULL,
  pages serial NOT NULL,
  language text NOT NULL,
  created_at timestamp NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors(id),
  FOREIGN KEY (genre_id) REFERENCES genres(id)
);