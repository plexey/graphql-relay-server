import { Response } from "express";

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,24}$/;

const NAME_REGEX = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 70;

export enum VALIDATION_ERROR {
  MISSING_REQUIRED_FIELD = "missing_required_field",
  INVALID_EMAIL = "invalid_email",
  INVALID_NAME = "invalid_name",
  INVALID_PASSWORD = "invalid_password",
  EMAIL_ALREADY_REGISTERED = "email_already_registered",
}

type RegistrationParams = {
  email?: any;
  firstName?: any;
  lastName?: any;
  password?: any;
  confirmPassword?: any;
};

type ValidationResponse = {
  error: boolean;
  error_type?: VALIDATION_ERROR;
  message?: string;
};

const validateEmail = (email: any): ValidationResponse => {
  if (email === undefined) {
    return {
      error: true,
      error_type: VALIDATION_ERROR.MISSING_REQUIRED_FIELD,
      message: "Error: Missing required field 'email'",
    };
  }

  if (typeof email !== "string" || EMAIL_REGEX.test(email) === false) {
    return {
      error: true,
      error_type: VALIDATION_ERROR.INVALID_EMAIL,
      message: "Error: Received invalid value for field 'email'",
    };
  }

  return {
    error: false,
  };
};

const validateName = (
  name: any,
  type: "firstName" | "lastName"
): ValidationResponse => {
  if (name === undefined) {
    return {
      error: true,
      error_type: VALIDATION_ERROR.MISSING_REQUIRED_FIELD,
      message: `Error: Missing required field '${type}'`,
    };
  }

  console.log({ name });

  if (
    typeof name !== "string" ||
    name.length > MAX_NAME_LENGTH ||
    name.length < MIN_NAME_LENGTH ||
    NAME_REGEX.test(name) === false
  ) {
    return {
      error: true,
      error_type: VALIDATION_ERROR.INVALID_NAME,
      message: `Error: Received invalid value for field '${type}'`,
    };
  }

  return {
    error: false,
  };
};

const validatePassword = (
  password: string,
  type: "password" | "confirmPassword"
) => {
  if (password === undefined) {
    return {
      error: true,
      error_type: VALIDATION_ERROR.MISSING_REQUIRED_FIELD,
      message: `Error: Missing required field '${type}'`,
    };
  }

  if (typeof password !== "string" || PASSWORD_REGEX.test(password) === false) {
    return {
      error: true,
      error_type: VALIDATION_ERROR.INVALID_PASSWORD,
      message: `Error: Received invalid value for field '${type}'.\nPassword must be at least 8 characters and contain at least one of the following special characters: '!@#$%^&*'`,
    };
  }

  return {
    error: false,
  };
};

export const validateRegistrationParams = (
  params: RegistrationParams,
  res: Response
): ValidationResponse => {
  const { email, firstName, lastName, password, confirmPassword } = params;

  const emailValidationResponse = validateEmail(email);
  if (emailValidationResponse.error) {
    return emailValidationResponse;
  }

  const firstNameValidationResponse = validateName(firstName, "firstName");
  if (firstNameValidationResponse.error) {
    return firstNameValidationResponse;
  }

  const lastNameValidationResponse = validateName(lastName, "lastName");
  if (lastNameValidationResponse.error) {
    return lastNameValidationResponse;
  }

  const passwordValidationResponse = validatePassword(password, "password");
  if (passwordValidationResponse?.error) {
    return passwordValidationResponse;
  }

  const confirmPasswordValidationResponse = validatePassword(
    confirmPassword,
    "confirmPassword"
  );
  if (confirmPasswordValidationResponse?.error) {
    return confirmPasswordValidationResponse;
  }

  if (password !== confirmPassword) {
    return {
      error: true,
      error_type: VALIDATION_ERROR.INVALID_PASSWORD,
      message: "Passwords do not match",
    };
  }

  return {
    error: false,
  };
};
