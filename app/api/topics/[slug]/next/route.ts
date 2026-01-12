import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNextTopic } from "@/lib/get-next-topic";

/**
 * GET /api/topics/[slug]/next
 *
 * Fetches the next recommended topic based on priority algorithm:
 * 1. Related topics (same tags)
 * 2. Recent topics (same language)
 * 3. Any recent topic (fallback)
 *
 * @param params.slug - The slug of the current topic
 * @returns JSON response with nextTopic object or null
 */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Get current topic info
    const currentTopic = await prisma.topic.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        tags: true,
        language: true,
      },
    });

    if (!currentTopic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Get next topic
    const nextTopic = await getNextTopic(currentTopic.id, currentTopic.tags, currentTopic.language);

    if (!nextTopic) {
      return NextResponse.json({ nextTopic: null });
    }

    return NextResponse.json({ nextTopic });
  } catch (error) {
    console.error(
      "Error fetching next topic:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json({ error: "Failed to fetch next topic" }, { status: 500 });
  }
}
