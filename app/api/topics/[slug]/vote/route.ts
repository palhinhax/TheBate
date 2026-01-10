import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import {
  yesNoVoteSchema,
  multiChoiceVoteSchema,
} from "@/features/topics/schemas/topic.schema";

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

    // Handle voting based on topic type
    if (topic.type === "YES_NO") {
      const { vote } = yesNoVoteSchema.parse(body);

      // Upsert vote (create or update)
      await prisma.topicVote.upsert({
        where: {
          userId_topicId_optionId: {
            userId: session.user.id,
            topicId: topic.id,
            optionId: null,
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
        where: { topicId: topic.id, optionId: null },
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
    } else if (topic.type === "MULTI_CHOICE") {
      const { optionIds } = multiChoiceVoteSchema.parse(body);

      // Validate option IDs belong to this topic
      const validOptions = await prisma.topicOption.findMany({
        where: {
          id: { in: optionIds },
          topicId: topic.id,
        },
      });

      if (validOptions.length !== optionIds.length) {
        return NextResponse.json(
          { error: "Opções inválidas" },
          { status: 400 }
        );
      }

      // Check if multiple votes are allowed
      if (!topic.allowMultipleVotes && optionIds.length > 1) {
        return NextResponse.json(
          { error: "Este tema permite apenas uma escolha" },
          { status: 400 }
        );
      }

      // Check max choices
      if (optionIds.length > topic.maxChoices) {
        return NextResponse.json(
          {
            error: `Pode escolher no máximo ${topic.maxChoices} opç${topic.maxChoices === 1 ? "ão" : "ões"}`,
          },
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

      // Create new votes
      await prisma.topicVote.createMany({
        data: optionIds.map((optionId) => ({
          userId: session.user.id,
          topicId: topic.id,
          optionId,
        })),
      });

      // Get updated vote statistics per option
      const voteStats = await prisma.topicVote.groupBy({
        by: ["optionId"],
        where: {
          topicId: topic.id,
          optionId: { not: null },
        },
        _count: true,
      });

      const optionVoteCounts = voteStats.reduce(
        (acc, stat) => {
          if (stat.optionId) {
            acc[stat.optionId] = stat._count;
          }
          return acc;
        },
        {} as Record<string, number>
      );

      const totalVotes = voteStats.reduce((sum, stat) => sum + stat._count, 0);

      return NextResponse.json({
        success: true,
        userVotes: optionIds,
        optionVoteCounts,
        totalVotes,
      });
    } else {
      return NextResponse.json(
        { error: "Tipo de tema não suportado" },
        { status: 400 }
      );
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

    // Find topic and get its type
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

    // Return updated statistics based on topic type
    if (topic.type === "YES_NO") {
      const voteStats = await prisma.topicVote.groupBy({
        by: ["vote"],
        where: { topicId: topic.id, optionId: null },
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
      // MULTI_CHOICE
      const voteStats = await prisma.topicVote.groupBy({
        by: ["optionId"],
        where: {
          topicId: topic.id,
          optionId: { not: null },
        },
        _count: true,
      });

      const optionVoteCounts = voteStats.reduce(
        (acc, stat) => {
          if (stat.optionId) {
            acc[stat.optionId] = stat._count;
          }
          return acc;
        },
        {} as Record<string, number>
      );

      const totalVotes = voteStats.reduce((sum, stat) => sum + stat._count, 0);

      return NextResponse.json({
        success: true,
        userVotes: [],
        optionVoteCounts,
        totalVotes,
      });
    }
  } catch (error) {
    console.error("Error deleting vote:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Voto não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao remover voto" },
      { status: 500 }
    );
  }
}
