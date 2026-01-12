import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/topics/[slug]/report
 * Reporta um tema para moderação
 */
export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { slug } = params;

    // Verificar se o tema existe
    const topic = await prisma.topic.findUnique({
      where: { slug },
      select: { id: true, reportCount: true },
    });

    if (!topic) {
      return NextResponse.json({ error: "Tema não encontrado" }, { status: 404 });
    }

    // Incrementar reportCount
    const updatedTopic = await prisma.topic.update({
      where: { slug },
      data: {
        reportCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        reportCount: true,
      },
    });

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: "Erro ao reportar tema" }, { status: 500 });
  }
}
