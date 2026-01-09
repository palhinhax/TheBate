/**
 * Tests for getNextTopic utility function
 */

import { getNextTopic } from "@/lib/get-next-topic";
import { prisma } from "@/lib/prisma";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    topic: {
      findFirst: jest.fn(),
    },
  },
}));

describe("getNextTopic", () => {
  const mockPrisma = prisma as jest.Mocked<typeof prisma>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a related topic with matching tags", async () => {
    const currentTopicId = "topic-1";
    const currentTopicTags = ["technology", "ai"];
    const language = "pt";

    const mockRelatedTopic = {
      slug: "related-topic",
      title: "Related Topic Title",
    };

    mockPrisma.topic.findFirst.mockResolvedValueOnce(mockRelatedTopic);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toEqual(mockRelatedTopic);
    expect(mockPrisma.topic.findFirst).toHaveBeenCalledWith({
      where: {
        id: { not: currentTopicId },
        status: "ACTIVE",
        language: language,
        tags: {
          hasSome: currentTopicTags,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        slug: true,
        title: true,
      },
    });
  });

  it("should return most recent topic in same language if no related topics", async () => {
    const currentTopicId = "topic-1";
    const currentTopicTags = ["technology"];
    const language = "pt";

    const mockRecentTopic = {
      slug: "recent-topic",
      title: "Recent Topic Title",
    };

    // First call returns null (no related topics)
    mockPrisma.topic.findFirst.mockResolvedValueOnce(null);
    // Second call returns recent topic
    mockPrisma.topic.findFirst.mockResolvedValueOnce(mockRecentTopic);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toEqual(mockRecentTopic);
    expect(mockPrisma.topic.findFirst).toHaveBeenCalledTimes(2);
  });

  it("should return fallback topic regardless of language if no same-language topics", async () => {
    const currentTopicId = "topic-1";
    const currentTopicTags = ["rare-tag"];
    const language = "pt";

    const mockFallbackTopic = {
      slug: "fallback-topic",
      title: "Fallback Topic Title",
    };

    // First call returns null (no related topics)
    mockPrisma.topic.findFirst.mockResolvedValueOnce(null);
    // Second call returns null (no same-language topics)
    mockPrisma.topic.findFirst.mockResolvedValueOnce(null);
    // Third call returns fallback topic
    mockPrisma.topic.findFirst.mockResolvedValueOnce(mockFallbackTopic);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toEqual(mockFallbackTopic);
    expect(mockPrisma.topic.findFirst).toHaveBeenCalledTimes(3);
  });

  it("should return null if no topics available at all", async () => {
    const currentTopicId = "topic-1";
    const currentTopicTags = ["tag"];
    const language = "pt";

    // All calls return null
    mockPrisma.topic.findFirst.mockResolvedValue(null);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toBeNull();
    expect(mockPrisma.topic.findFirst).toHaveBeenCalledTimes(3);
  });

  it("should handle empty tags array", async () => {
    const currentTopicId = "topic-1";
    const currentTopicTags: string[] = [];
    const language = "pt";

    const mockRecentTopic = {
      slug: "recent-topic",
      title: "Recent Topic Title",
    };

    mockPrisma.topic.findFirst.mockResolvedValueOnce(mockRecentTopic);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toEqual(mockRecentTopic);
    // Should skip related topics query and go straight to recent topics
    expect(mockPrisma.topic.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.topic.findFirst).toHaveBeenCalledWith({
      where: {
        id: { not: currentTopicId },
        status: "ACTIVE",
        language: language,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        slug: true,
        title: true,
      },
    });
  });

  it("should handle database errors gracefully", async () => {
    const currentTopicId = "topic-1";
    const currentTopicTags = ["tag"];
    const language = "pt";

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockPrisma.topic.findFirst.mockRejectedValueOnce(
      new Error("Database error")
    );

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
