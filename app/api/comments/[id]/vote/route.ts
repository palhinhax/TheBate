import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const voteBodySchema = z.object({
  value: z.literal(1), // Only +1 for quality vote
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { value } = voteBodySchema.parse(body);

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comentário não encontrado" }, { status: 404 });
    }

    // Users can't vote on their own comments
    if (comment.userId === session.user.id) {
      return NextResponse.json(
        { error: "Não pode votar no seu próprio comentário" },
        { status: 400 }
      );
    }

    // Find existing vote
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId: params.id,
        },
      },
    });

    if (existingVote) {
      // Remove vote if clicking again (toggle)
      await prisma.vote.delete({
        where: { id: existingVote.id },
      });
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          value,
          commentId: params.id,
          userId: session.user.id,
        },
      });
    }

    // Fetch updated comment with vote count
    const updatedComment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        _count: {
          select: {
            votes: true,
          },
        },
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
