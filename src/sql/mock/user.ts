import faker from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

import { User } from "../types";
import { now } from "./utils";

import { generateSalt, getHashedPassword } from "../../security";

const generateUser = (): User => {
  const first_name = faker.name.firstName();
  const last_name = faker.name.lastName();

  const password = faker.random.alphaNumeric(50);
  const salt = generateSalt();
  const hashedPassword = getHashedPassword(password, salt);

  const email = faker.internet.email(
    first_name,
    last_name,
    `${faker.animal.type()}.com`
  );

  return {
    id: uuidv4(),
    first_name,
    last_name,
    email,
    password_hash: hashedPassword,
    password_salt: salt,
    created_at: now,
  };
};

const createTestUser = (): User => {
  const password = "thevengabusiscoming!";
  const salt = generateSalt();
  const hashedPassword = getHashedPassword(password, salt);

  return {
    id: uuidv4(),
    first_name: "User",
    last_name: "Zero",
    email: "user0@athenaeum.net",
    password_hash: hashedPassword,
    password_salt: salt,
    created_at: now,
  };
};

export const generateUsers = (count: number): User[] => {
  const users = [];

  let i = 0;
  while (i < count) {
    users.push(generateUser());
    i++;
  }

  return [createTestUser(), ...users];
};
