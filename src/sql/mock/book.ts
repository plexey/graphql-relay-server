import faker from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

import { now } from "./utils";
import { Book, BookFormat } from "../types";

const { adjective, adverb, noun, verb } = faker.word;

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
  customWord([
    "the",
    "a",
    "an",
    "his",
    "her",
    "our",
    "this",
    "that",
    "their",
    "my",
  ]), // prepositions
  adjective(),
  noun(),
];
const t9 = () => [verb(), adverb()];

const titleVariants = [t7, t8, t9];

const generateBookTitle = (): string => {
  const variant = faker.random.arrayElement(titleVariants);
  const wordArray = variant();
  const title = wordArray.join(" ");
  return title[0].toUpperCase() + title.slice(1);
};

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

export const generateBooks = (count: number): Book[] => {
  let i = 0;
  const books = [];
  while (i < count) {
    books.push(generateBook());
    i++;
  }
  return books;
};
