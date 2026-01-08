import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { MessageSquare, TrendingUp, Clock, Globe } from "lucide-react";
import { AdContainer } from "@/components/ad-container";

async function getTopics(sort: "trending" | "new" = "new", language?: string) {
  const orderBy =
    sort === "new"
      ? { createdAt: "desc" as const }
      : { createdAt: "desc" as const }; // TODO: implement real trending algorithm

  const topics = await prisma.topic.findMany({
    where: { 
      status: "ACTIVE" as const,
      ...(language ? { language } : {}),
    },
    orderBy,
    take: 20,
    include: {
      createdBy: {
        select: {
          username: true,
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return topics;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const session = await auth();
  const language = searchParams.lang;
  const topics = await getTopics("new", language);

  const languageNames: Record<string, string> = {
    pt: "🇵🇹 Português",
    en: "🇬🇧 English",
    es: "🇪🇸 Español",
    fr: "🇫🇷 Français",
    de: "🇩🇪 Deutsch",
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Plataforma de <span className="text-primary">Discussão</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Participe de discussões inteligentes sobre tecnologia, sociedade e
            cultura. Compartilhe ideias, aprenda e conecte-se com respeito.
          </p>
          {!session?.user && (
            <div className="mt-6">
              <Link href="/auth/register">
                <Button size="lg">Começar Agora</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Topics List */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tópicos Recentes</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Popular
            </Button>
            <Button variant="ghost" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Novos
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/t/${topic.slug}`}
              className="block rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{topic.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {topic.description}
                  </p>
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
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>por @{topic.createdBy.username}</span>
                    <span>•</span>
                    <span>
                      {new Date(topic.createdAt).toLocaleDateString("pt-BR")}
                    </span>
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

        {topics.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum tema encontrado. Seja o primeiro a criar um!
            </p>
          </div>
        )}

        {/* Advertisement - At the bottom of content */}
        <AdContainer />
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Thebate - Plataforma de discussões públicas</p>
        </div>
      </footer>
    </div>
  );
}
