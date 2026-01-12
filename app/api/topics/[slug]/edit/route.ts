import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateTopicSchema = z.object({
  imageUrl: z.string().url("URL de imagem inválida").nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const topic = await prisma.topic.findUnique({
      where: { slug: params.slug },
      include: {
        createdBy: true,
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Tema não encontrado" }, { status: 404 });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, isOwner: true },
    });

    // Check if user is the creator, admin, or owner
    const isCreator = topic.createdById === session.user.id;
    const isAdmin = user?.role === "ADMIN";
    const isOwner = user?.isOwner === true;

    if (!isCreator && !isAdmin && !isOwner) {
      return NextResponse.json({ error: "Sem permissão para editar este tema" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateTopicSchema.parse(body);

    const updatedTopic = await prisma.topic.update({
      where: { id: topic.id },
      data: {
        imageUrl: validatedData.imageUrl,
      },
    });

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Error updating topic:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Erro ao atualizar tema" }, { status: 500 });
  }
}
