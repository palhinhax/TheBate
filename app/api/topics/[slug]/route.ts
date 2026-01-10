import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateTopicSchema } from "@/features/topics/schemas";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    
    const topic = await prisma.topic.findUnique({
      where: { slug: params.slug },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        options: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            comments: true,
            topicVotes: true,
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json(
        { error: "Tema não encontrado" },
        { status: 404 }
      );
    }

    // Only show non-ACTIVE topics to mods/admins
    if (topic.status !== "ACTIVE") {
      const userRole = session?.user?.role;
      if (!userRole || (userRole !== "MOD" && userRole !== "ADMIN")) {
        return NextResponse.json(
          { error: "Tema não encontrado" },
          { status: 404 }
        );
      }
    }

    if (topic.type === "YES_NO") {
      // Get vote statistics for YES_NO topics
      const voteStats = await prisma.topicVote.groupBy({
        by: ["vote"],
        where: { topicId: topic.id, vote: { not: null } },
        _count: true,
      });

      const voteCounts = {
        SIM: 0,
        NAO: 0,
        DEPENDE: 0,
        total: 0,
      };

      voteStats.forEach((stat) => {
        if (stat.vote) {
          voteCounts[stat.vote] = stat._count;
          voteCounts.total += stat._count;
        }
      });

      // Get user's vote if authenticated
      let userVote = null;
      if (session?.user) {
        const vote = await prisma.topicVote.findFirst({
          where: {
            userId: session.user.id,
            topicId: topic.id,
            vote: { not: null },
          },
          select: { vote: true },
        });
        userVote = vote?.vote || null;
      }

      return NextResponse.json({
        ...topic,
        voteStats: voteCounts,
        userVote,
        userVoteOptions: [],
        optionVoteStats: [],
      });
    } else {
      // Get vote statistics for MULTI_CHOICE topics
      const optionVotes = await prisma.topicVote.groupBy({
        by: ["optionId"],
        where: { topicId: topic.id, optionId: { not: null } },
        _count: true,
      });

      const optionVoteStats = optionVotes.map((stat) => ({
        optionId: stat.optionId as string,
        count: stat._count,
      }));

      const totalVotes = await prisma.topicVote.count({
        where: { topicId: topic.id, optionId: { not: null } },
      });

      // Get user's selected options if authenticated
      let userVoteOptions: string[] = [];
      if (session?.user) {
        const userVotes = await prisma.topicVote.findMany({
          where: {
            userId: session.user.id,
            topicId: topic.id,
            optionId: { not: null },
          },
          select: { optionId: true },
        });
        userVoteOptions = userVotes
          .map((v) => v.optionId)
          .filter((id): id is string => id !== null);
      }

      return NextResponse.json({
        ...topic,
        voteStats: { SIM: 0, NAO: 0, DEPENDE: 0, total: totalVotes },
        userVote: null,
        userVoteOptions,
        optionVoteStats,
      });
    }
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json({ error: "Erro ao buscar tema" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userRole = session.user.role;
    if (userRole !== "MOD" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const body = await req.json();
    const validated = updateTopicSchema.parse(body);

    const topic = await prisma.topic.update({
      where: { slug: params.slug },
      data: {
        status: validated.status,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Error updating topic:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Tema não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar tema" },
      { status: 500 }
    );
  }
}
