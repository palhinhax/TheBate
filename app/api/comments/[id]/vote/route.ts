import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const voteBodySchema = z.object({
  value: z.literal(1), // Only +1 for quality vote
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    voteBodySchema.parse(body);

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    // Users can't vote on their own comments
    if (comment.userId === session.user.id) {
      return NextResponse.json(
        { error: "Você não pode votar no seu próprio comentário" },
        { status: 400 }
      );
    }

    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // Find existing vote
      const existingVote = await tx.vote.findUnique({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId: params.id,
          },
        },
      });

      let scoreDelta = 0;

      if (existingVote) {
        // Remove vote if clicking again (toggle)
        await tx.vote.delete({
          where: { id: existingVote.id },
        });
        scoreDelta = -1;
      } else {
        // Create new vote
        await tx.vote.create({
          data: {
            value: 1,
            commentId: params.id,
            userId: session.user.id,
          },
        });
        scoreDelta = 1;
      }

      // Update comment score
      await tx.comment.update({
        where: { id: params.id },
        data: {
          score: {
            increment: scoreDelta,
          },
        },
      });
    });

    // Fetch updated comment
    const updatedComment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        score: true,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error voting on comment:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao votar" }, { status: 500 });
  }
}
