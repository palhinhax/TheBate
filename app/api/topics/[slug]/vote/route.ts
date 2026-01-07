import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const voteBodySchema = z.object({
  vote: z.enum(["SIM", "NAO", "DEPENDE"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { vote } = voteBodySchema.parse(body);

    // Check if topic exists and is active
    const topic = await prisma.topic.findUnique({
      where: { slug: params.slug },
      select: { id: true, status: true },
    });

    if (!topic) {
      return NextResponse.json(
        { error: "Tema não encontrado" },
        { status: 404 }
      );
    }

    if (topic.status === "LOCKED") {
      return NextResponse.json(
        { error: "Este tema está bloqueado para votação" },
        { status: 403 }
      );
    }

    // Upsert vote (create or update)
    await prisma.topicVote.upsert({
      where: {
        userId_topicId: {
          userId: session.user.id,
          topicId: topic.id,
        },
      },
      create: {
        vote,
        topicId: topic.id,
        userId: session.user.id,
      },
      update: {
        vote,
      },
    });

    // Get updated vote statistics
    const voteStats = await prisma.topicVote.groupBy({
      by: ["vote"],
      where: { topicId: topic.id },
      _count: true,
    });

    const voteCounts = {
      SIM: 0,
      NAO: 0,
      DEPENDE: 0,
      total: 0,
    };

    voteStats.forEach((stat) => {
      voteCounts[stat.vote] = stat._count;
      voteCounts.total += stat._count;
    });

    return NextResponse.json({
      success: true,
      userVote: vote,
      voteStats: voteCounts,
    });
  } catch (error) {
    console.error("Error voting on topic:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao votar" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Find topic
    const topic = await prisma.topic.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!topic) {
      return NextResponse.json(
        { error: "Tema não encontrado" },
        { status: 404 }
      );
    }

    // Delete vote
    await prisma.topicVote.delete({
      where: {
        userId_topicId: {
          userId: session.user.id,
          topicId: topic.id,
        },
      },
    });

    // Get updated vote statistics
    const voteStats = await prisma.topicVote.groupBy({
      by: ["vote"],
      where: { topicId: topic.id },
      _count: true,
    });

    const voteCounts = {
      SIM: 0,
      NAO: 0,
      DEPENDE: 0,
      total: 0,
    };

    voteStats.forEach((stat) => {
      voteCounts[stat.vote] = stat._count;
      voteCounts.total += stat._count;
    });

    return NextResponse.json({
      success: true,
      userVote: null,
      voteStats: voteCounts,
    });
  } catch (error) {
    console.error("Error deleting vote:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Voto não encontrado" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Erro ao remover voto" },
      { status: 500 }
    );
  }
}
