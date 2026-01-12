import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditTopicImage from "@/features/topics/components/edit-topic-image";

type Props = {
  params: { slug: string };
};

async function getTopicData(slug: string, userId: string) {
  const topic = await prisma.topic.findUnique({
    where: { slug },
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

  if (!topic) return null;

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isOwner: true },
  });

  // Check if user can edit
  const isCreator = topic.createdById === userId;
  const isAdmin = user?.role === "ADMIN";
  const isOwner = user?.isOwner === true;

  const canEdit = isCreator || isAdmin || isOwner;

  return { topic, canEdit };
}

export default async function EditTopicPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/auth/signin?callbackUrl=/t/${params.slug}/edit`);
  }

  const data = await getTopicData(params.slug, session.user.id);

  if (!data) {
    notFound();
  }

  const { topic, canEdit } = data;

  if (!canEdit) {
    redirect(`/t/${params.slug}`);
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href={`/t/${params.slug}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao tema
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{topic.title}</h1>
        <p className="text-muted-foreground">Editar imagem do tema</p>
      </div>

      <EditTopicImage topicSlug={topic.slug} currentImageUrl={topic.imageUrl} />
    </div>
  );
}
