import faker from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

import { Author } from "../types";
import { now } from "./utils";

const generateAuthor = (): Author => {
  return {
    id: uuidv4(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    created_at: now,
  };
};

export const generateAuthors = (count: number): Author[] => {
  let i = 0;
  const authors = [];
  while (i < count) {
    authors.push(generateAuthor());
    i++;
  }
  return authors;
};
