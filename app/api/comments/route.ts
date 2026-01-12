import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { commentSchema, replySchema } from "@/features/comments/schemas";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();

    // Check if this is a reply or a top-level comment
    const isReply = !!body.parentId;
    const validated = isReply ? replySchema.parse(body) : commentSchema.parse(body);

    // Check if topic exists and is not locked
    const topic = await prisma.topic.findUnique({
      where: { id: validated.topicId },
      select: { status: true, type: true },
    });

    if (!topic) {
      return NextResponse.json({ error: "Tema não encontrado" }, { status: 404 });
    }

    if (topic.status === "LOCKED") {
      return NextResponse.json(
        { error: "Este tema está bloqueado para novos comentários" },
        { status: 403 }
      );
    }

    // If replying, check parent exists
    if (validated.parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: validated.parentId },
        select: { topicId: true },
      });

      if (!parent || parent.topicId !== validated.topicId) {
        return NextResponse.json({ error: "Comentário pai não encontrado" }, { status: 404 });
      }
    }

    // Validate optionId for MULTI_CHOICE topics
    let optionId = null;
    if (!isReply && topic.type === "MULTI_CHOICE" && "optionId" in validated) {
      optionId = validated.optionId || null;

      // Verify optionId belongs to this topic
      if (optionId) {
        const option = await prisma.topicOption.findUnique({
          where: { id: optionId },
          select: { topicId: true },
        });

        if (!option || option.topicId !== validated.topicId) {
          return NextResponse.json({ error: "Opção inválida" }, { status: 400 });
        }
      }
    }

    const commentData = {
      content: validated.content,
      side: isReply ? null : topic.type === "YES_NO" && "side" in validated ? validated.side : null,
      optionId: isReply ? null : optionId,
      topicId: validated.topicId,
      userId: session.user.id,
      parentId: validated.parentId || null,
    };

    const comment = await prisma.comment.create({
      data: commentData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        option: {
          select: {
            id: true,
            label: true,
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

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar comentário" }, { status: 500 });
  }
}
