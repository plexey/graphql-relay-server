import faker from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const now = Math.round(Date.now() / 1000);

const { adjective, adverb, noun, verb } = faker.word;

const t1 = () => [adjective(), noun()];
const t2 = () => [adjective(), adjective(), noun()];
const t3 = () => [adverb(), verb()];
const t4 = () => [verb(), adjective(), noun()];

const titleVariants = [t1, t2, t3, t4];

const generateBookTitle = (): string => {
  const variant = faker.random.arrayElement(titleVariants);
  const wordArray = variant();
  const title = wordArray.join(" ");
  return title;
};

const genreTypes = ["fiction", "non-fiction"];

const genreCategories = [
  "children's",
  "classic",
  "coming of age",
  "epic",
  "folklore",
  "parable",
  "legend",
  "fairy tale",
  "historical",
  "philosphical",
  "religious",
  "consipiracy",
  "legal",
  "financial",
  "political",
  "financial",
  "physcology",
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

const randomLanguage = () =>
  faker.random.arrayElement([
    "english",
    "french",
    "itialian",
    "spanish",
    "german",
    "swedish",
    "japanese",
  ]);
const randomPublicationDate = () =>
  faker.date.between("1700-01-01", "2022-01-01");

const bookFormat = () => faker.random.arrayElement(["paper-back", "hard-cover"]);

const randomBookEdition = () =>
  faker.random.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const randArrayIndex = (array: any[]) =>
  Math.floor(Math.random() * array.length);

const generateAuthor = () => {
  return {
    id: uuidv4(),
    first_name: faker.name.findName(),
    last_name: faker.name.lastName(),
    created_at: now,
  };
};

const generateAuthors = (count: number) => {
  let i = 0;
  const authors = [];
  while (i < count) {
    authors.push(generateAuthor());
    i++;
  }
  return authors;
};

export const authors = generateAuthors(100);

const generateGenres = () => {
  return genreCategories.map((category) => ({
    id: uuidv4(),
    category: category,
    type: faker.random.arrayElement(genreTypes),
    created_at: now,
  }));
};

export const genres = generateGenres();

const generateBook = () => {
  return {
    id: uuidv4(),
    title: generateBookTitle(),
    author_id: authors[randArrayIndex(authors)].id,
    genre_id: genres[randArrayIndex(genres)].id,
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

const generateBooks = (count: number) => {
  let i = 0;
  const books = [];
  while (i < count) {
    books.push(generateBook());
    i++;
  }
  return books;
};

export const books = generateBooks(400);
