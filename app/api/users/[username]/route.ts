import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const topicsPageParam = searchParams.get("topicsPage");
    const topicsPerPageParam = searchParams.get("topicsPerPage");
    const commentsPageParam = searchParams.get("commentsPage");
    const commentsPerPageParam = searchParams.get("commentsPerPage");

    // Validate and parse pagination parameters with defaults
    const topicsPage = Math.max(1, parseInt(topicsPageParam || "1") || 1);
    const topicsPerPage = Math.min(Math.max(1, parseInt(topicsPerPageParam || "10") || 10), 50);
    const commentsPage = Math.max(1, parseInt(commentsPageParam || "1") || 1);
    const commentsPerPage = Math.min(Math.max(1, parseInt(commentsPerPageParam || "10") || 10), 50);

    const topicsSkip = (topicsPage - 1) * topicsPerPage;
    const commentsSkip = (commentsPage - 1) * commentsPerPage;

    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        karma: true,
        achievements: {
          include: {
            achievement: true,
          },
          orderBy: {
            unlockedAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Utilizador não encontrado" }, { status: 404 });
    }

    const topicsWhere = {
      createdById: user.id,
      status: "ACTIVE" as const,
    };

    const commentsWhere = {
      userId: user.id,
      status: "ACTIVE" as const,
    };

    // Get user's topics with counts and pagination
    const [topics, totalTopics] = await Promise.all([
      prisma.topic.findMany({
        where: topicsWhere,
        orderBy: { createdAt: "desc" },
        skip: topicsSkip,
        take: topicsPerPage,
        select: {
          id: true,
          slug: true,
          title: true,
          tags: true,
          imageUrl: true,
          createdAt: true,
          _count: {
            select: {
              comments: true,
              topicVotes: true,
            },
          },
        },
      }),
      prisma.topic.count({ where: topicsWhere }),
    ]);

    // Get user's comments with votes and pagination
    const [comments, totalComments] = await Promise.all([
      prisma.comment.findMany({
        where: commentsWhere,
        orderBy: { createdAt: "desc" },
        skip: commentsSkip,
        take: commentsPerPage,
        select: {
          id: true,
          content: true,
          side: true,
          createdAt: true,
          topic: {
            select: {
              slug: true,
              title: true,
            },
          },
          votes: {
            select: {
              value: true,
            },
          },
        },
      }),
      prisma.comment.count({ where: commentsWhere }),
    ]);

    // Calculate total votes received on comments
    const commentsWithVoteCounts = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      side: comment.side,
      createdAt: comment.createdAt,
      topic: comment.topic,
      votes: comment.votes.reduce((sum, vote) => sum + vote.value, 0),
    }));

    // Calculate stats
    const totalVotesReceived = commentsWithVoteCounts.reduce(
      (sum, comment) => sum + comment.votes,
      0
    );

    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      karma: user.karma,
      achievements: user.achievements,
      topics,
      comments: commentsWithVoteCounts,
      stats: {
        totalTopics,
        totalComments,
        totalVotesReceived,
      },
      pagination: {
        topics: {
          page: topicsPage,
          perPage: topicsPerPage,
          total: totalTopics,
          totalPages: Math.ceil(totalTopics / topicsPerPage),
        },
        comments: {
          page: commentsPage,
          perPage: commentsPerPage,
          total: totalComments,
          totalPages: Math.ceil(totalComments / commentsPerPage),
        },
      },
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Erro ao carregar perfil do utilizador" }, { status: 500 });
  }
}
