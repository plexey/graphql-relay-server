import { v4 as uuidv4 } from "uuid";

import { now, randArrayIndex, randValueInRange } from "./utils";
import { Author, Book, BookAuthor } from "../types";

const generateBookAuthor = (
  bookId: string,
  authorId: string,
  order: number
): BookAuthor => {
  return {
    id: uuidv4(),
    book_id: bookId,
    author_id: authorId,
    created_at: now,
    order: order,
  };
};

export const generateBookAuthors = (books: Book[], authors: Author[]) => {
  const bookAuthors: BookAuthor[] = [];

  books.forEach((book) => {
    const hasMultipleAuthors = Math.random() < 0.1;

    if (!hasMultipleAuthors) {
      const bookAuthor = generateBookAuthor(
        book.id,
        authors[randArrayIndex(authors)].id,
        1
      );

      bookAuthors.push(bookAuthor);
      return;
    }

    const authorCount = randValueInRange(2, 4);

    let i = 0;

    while (i < authorCount) {
      const bookAuthor = generateBookAuthor(
        book.id,
        authors[randArrayIndex(authors)].id,
        i + 1
      );

      bookAuthors.push(bookAuthor);
      i++;
    }
  });

  return bookAuthors;
};
