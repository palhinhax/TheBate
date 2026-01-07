import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const voteBodySchema = z.object({
  value: z.number().int().min(-1).max(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { value } = voteBodySchema.parse(body);

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

      let scoreDelta = value;

      if (existingVote) {
        if (existingVote.value === value) {
          // Remove vote if clicking the same button
          await tx.vote.delete({
            where: { id: existingVote.id },
          });
          scoreDelta = -existingVote.value;
        } else {
          // Update vote
          await tx.vote.update({
            where: { id: existingVote.id },
            data: { value },
          });
          scoreDelta = value - existingVote.value;
        }
      } else {
        // Create new vote
        await tx.vote.create({
          data: {
            value,
            commentId: params.id,
            userId: session.user.id,
          },
        });
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
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao votar" },
      { status: 500 }
    );
  }
}
