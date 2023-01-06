import { v4 as uuidv4 } from "uuid";

import { Genre } from "../types";
import { now } from "./utils";

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

export const generateGenres = (): Genre[] => {
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
