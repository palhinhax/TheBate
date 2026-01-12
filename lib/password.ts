import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "crypto";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compare password with hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random token for password reset
 * @returns {string} Raw token (to be sent via email)
 */
export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Hash a token using SHA-256
 * @param token Raw token
 * @returns {string} Token hash (to be stored in database)
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
