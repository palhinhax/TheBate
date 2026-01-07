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
    const perPage = Math.min(parseInt(searchParams.get("perPage") || "20"), 100);
    const tag = searchParams.get("tag");

    const skip = (page - 1) * perPage;

    const where: any = {
      status: "ACTIVE",
    };

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    let orderBy: any = {};
    if (sort === "new") {
      orderBy = { createdAt: "desc" };
    } else {
      // For "trending", we'd ideally calculate based on recent activity
      // For now, using a combination of comment count and recency
      orderBy = { createdAt: "desc" };
    }

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
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = topicSchema.parse(body);

    // Generate unique slug
    const baseSlug = generateSlug(validated.title);
    const slug = await generateUniqueSlug(baseSlug, async (slug) => {
      const existing = await prisma.topic.findUnique({ where: { slug } });
      return !!existing;
    });

    const topic = await prisma.topic.create({
      data: {
        slug,
        title: validated.title,
        description: validated.description,
        tags: validated.tags,
        createdById: session.user.id,
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

    return NextResponse.json(topic, { status: 201 });
  } catch (error: any) {
    console.error("Error creating topic:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar tema" },
      { status: 500 }
    );
  }
}
