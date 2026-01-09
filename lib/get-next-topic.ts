import { prisma } from "./prisma";

/**
 * Get the next topic for navigation based on the following priority:
 * 1. Related topic (same tags or category)
 * 2. Most recent topic
 * 3. Random fallback
 *
 * @param currentTopicId - The ID of the current topic
 * @param currentTopicTags - Tags of the current topic for finding related topics
 * @param language - Language of the current topic to find similar language topics
 * @returns Next topic or null if no topics available
 */
export async function getNextTopic(
  currentTopicId: string,
  currentTopicTags: string[],
  language: string
) {
  try {
    // First, try to find a related topic (same tags)
    if (currentTopicTags.length > 0) {
      const relatedTopic = await prisma.topic.findFirst({
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

      if (relatedTopic) {
        return relatedTopic;
      }
    }

    // Second, try to find the most recent topic in the same language
    const recentTopic = await prisma.topic.findFirst({
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

    if (recentTopic) {
      return recentTopic;
    }

    // Finally, fallback to any recent topic regardless of language
    const fallbackTopic = await prisma.topic.findFirst({
      where: {
        id: { not: currentTopicId },
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        slug: true,
        title: true,
      },
    });

    return fallbackTopic;
  } catch (error) {
    console.error("Error fetching next topic:", error);
    return null;
  }
}
