import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { generateSalt, getHashedPassword, generateJWT } from "./security";
import { validateRegistrationParams, VALIDATION_ERROR } from "./validation";
import { pool } from "./sql/pool";

import { insertUser } from "./sql/insert";

export const register = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password, confirmPassword } = req.body;

  const validationResponse = validateRegistrationParams(
    { email, firstName, lastName, password, confirmPassword },
    res
  );

  if (validationResponse?.error) {
    res.status(401).send({
      message: validationResponse.message,
      error: validationResponse.error_type,
    });
    return;
  }

  // Check if user with the same email is also registered
  const result = await pool.query("select email from users where email=$1", [
    email,
  ]);

  const duplicateUser = result.rows.find((user) => user.email === email);
  if (duplicateUser) {
    res.status(401).send({
      message: "Error: account with that email already exists",
      error: VALIDATION_ERROR.EMAIL_ALREADY_REGISTERED,
    });
    return;
  }

  const salt = generateSalt();
  const hashedPassword = getHashedPassword(password, salt);

  // Insert new user into database
  await insertUser({
    id: uuidv4(),
    first_name: firstName,
    last_name: lastName,
    email,
    password_hash: hashedPassword,
    password_salt: salt,
    created_at: Math.round(Date.now() / 1000),
  });

  res.status(201);
  res.send({
    message: "Registration complete",
  });
  return;
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === undefined || password === undefined) {
    res.status(400).send({ message: "Error: missing required arguments" });
    return;
  }

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).send({ message: "Error: received invalid arguments" });
    return;
  }

  const { rows } = await pool.query(
    "select email, password_hash, password_salt from users where email=$1",
    [email]
  );

  const row = rows[0];
  if (!row) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  const { password_hash, password_salt } = row;

  // create a new hash from the provided password using password_salt stored against user
  const hash = getHashedPassword(password, password_salt);

  // check if newly hashed password matches the password_hash stored against user
  if (hash !== password_hash) {
    res.status(401).send({ message: "Incorrect password" });
    return;
  }

  const jwt = generateJWT(email);

  res.status(200).send({
    message: "User logged in",
    jwt,
  });
};
