/**
 * Basic validation tests for seed data generators
 * Run with: npm test -- seed-data-generators.test.ts
 */

import {
  generateUsersForLocale,
  getRandomComment,
  randomDateInRange,
  adjustForActivityPattern,
  getLongTailVoteCount,
} from "../scripts/seed-data-generators";

describe("Seed Data Generators", () => {
  describe("generateUsersForLocale", () => {
    it("should generate users for English locale", () => {
      const users = generateUsersForLocale("en", 5);
      expect(users).toHaveLength(5);
      expect(users[0]).toHaveProperty("name");
      expect(users[0]).toHaveProperty("username");
      expect(users[0]).toHaveProperty("email");
      expect(users[0].locale).toBe("en");
    });

    it("should generate users for Portuguese locale", () => {
      const users = generateUsersForLocale("pt", 3);
      expect(users).toHaveLength(3);
      expect(users[0].locale).toBe("pt");
      expect(users[0].email).toContain(".pt");
    });

    it("should generate unique usernames", () => {
      const users = generateUsersForLocale("en", 10);
      const usernames = users.map((u) => u.username);
      const uniqueUsernames = new Set(usernames);
      expect(uniqueUsernames.size).toBe(users.length);
    });

    it("should generate valid email addresses", () => {
      const users = generateUsersForLocale("en", 5);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      users.forEach((user) => {
        expect(user.email).toMatch(emailRegex);
      });
    });
  });

  describe("getRandomComment", () => {
    it("should return pro comment in English", () => {
      const comment = getRandomComment("en", "pro");
      expect(comment).toBeTruthy();
      expect(typeof comment).toBe("string");
      expect(comment.length).toBeGreaterThan(10);
    });

    it("should return contra comment in Portuguese", () => {
      const comment = getRandomComment("pt", "contra");
      expect(comment).toBeTruthy();
      expect(typeof comment).toBe("string");
    });

    it("should return neutral comment", () => {
      const comment = getRandomComment("en", "neutral");
      expect(comment).toBeTruthy();
      expect(typeof comment).toBe("string");
    });

    it("should return different comments on multiple calls", () => {
      const comments = new Set();
      for (let i = 0; i < 20; i++) {
        comments.add(getRandomComment("en", "pro"));
      }
      // Should have at least 2 different comments out of 20 calls
      expect(comments.size).toBeGreaterThan(1);
    });

    it("should support all locales", () => {
      const locales = ["en", "pt", "es", "fr", "de", "it"];
      locales.forEach((locale) => {
        const comment = getRandomComment(locale, "pro");
        expect(comment).toBeTruthy();
      });
    });
  });

  describe("randomDateInRange", () => {
    it("should return a date within range", () => {
      const date = randomDateInRange(30, 0);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      expect(date.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(date.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo.getTime());
    });

    it("should return dates in the past when both params are positive", () => {
      const date = randomDateInRange(180, 30);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      expect(date.getTime()).toBeLessThanOrEqual(thirtyDaysAgo.getTime());
    });

    it("should return different dates on multiple calls", () => {
      const dates = new Set();
      for (let i = 0; i < 10; i++) {
        dates.add(randomDateInRange(30, 0).getTime());
      }
      expect(dates.size).toBeGreaterThan(1);
    });
  });

  describe("adjustForActivityPattern", () => {
    it("should return a valid date", () => {
      const inputDate = new Date("2024-01-15T12:00:00");
      const adjusted = adjustForActivityPattern(inputDate);
      expect(adjusted).toBeInstanceOf(Date);
      expect(adjusted.getFullYear()).toBe(2024);
      expect(adjusted.getMonth()).toBe(0); // January
    });

    it("should sometimes adjust to peak hours", () => {
      const peakHours = new Set();
      for (let i = 0; i < 100; i++) {
        const inputDate = new Date("2024-01-15T12:00:00");
        const adjusted = adjustForActivityPattern(inputDate);
        if (adjusted.getHours() >= 19 && adjusted.getHours() <= 23) {
          peakHours.add(adjusted.getHours());
        }
      }
      // Should have some peak hour adjustments in 100 iterations
      expect(peakHours.size).toBeGreaterThan(0);
    });
  });

  describe("getLongTailVoteCount", () => {
    it("should return a non-negative number", () => {
      const count = getLongTailVoteCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it("should respect max votes parameter", () => {
      const maxVotes = 20;
      const count = getLongTailVoteCount(maxVotes);
      expect(count).toBeLessThanOrEqual(maxVotes);
    });

    it("should return mostly low numbers (long-tail distribution)", () => {
      const counts: number[] = [];
      for (let i = 0; i < 1000; i++) {
        counts.push(getLongTailVoteCount(50));
      }

      // Most should be 0-5
      const lowVotes = counts.filter((c) => c <= 5).length;
      expect(lowVotes).toBeGreaterThan(800); // At least 80%

      // Few should be high
      const highVotes = counts.filter((c) => c > 15).length;
      expect(highVotes).toBeLessThan(100); // Less than 10%
    });

    it("should have good variation", () => {
      const uniqueCounts = new Set();
      for (let i = 0; i < 100; i++) {
        uniqueCounts.add(getLongTailVoteCount(50));
      }
      // Should have at least a few different values
      expect(uniqueCounts.size).toBeGreaterThan(3);
    });
  });
});
