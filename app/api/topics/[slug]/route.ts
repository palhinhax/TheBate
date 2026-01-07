import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateTopicSchema } from "@/features/topics/schemas";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
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
      const session = await auth();
      const userRole = session?.user?.role;
      if (!userRole || (userRole !== "MOD" && userRole !== "ADMIN")) {
        return NextResponse.json(
          { error: "Tema não encontrado" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tema" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const userRole = session.user.role;
    if (userRole !== "MOD" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Sem permissão" },
        { status: 403 }
      );
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
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
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
