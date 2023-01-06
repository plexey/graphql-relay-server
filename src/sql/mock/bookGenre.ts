import faker from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

import { Book, BookGenre, Genre } from "../types";
import { now, randArrayIndex } from "./utils";

const generateBookGenre = (bookId: string, genreId: string): BookGenre => {
  return {
    id: uuidv4(),
    book_id: bookId,
    genre_id: genreId,
    created_at: now,
  };
};

export const generateBookGenres = (
  books: Book[],
  genres: Genre[]
): BookGenre[] => {
  const bookGenres: BookGenre[] = [];

  books.forEach((book) => {
    const genresForBook = faker.datatype.number({
      min: 1,
      max: 6,
    });

    let i = 0;

    while (i < genresForBook) {
      const randomGenre = genres[randArrayIndex(genres)];
      const bookGenre = generateBookGenre(book.id, randomGenre.id);
      bookGenres.push(bookGenre);
      i++;
    }

    return bookGenres;
  });

  return bookGenres;
};
