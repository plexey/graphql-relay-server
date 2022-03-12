import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const SECRET = "kXp2s5v8y/B?E(H+MbQeThVmYq3t6w9z";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const base64URLEncode = (str: string) => {
  // create a buffer
  const buff = Buffer.from(str, "utf-8");

  // encode buffer as Base64
  const base64 = buff.toString("base64url");

  return base64;
};

const base64URLDecode = (base64URLstring: string) => {
  const buff = Buffer.from(base64URLstring, "base64");
  const str = buff.toString("utf-8");
  return str;
};

export const generateJWT = (email: string): string => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Date.now();

  const payload = {
    iss: "booky", // issuer
    iat: now, // issued at
    exp: now + HOUR * 6, // expiry
    context: {
      user: {
        email,
      },
    },
  };

  const encodedHeader = base64URLEncode(JSON.stringify(header));
  const encodedPayload = base64URLEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(encodedHeader + "." + encodedPayload)
    .digest("base64url");

  const result = encodedHeader + "." + encodedPayload + "." + signature;

  return result;
};

export const verifyJWT = (jwt: string) => {
  if (typeof jwt !== "string") {
    return false;
  }

  const [header, payload, signature] = jwt.split(".");

  if (!header || !payload || !signature) {
    return false;
  }

  const decodedPayload = base64URLDecode(payload);
  const parsedPayload = JSON.parse(decodedPayload);

  // check if correct issuer
  if (parsedPayload.iss !== "booky") {
    return false;
  }

  // check if token is expired
  if (parsedPayload.exp <= Date.now()) {
    return false;
  }

  const comparisonSignature = crypto
    .createHmac("sha256", SECRET)
    .update(header + "." + payload)
    .digest("base64url");

  const comparisonJWT = header + "." + payload + "." + comparisonSignature;

  if (comparisonJWT === jwt) {
    return true;
  }
};

const extractJWT = (req: Request): string => {
  const authHeader = req.headers?.authorization;
  const authCookie = req.cookies?.Authorization;
  const jwt = authHeader ? authHeader.split(" ")[1] : authCookie;
  return jwt;
};

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwt = extractJWT(req);
  const verified = verifyJWT(jwt);

  if (!verified) {
    return res.sendStatus(403);
  }

  next();
};
