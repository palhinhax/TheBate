import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { topicSchema } from "@/features/topics/schemas";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "new";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = Math.min(
      parseInt(searchParams.get("perPage") || "20"),
      100
    );
    const tag = searchParams.get("tag");

    const skip = (page - 1) * perPage;

    const where: Record<string, unknown> = {
      status: "ACTIVE" as const,
    };

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    const orderBy =
      sort === "new"
        ? { createdAt: "desc" as const }
        : { createdAt: "desc" as const }; // TODO: implement real trending algorithm

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
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
      }),
      prisma.topic.count({ where }),
    ]);

    return NextResponse.json({
      topics,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Erro ao buscar temas" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validated = topicSchema.parse(body);

    // Generate unique slug
    const baseSlug = generateSlug(validated.title);
    const slug = await generateUniqueSlug(baseSlug, async (slug) => {
      const existing = await prisma.topic.findUnique({ where: { slug } });
      return !!existing;
    });

    // Create topic with options if MULTI_CHOICE
    const topic = await prisma.topic.create({
      data: {
        slug,
        title: validated.title,
        description: validated.description,
        language: validated.language,
        tags: validated.tags,
        type: validated.type,
        allowMultipleVotes:
          validated.type === "MULTI_CHOICE"
            ? validated.allowMultipleVotes
            : false,
        maxChoices:
          validated.type === "MULTI_CHOICE" ? validated.maxChoices : 1,
        createdById: session.user.id,
        ...(validated.type === "MULTI_CHOICE" &&
          validated.options && {
            options: {
              createMany: {
                data: validated.options.map((option) => ({
                  label: option.label,
                  description: option.description || null,
                  order: option.order,
                })),
              },
            },
          }),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        options: true,
      },
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar tema" }, { status: 500 });
  }
}
