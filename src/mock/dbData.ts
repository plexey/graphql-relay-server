import faker from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import {
  Author,
  Book,
  BookAuthor,
  BookFormat,
  BookGenre,
  Genre,
  User,
} from "../sql/types";
import { getHashedPassword } from "../utils";

const now = Math.round(Date.now() / 1000);

const { adjective, adverb, noun, verb, preposition } = faker.word;

const customWord = (words: string[]) => {
  return words[Math.floor(Math.random() * words.length)];
};

// const t1 = () => [adjective(), noun()];
// const t2 = () => [adjective(), adjective(), noun()];
// const t3 = () => [adverb(), verb()];
// const t4 = () => [verb(), adjective(), noun()];
// const t5 = () => [preposition(), adjective(), noun()];
// const t6 = () => [preposition(), noun()];
const t7 = () => [
  customWord(["the", "a", "an", "his", "her", "our", "this", "that"]), // prepositions
  noun(),
  customWord([
    "in",
    "of",
    "inside",
    "around",
    "above",
    "below",
    "within",
    "without",
    "outside",
  ]), // prepositions
  noun(),
];
const t8 = () => [
  customWord(["the", "a", "an", "his", "her", "our", "this", "that", "their", "my"]), // prepositions
  adjective(),
  noun(),
];
const t9 = () => [
  // customWord(["the", "a", "an", "his", "her", "our", "this", "that"]), // prepositions
  verb(),
  adverb()
];

const titleVariants = [t7, t8, t9];

const generateBookTitle = (): string => {
  const variant = faker.random.arrayElement(titleVariants);
  const wordArray = variant();
  const title = wordArray.join(" ");
  return title[0].toUpperCase() + title.slice(1);
};

const fictionCategories = [
  "classic",
  "children's",
  "coming of age",
  "folklore",
  "epic",
  "parable",
  "legend",
  "fairy tale",
  "conspiracy",
  "romance",
  "espionage",
  "comedy",
  "parody",
  "satire",
  "western",
  "science fiction",
  "fantasy",
  "horror",
];

const nonFictionCategories = [
  "historical",
  "philosophical",
  "religious",
  "legal",
  "financial",
  "political",
  "financial",
  "psychology",
];

const randomLanguage = () =>
  faker.random.arrayElement([
    "english",
    "french",
    "italian",
    "spanish",
    "german",
    "swedish",
    "japanese",
  ]);
const randomPublicationDate = () =>
  faker.date.between("1700-01-01", "2022-01-01");

const bookFormat = (): BookFormat =>
  faker.random.arrayElement(["paper-back", "hard-cover"]);

const randomBookEdition = () =>
  faker.random.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const randArrayIndex = (array: any[]) =>
  Math.floor(Math.random() * array.length);

const generateAuthor = (): Author => {
  return {
    id: uuidv4(),
    first_name: faker.name.findName(),
    last_name: faker.name.lastName(),
    created_at: now,
  };
};

const generateAuthors = (count: number): Author[] => {
  let i = 0;
  const authors = [];
  while (i < count) {
    authors.push(generateAuthor());
    i++;
  }
  return authors;
};

export const authors = generateAuthors(100);

const generateGenres = (): Genre[] => {
  const fictionGenres: Genre[] = fictionCategories.map((category) => ({
    id: uuidv4(),
    category,
    type: "fiction",
    created_at: now,
  }));

  const nonFictionGenres: Genre[] = nonFictionCategories.map((category) => ({
    id: uuidv4(),
    category,
    type: "non-fiction",
    created_at: now,
  }));

  return [...fictionGenres, ...nonFictionGenres];
};

export const genres = generateGenres();

const generateBook = (): Book => {
  return {
    id: uuidv4(),
    title: generateBookTitle(),
    format: bookFormat(),
    publication_date: randomPublicationDate(),
    edition: randomBookEdition(),
    pages: faker.datatype.number({
      min: 5,
      max: 20000,
    }),
    language: randomLanguage(),
    created_at: now,
  };
};

const generateBooks = (count: number): Book[] => {
  let i = 0;
  const books = [];
  while (i < count) {
    books.push(generateBook());
    i++;
  }
  return books;
};

export const books = generateBooks(400);

const generateUser = (): User => {
  const first_name = faker.name.firstName();
  const last_name = faker.name.lastName();
  return {
    id: uuidv4(),
    first_name,
    last_name,
    email: faker.internet.email(
      first_name,
      last_name,
      `${faker.animal.type()}.com`
    ),
    password_hash: faker.random.alphaNumeric(50),
    created_at: now,
  };
};

const generateUsers = (count: number): User[] => {
  let i = 0;
  const users = [];
  while (i < count) {
    users.push(generateUser());
    i++;
  }
  return users;
};

const testUser: User = {
  id: uuidv4(),
  first_name: "User",
  last_name: "Zero",
  email: "user0@booky.net",
  password_hash: getHashedPassword("thevengabusiscoming"),
  created_at: now,
};

export const users = [testUser, ...generateUsers(100)];

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

const randValueInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateBookAuthors = () => {
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

export const bookAuthors = generateBookAuthors();

const generateBookGenre = (bookId: string, genreId: string): BookGenre => {
  return {
    id: uuidv4(),
    book_id: bookId,
    genre_id: genreId,
    created_at: now,
  };
};

const generateBookGenres = (): BookGenre[] => {
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

export const bookGenres = generateBookGenres();
