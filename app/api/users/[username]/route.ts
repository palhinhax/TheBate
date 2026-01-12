import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Utilizador não encontrado" }, { status: 404 });
    }

    // Get user's topics with counts
    const topics = await prisma.topic.findMany({
      where: {
        createdById: user.id,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        slug: true,
        title: true,
        tags: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
            topicVotes: true,
          },
        },
      },
    });

    // Get user's comments with votes
    const comments = await prisma.comment.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
      take: 50,
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
    });

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
      topics,
      comments: commentsWithVoteCounts,
      stats: {
        totalTopics: topics.length,
        totalComments: comments.length,
        totalVotesReceived,
      },
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Erro ao carregar perfil do utilizador" }, { status: 500 });
  }
}
