/**
 * Tests for auth configuration utilities
 */

import { requireAuthForInteractions } from "@/lib/auth-config";

describe("Auth Configuration Utilities", () => {
  describe("requireAuthForInteractions", () => {
    const originalEnv = process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS;

    afterEach(() => {
      // Restore original env value
      process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS = originalEnv;
    });

    it("should return false when env is not set (default)", () => {
      delete process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS;
      expect(requireAuthForInteractions()).toBe(false);
    });

    it("should return false when env is 'false'", () => {
      process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS = "false";
      expect(requireAuthForInteractions()).toBe(false);
    });

    it("should return true when env is 'true'", () => {
      process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS = "true";
      expect(requireAuthForInteractions()).toBe(true);
    });

    it("should return false when env is empty string", () => {
      process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS = "";
      expect(requireAuthForInteractions()).toBe(false);
    });

    it("should handle case insensitive 'true'", () => {
      process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS = "TRUE";
      expect(requireAuthForInteractions()).toBe(true);
    });

    it("should return false for any value other than 'true'", () => {
      process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS = "yes";
      expect(requireAuthForInteractions()).toBe(false);

      process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS = "1";
      expect(requireAuthForInteractions()).toBe(false);
    });
  });

  // Note: Browser-side functions (generateAnonymousId, storeAnonymousVote, etc.)
  // are tested through integration tests and manual testing in the browser
  // as they require window.localStorage and navigator APIs
});
