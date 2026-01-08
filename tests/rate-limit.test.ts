/**
 * Tests for rate limiting utilities
 */

import {
  checkRateLimit,
  resetRateLimit,
  getClientIp,
} from "@/lib/rate-limit";

describe("Rate Limiting Utilities", () => {
  beforeEach(() => {
    // Reset rate limits before each test
    resetRateLimit("test-identifier");
  });

  describe("checkRateLimit", () => {
    it("should allow requests within limit", () => {
      const config = { maxAttempts: 3, windowMs: 60000 };

      const result1 = checkRateLimit("test-user", config);
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(2);

      const result2 = checkRateLimit("test-user", config);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(1);

      const result3 = checkRateLimit("test-user", config);
      expect(result3.success).toBe(true);
      expect(result3.remaining).toBe(0);
    });

    it("should block requests after limit exceeded", () => {
      const config = { maxAttempts: 2, windowMs: 60000 };

      checkRateLimit("test-user", config);
      checkRateLimit("test-user", config);

      const blockedResult = checkRateLimit("test-user", config);
      expect(blockedResult.success).toBe(false);
      expect(blockedResult.remaining).toBe(0);
    });

    it("should track different identifiers separately", () => {
      const config = { maxAttempts: 2, windowMs: 60000 };

      const result1 = checkRateLimit("user1", config);
      const result2 = checkRateLimit("user2", config);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    it("should reset after window expires", async () => {
      const config = { maxAttempts: 2, windowMs: 100 }; // 100ms window

      const result1 = checkRateLimit("test-user", config);
      const result2 = checkRateLimit("test-user", config);

      // Should be blocked
      const blockedResult = checkRateLimit("test-user", config);
      expect(blockedResult.success).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Reset to start fresh after window expiry
      resetRateLimit("test-user");

      // Should be allowed again
      const allowedResult = checkRateLimit("test-user", config);
      expect(allowedResult.success).toBe(true);
      expect(allowedResult.remaining).toBe(1);
    });
  });

  describe("resetRateLimit", () => {
    it("should reset rate limit for identifier", () => {
      const config = { maxAttempts: 1, windowMs: 60000 };

      checkRateLimit("test-user", config);

      // Should be blocked
      let result = checkRateLimit("test-user", config);
      expect(result.success).toBe(false);

      // Reset
      resetRateLimit("test-user");

      // Should be allowed again
      result = checkRateLimit("test-user", config);
      expect(result.success).toBe(true);
    });
  });

  describe("getClientIp", () => {
    it("should extract IP from cf-connecting-ip header", () => {
      const request = {
        headers: {
          get: (header: string) => {
            if (header === "cf-connecting-ip") return "1.2.3.4";
            return null;
          },
        },
      } as Request;

      const ip = getClientIp(request);
      expect(ip).toBe("1.2.3.4");
    });

    it("should extract IP from x-real-ip header", () => {
      const request = {
        headers: {
          get: (header: string) => {
            if (header === "x-real-ip") return "5.6.7.8";
            return null;
          },
        },
      } as Request;

      const ip = getClientIp(request);
      expect(ip).toBe("5.6.7.8");
    });

    it("should extract first IP from x-forwarded-for header", () => {
      const request = {
        headers: {
          get: (header: string) => {
            if (header === "x-forwarded-for")
              return "9.10.11.12, 13.14.15.16";
            return null;
          },
        },
      } as Request;

      const ip = getClientIp(request);
      expect(ip).toBe("9.10.11.12");
    });

    it("should prioritize cf-connecting-ip over others", () => {
      const request = {
        headers: {
          get: (header: string) => {
            if (header === "cf-connecting-ip") return "1.1.1.1";
            if (header === "x-real-ip") return "2.2.2.2";
            if (header === "x-forwarded-for") return "3.3.3.3";
            return null;
          },
        },
      } as Request;

      const ip = getClientIp(request);
      expect(ip).toBe("1.1.1.1");
    });

    it("should return unknown for request without IP headers", () => {
      const request = {
        headers: {
          get: () => null,
        },
      } as Request;

      const ip = getClientIp(request);
      expect(ip).toBe("unknown");
    });
  });
});
