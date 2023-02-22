import crypto from "crypto";

export const generateKey = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateInitializationVector = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

export const encrypt = (
  key: string,
  iv: string,
  text: string
): {
  iv: string;
  encryptedData: string;
} => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Returning iv and the encrypted data
  return {
    iv,
    encryptedData: encrypted.toString("hex"),
  };
};

export const decrypt = (key: string, iv: string, encryptedData: string) => {
  console.log({ encryptedData, key, iv });
  let encryptedText = Buffer.from(encryptedData, "hex");

  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encryptedText);

  const final = decipher.final();

  decrypted = Buffer.concat([decrypted, final]);

  return decrypted.toString();
};
