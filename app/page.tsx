import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { MessageSquare, TrendingUp, Clock, Search } from "lucide-react";
import { AdContainer } from "@/components/ad-container";
import { getUserLanguages } from "@/lib/language";
import { SearchBar } from "@/components/search-bar";

async function getTopics(
  sort: "trending" | "new" = "new",
  languages: string[],
  searchQuery?: string
) {
  const orderBy = sort === "new" ? { createdAt: "desc" as const } : { createdAt: "desc" as const }; // TODO: implement real trending algorithm

  const whereClause = {
    status: "ACTIVE" as const,
    language: { in: languages },
    ...(searchQuery && searchQuery.trim()
      ? {
          OR: [
            {
              title: {
                contains: searchQuery.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: searchQuery.trim(),
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const topics = await prisma.topic.findMany({
    where: whereClause,
    orderBy,
    take: 30,
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
  searchParams: { lang?: string; q?: string };
}) {
  const session = await auth();

  // Intelligently detect user's languages
  const userLanguages = await getUserLanguages(searchParams);
  const searchQuery = searchParams.q;
  const topics = await getTopics("new", userLanguages, searchQuery);

  const baseUrl = process.env.NEXTAUTH_URL || "https://thebatee.com";

  // JSON-LD structured data for homepage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TheBatee",
    url: baseUrl,
    description:
      "Global discussion platform for intelligent debates about technology, society, and culture in multiple languages.",
    inLanguage: ["pt", "en", "es", "fr", "de"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: baseUrl + "?lang={language}",
      },
      "query-input": "required name=language",
    },
    publisher: {
      "@type": "Organization",
      name: "TheBatee",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: baseUrl + "/logo_no_bg.png",
      },
    },
  };

  // BreadcrumbList for better SEO
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <div className="min-h-screen">
        {/* Hero Section - Only show for non-logged-in users */}
        {!session?.user && (
          <section className="border-b bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Plataforma de <span className="text-primary">Discussão</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Participe de discussões inteligentes sobre tecnologia, sociedade e cultura.
                Compartilhe ideias, aprenda e conecte-se com respeito.
              </p>
              <div className="mt-6">
                <Link href="/auth/register">
                  <Button size="lg">Começar Agora</Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Topics List */}
        <section className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
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
            <SearchBar initialQuery={searchQuery} />
          </div>

          <div className="space-y-4">
            {topics.length === 0 ? (
              <div className="rounded-lg border bg-card p-12 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  {searchQuery ? "Nenhum tópico encontrado" : "Ainda não há tópicos"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery
                    ? `Não encontramos resultados para "${searchQuery}". Tente pesquisar com outras palavras.`
                    : "Seja o primeiro a criar um tópico interessante!"}
                </p>
                {!searchQuery && session?.user && (
                  <Link href="/new" className="mt-4 inline-block">
                    <Button>Criar Tópico</Button>
                  </Link>
                )}
              </div>
            ) : (
              topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/t/${topic.slug}`}
                  className="block rounded-lg border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Topic Image Thumbnail */}
                    {topic.imageUrl && (
                      <div className="sm:w-48 sm:flex-shrink-0">
                        <img
                          src={topic.imageUrl}
                          alt={topic.title}
                          className="h-48 w-full rounded-t-lg object-cover sm:h-full sm:rounded-l-lg sm:rounded-tr-none"
                        />
                      </div>
                    )}
                    
                    {/* Topic Content */}
                    <div className="flex flex-1 items-start justify-between p-6">
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
                          <span>{new Date(topic.createdAt).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-center">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <span className="mt-1 text-sm font-medium">{topic._count.comments}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Advertisement - At the bottom of content */}
          <AdContainer />
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>TheBatee - Plataforma de discussões públicas</p>
          </div>
        </footer>
      </div>
    </>
  );
}
