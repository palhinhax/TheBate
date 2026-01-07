import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, MessageSquare } from "lucide-react";

type Props = {
  params: { username: string };
};

async function getUser(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      createdAt: true,
      topics: {
        where: { status: "ACTIVE" as const },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          slug: true,
          title: true,
          tags: true,
          createdAt: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      },
      comments: {
        where: { status: "ACTIVE" as const },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          topic: {
            select: {
              slug: true,
              title: true,
            },
          },
        },
      },
    },
  });

  return user;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUser(params.username);

  if (!user) {
    return {
      title: "Usuário não encontrado",
    };
  }

  return {
    title: `@${user.username} - Thebate`,
    description: `Perfil de ${user.name || user.username} no Thebate`,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const user = await getUser(params.username);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold">
            Thebate
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* User Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            {user.name || user.username}
          </h1>
          <p className="text-muted-foreground">@{user.username}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Membro desde{" "}
              {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex gap-6">
            <button className="border-b-2 border-primary pb-2 font-medium">
              Temas ({user.topics.length})
            </button>
            <button className="pb-2 text-muted-foreground hover:text-foreground">
              Comentários ({user.comments.length})
            </button>
          </div>
        </div>

        {/* Topics List */}
        {user.topics.length > 0 ? (
          <div className="space-y-4">
            {user.topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/t/${topic.slug}`}
                className="block rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{topic.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {topic.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      {new Date(topic.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-center">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <span className="mt-1 text-sm font-medium">
                      {topic._count.comments}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum tema criado ainda.</p>
          </div>
        )}
      </main>
    </div>
  );
}
