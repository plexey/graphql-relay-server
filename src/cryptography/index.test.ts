import {
  encrypt,
  decrypt,
  generateInitializationVector,
  generateKey,
} from "./index";

const KEY = "38e7341f385c050cfc4dd81609deb5299e69d1449a14c05bb9979fb209b83a7b";
const INITIALIZATION_VECTOR = "360d5f5d96c4f63a57c4a9cad1c5d743";

const SAMPLE_JS_OBJECT = {
  alive: true,
  first_name: "john",
  last_name: "smith",
  age: 99,
};
const SAMPLE_TEXT = JSON.stringify(SAMPLE_JS_OBJECT);
const ENCRYPTED_SAMPLE_TEXT =
  "63991743d21dafe74295102823ba519d573b8847938e948a6e1821ab90fd9872f9ff9b5fd2978e572d7dd886ec2665add7dfd16dc257bc33721eae463dafd1a8";

describe("Cryptography", () => {
  describe("Encrypt", () => {
    test("Should encrypt text", () => {
      const output = encrypt(KEY, INITIALIZATION_VECTOR, SAMPLE_TEXT);
      expect(output.iv).toBe(INITIALIZATION_VECTOR);
      expect(output.encryptedData).toBe(ENCRYPTED_SAMPLE_TEXT);
    });

    test("Should produce different output using new key", () => {
      const newKey = generateKey();
      const output = encrypt(newKey, INITIALIZATION_VECTOR, SAMPLE_TEXT);
      expect(output.iv).toBe(INITIALIZATION_VECTOR);
      expect(output.encryptedData).not.toBe(ENCRYPTED_SAMPLE_TEXT);
    });

    test("Should produce different output using new iv", () => {
      const newIv = generateInitializationVector();
      const output = encrypt(KEY, newIv, SAMPLE_TEXT);
      expect(output.iv).toBe(newIv);
      expect(output.encryptedData).not.toBe(ENCRYPTED_SAMPLE_TEXT);
    });
  });

  describe("Decrypt", () => {
    test("Should decrypt data that was encrypted using same key and iv", () => {
      const output = decrypt(KEY, INITIALIZATION_VECTOR, ENCRYPTED_SAMPLE_TEXT);
      expect(output).toBe(SAMPLE_TEXT);
    });

    test("Should not decrypt data encrypted using different key but same iv", () => {
      const newKey = generateKey();

      const encryptedOutput = encrypt(
        newKey,
        INITIALIZATION_VECTOR,
        SAMPLE_TEXT
      );

      const decryptedOutput = () => {
        return decrypt(KEY, encryptedOutput.iv, encryptedOutput.encryptedData);
      };

      expect(decryptedOutput).toThrow();
    });
  });
});
