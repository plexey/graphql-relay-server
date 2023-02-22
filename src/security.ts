import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { decrypt, encrypt, generateInitializationVector } from "./cryptography";
import { selectUser } from "./sql/select";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

type JTWPayload = {
  iss: "athenaeum"; // issuer
  iat: number; // issued at
  exp: number; // expiry
  // hst: string; // hostname
  // ura: string; // User agent
  // ipa: string; // IP Address
  context: {
    user: {
      email: string;
    };
  };
};

const base64URLEncode = (str: string) => {
  // create a buffer
  const buff = Buffer.from(str, "utf-8");

  // encode buffer as Base64
  const base64 = buff.toString("base64url");

  return base64;
};

const encryptJWTPayload = (payload: JTWPayload) => {
  if (!process.env.CIPHER_KEY) {
    throw new Error("Missing required env variable");
  }

  const iv = generateInitializationVector();
  const textToEncrypt = JSON.stringify(payload);

  return encrypt(process.env.CIPHER_KEY, iv, textToEncrypt);
};

const decodeJWTPayload = (payload: string) => {
  if (!process.env.CIPHER_KEY) {
    throw new Error("Missing required env variable");
  }

  const { encryptedData, iv } = JSON.parse(payload);

  const decryptedPayload = decrypt(process.env.CIPHER_KEY, iv, encryptedData);

  return JSON.parse(decryptedPayload);
};

export const generateJWT = (email: string): string => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Date.now();

  const payload: JTWPayload = {
    iss: "athenaeum", // issuer
    iat: now, // issued at
    exp: now + HOUR * 6, // expiry
    context: {
      user: {
        email,
      },
    },
  };

  const encodedHeader = base64URLEncode(JSON.stringify(header));

  const encodedPayload = base64URLEncode(
    JSON.stringify(encryptJWTPayload(payload))
  );

  const { HMAC_SECRET_KEY } = process.env;

  if (!HMAC_SECRET_KEY) {
    throw new Error("Missing required environment variable 'HMAC_SECRET_KEY'");
  }

  const signature = crypto
    .createHmac("sha256", HMAC_SECRET_KEY)
    .update(encodedHeader + "." + encodedPayload)
    .digest("base64url");

  const result = encodedHeader + "." + encodedPayload + "." + signature;

  return result;
};

export const verifyJWT = async (jwt: string) => {
  if (typeof jwt !== "string") {
    return {
      verified: false,
    };
  }

  const [header, payload, signature] = jwt.split(".");

  if (!header || !payload || !signature) {
    return {
      verified: false,
    };
  }

  const { HMAC_SECRET_KEY } = process.env;
  if (!HMAC_SECRET_KEY) {
    throw new Error("Missing required environment variable 'HMAC_SECRET_KEY'");
  }

  const comparisonSignature = crypto
    .createHmac("sha256", HMAC_SECRET_KEY)
    .update(header + "." + payload)
    .digest("base64url");

  const comparisonJWT = header + "." + payload + "." + comparisonSignature;
  if (comparisonJWT !== jwt) {
    return {
      verified: false,
    };
  }

  const parsedPayload = decodeJWTPayload(payload);

  // check if correct issuer
  if (parsedPayload.iss !== "athenaeum") {
    return {
      verified: false,
    };
  }

  // check if token is expired
  if (parsedPayload.exp <= Date.now()) {
    return {
      verified: false,
    };
  }

  // check if payload contains user email
  const providedEmail = parsedPayload?.context?.user?.email;
  if (!providedEmail) {
    return {
      verified: false,
    };
  }

  // check if provided email corresponds to existing user
  const matchingUser = await selectUser(providedEmail);
  if (!matchingUser) {
    return {
      verified: false,
    };
  }

  return {
    verified: true,
    payload: parsedPayload as JTWPayload,
  };
};

const extractJWTFromRequest = (req: Request): string => {
  const authHeader = req.headers?.authorization;
  const authCookie = req.cookies?.Authorization;
  const jwt = authHeader ? authHeader.split(" ")[1] : authCookie;
  return jwt;
};

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwt = extractJWTFromRequest(req);
  const verificationResponse = await verifyJWT(jwt);

  const { verified } = verificationResponse;
  if (verified === false) {
    return res.sendStatus(403);
  }

  // Store user email extracted from JWT
  // in res.locals for future use down the chain
  const { payload } = verificationResponse;

  if (!payload) {
    return res.sendStatus(403);
  }

  res.locals.user_email = payload.context.user.email;

  next();
};

export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

export const getHashedPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};
