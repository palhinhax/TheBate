import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const yesNoVoteSchema = z.object({
  vote: z.enum(["SIM", "NAO", "DEPENDE"]),
});

const multiChoiceVoteSchema = z.object({
  optionIds: z.array(z.string()).min(1, "Selecione pelo menos uma opção"),
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

    // Check if topic exists and get its type
    const topic = await prisma.topic.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        status: true,
        type: true,
        allowMultipleVotes: true,
        maxChoices: true,
      },
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

    if (topic.type === "YES_NO") {
      // Handle YES_NO vote
      const { vote } = yesNoVoteSchema.parse(body);

      // Delete any existing votes for this user on this topic
      await prisma.topicVote.deleteMany({
        where: {
          userId: session.user.id,
          topicId: topic.id,
        },
      });

      // Create new vote
      await prisma.topicVote.create({
        data: {
          vote,
          topicId: topic.id,
          userId: session.user.id,
        },
      });

      // Get updated vote statistics
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

      return NextResponse.json({
        success: true,
        userVote: vote,
        voteStats: voteCounts,
      });
    } else {
      // Handle MULTI_CHOICE vote
      const { optionIds } = multiChoiceVoteSchema.parse(body);

      // Validate maxChoices
      if (
        !topic.allowMultipleVotes &&
        optionIds.length > 1
      ) {
        return NextResponse.json(
          { error: "Este tema permite apenas uma escolha" },
          { status: 400 }
        );
      }

      if (topic.allowMultipleVotes && optionIds.length > topic.maxChoices) {
        return NextResponse.json(
          {
            error: `Você pode selecionar no máximo ${topic.maxChoices} opções`,
          },
          { status: 400 }
        );
      }

      // Verify all options belong to this topic
      const options = await prisma.topicOption.findMany({
        where: {
          id: { in: optionIds },
          topicId: topic.id,
        },
      });

      if (options.length !== optionIds.length) {
        return NextResponse.json(
          { error: "Uma ou mais opções são inválidas" },
          { status: 400 }
        );
      }

      // Delete existing votes for this user on this topic
      await prisma.topicVote.deleteMany({
        where: {
          userId: session.user.id,
          topicId: topic.id,
        },
      });

      // Create new votes for each selected option
      await prisma.topicVote.createMany({
        data: optionIds.map((optionId) => ({
          optionId,
          topicId: topic.id,
          userId: session.user.id,
        })),
      });

      // Get updated vote statistics per option
      const optionVotes = await prisma.topicVote.groupBy({
        by: ["optionId"],
        where: { topicId: topic.id, optionId: { not: null } },
        _count: true,
      });

      const optionVoteStats = optionVotes.map((stat) => ({
        optionId: stat.optionId,
        count: stat._count,
      }));

      const totalVotes = await prisma.topicVote.count({
        where: { topicId: topic.id, optionId: { not: null } },
      });

      return NextResponse.json({
        success: true,
        userVoteOptions: optionIds,
        optionVoteStats,
        totalVotes,
      });
    }
  } catch (error) {
    console.error("Error voting on topic:", error);
    if (error instanceof z.ZodError) {
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
      select: { id: true, type: true },
    });

    if (!topic) {
      return NextResponse.json(
        { error: "Tema não encontrado" },
        { status: 404 }
      );
    }

    // Delete all votes for this user on this topic
    await prisma.topicVote.deleteMany({
      where: {
        userId: session.user.id,
        topicId: topic.id,
      },
    });

    if (topic.type === "YES_NO") {
      // Get updated vote statistics for YES_NO
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

      return NextResponse.json({
        success: true,
        userVote: null,
        voteStats: voteCounts,
      });
    } else {
      // Get updated vote statistics for MULTI_CHOICE
      const optionVotes = await prisma.topicVote.groupBy({
        by: ["optionId"],
        where: { topicId: topic.id, optionId: { not: null } },
        _count: true,
      });

      const optionVoteStats = optionVotes.map((stat) => ({
        optionId: stat.optionId,
        count: stat._count,
      }));

      const totalVotes = await prisma.topicVote.count({
        where: { topicId: topic.id, optionId: { not: null } },
      });

      return NextResponse.json({
        success: true,
        userVoteOptions: [],
        optionVoteStats,
        totalVotes,
      });
    }
  } catch (error) {
    console.error("Error deleting vote:", error);
    return NextResponse.json(
      { error: "Erro ao remover voto" },
      { status: 500 }
    );
  }
}
