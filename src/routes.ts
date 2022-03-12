import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { pool } from "./pool";
import { getHashedPassword } from "./utils";
import { generateJWT } from "./security";

import { insertUser } from "./sql/insert";

export const register = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.send("Registration failed, passwords do not match");
    return;
  }

  // Check if user with the same email is also registered
  const result = await pool.query(`select email from users where email=$1`, [
    email,
  ]);

  const duplicateUser = result.rows.find((user) => user.email === email);
  if (duplicateUser) {
    res.send("Registration failed, user already registered");
    return;
  }

  const hashedPassword = getHashedPassword(password);

  // Store user into the database if you are using one

  await insertUser({
    id: uuidv4(),
    first_name: firstName,
    last_name: lastName,
    email,
    password_hash: hashedPassword,
    created_at: Math.round(Date.now() / 1000),
  });

  res.send("Registration complete");
  return;
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hashedPassword = getHashedPassword(password);

  // Check if user with the same email is also registered
  const { rows } = await pool.query(
    `select email, password_hash from users where email=$1`,
    [email]
  );

  const row = rows[0];

  if (!row) {
    res.status(401).send({ message: "Invalid email"});
    return;
  }

  if (row.password_hash !== hashedPassword) {
    res.status(401).send({ message: "Invalid password"});
    return;
  }

  const jwt = generateJWT(email);

  res.send({
    jwt,
  });
};
