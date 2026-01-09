import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNextTopic } from "@/lib/get-next-topic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
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
      return NextResponse.json(
        { error: "Tema não encontrado" },
        { status: 404 }
      );
    }

    // Get next topic
    const nextTopic = await getNextTopic(
      currentTopic.id,
      currentTopic.tags,
      currentTopic.language
    );

    if (!nextTopic) {
      return NextResponse.json({ nextTopic: null });
    }

    return NextResponse.json({ nextTopic });
  } catch (error) {
    console.error("Error fetching next topic:", error);
    return NextResponse.json(
      { error: "Erro ao buscar próximo tema" },
      { status: 500 }
    );
  }
}
