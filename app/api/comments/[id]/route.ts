import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateCommentSchema, moderateCommentSchema } from "@/features/comments/schemas";

export async function PATCH(
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
    
    // Check if this is a moderation action
    if (body.status) {
      const userRole = session.user.role;
      if (userRole !== "MOD" && userRole !== "ADMIN") {
        return NextResponse.json(
          { error: "Sem permissão" },
          { status: 403 }
        );
      }

      const validated = moderateCommentSchema.parse(body);
      const comment = await prisma.comment.update({
        where: { id: params.id },
        data: { status: validated.status },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json(comment);
    }

    // Regular content update - must be owner
    const validated = updateCommentSchema.parse(body);

    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Sem permissão" },
        { status: 403 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: params.id },
      data: { content: validated.content },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            votes: true,
            replies: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar comentário" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    const userRole = session.user.role;
    const isOwner = comment.userId === session.user.id;
    const isModerator = userRole === "MOD" || userRole === "ADMIN";

    if (!isOwner && !isModerator) {
      return NextResponse.json(
        { error: "Sem permissão" },
        { status: 403 }
      );
    }

    // Mark as deleted instead of actually deleting
    await prisma.comment.update({
      where: { id: params.id },
      data: { status: "DELETED" },
    });

    return NextResponse.json({ message: "Comentário removido" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao remover comentário" },
      { status: 500 }
    );
  }
}
