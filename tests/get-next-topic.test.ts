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
  const mockFindFirst = prisma.topic.findFirst as jest.MockedFunction<
    typeof prisma.topic.findFirst
  >;

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFindFirst.mockResolvedValueOnce(mockRelatedTopic as any);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toEqual(mockRelatedTopic);
    expect(mockFindFirst).toHaveBeenCalledWith({
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
    mockFindFirst.mockResolvedValueOnce(null);
    // Second call returns recent topic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFindFirst.mockResolvedValueOnce(mockRecentTopic as any);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toEqual(mockRecentTopic);
    expect(mockFindFirst).toHaveBeenCalledTimes(2);
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
    mockFindFirst.mockResolvedValueOnce(null);
    // Second call returns null (no same-language topics)
    mockFindFirst.mockResolvedValueOnce(null);
    // Third call returns fallback topic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFindFirst.mockResolvedValueOnce(mockFallbackTopic as any);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toEqual(mockFallbackTopic);
    expect(mockFindFirst).toHaveBeenCalledTimes(3);
  });

  it("should return null if no topics available at all", async () => {
    const currentTopicId = "topic-1";
    const currentTopicTags = ["tag"];
    const language = "pt";

    // All calls return null
    mockFindFirst.mockResolvedValue(null);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toBeNull();
    expect(mockFindFirst).toHaveBeenCalledTimes(3);
  });

  it("should handle empty tags array", async () => {
    const currentTopicId = "topic-1";
    const currentTopicTags: string[] = [];
    const language = "pt";

    const mockRecentTopic = {
      slug: "recent-topic",
      title: "Recent Topic Title",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFindFirst.mockResolvedValueOnce(mockRecentTopic as any);

    const result = await getNextTopic(
      currentTopicId,
      currentTopicTags,
      language
    );

    expect(result).toEqual(mockRecentTopic);
    // Should skip related topics query and go straight to recent topics
    expect(mockFindFirst).toHaveBeenCalledTimes(1);
    expect(mockFindFirst).toHaveBeenCalledWith({
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
    mockFindFirst.mockRejectedValueOnce(
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
