import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditTopicPageClient from "./edit-client";

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

  return <EditTopicPageClient topic={topic} />;
}
