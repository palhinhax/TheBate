/**
 * Tests for password utilities
 */

import {
  hashPassword,
  verifyPassword,
  generateResetToken,
  hashToken,
  validatePasswordStrength,
} from "@/lib/password";

describe("Password Utilities", () => {
  describe("hashPassword and verifyPassword", () => {
    it("should hash and verify password correctly", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it("should fail verification with wrong password", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);

      const isValid = await verifyPassword("WrongPassword123!", hash);
      expect(isValid).toBe(false);
    });
  });

  describe("generateResetToken", () => {
    it("should generate a token", () => {
      const token = generateResetToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it("should generate unique tokens", () => {
      const token1 = generateResetToken();
      const token2 = generateResetToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe("hashToken", () => {
    it("should hash a token consistently", () => {
      const token = "test-token";
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(token);
    });

    it("should produce different hashes for different tokens", () => {
      const hash1 = hashToken("token1");
      const hash2 = hashToken("token2");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("validatePasswordStrength", () => {
    it("should accept strong password", () => {
      const result = validatePasswordStrength("StrongPass123!");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject password shorter than 8 characters", () => {
      const result = validatePasswordStrength("Short1!");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("A senha deve ter pelo menos 8 caracteres");
    });

    it("should reject password without uppercase", () => {
      const result = validatePasswordStrength("lowercase123");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject password without lowercase", () => {
      const result = validatePasswordStrength("UPPERCASE123");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject password without number", () => {
      const result = validatePasswordStrength("NoNumbersHere");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should report multiple errors", () => {
      const result = validatePasswordStrength("weak");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });
});
