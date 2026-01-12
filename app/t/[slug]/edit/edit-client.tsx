"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditTopicImage from "@/features/topics/components/edit-topic-image";
import { useTranslations } from "@/lib/use-translations";

type Topic = {
  slug: string;
  title: string;
  imageUrl: string | null;
};

type EditTopicPageClientProps = {
  topic: Topic;
};

export default function EditTopicPageClient({ topic }: EditTopicPageClientProps) {
  const { t } = useTranslations();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href={`/t/${topic.slug}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("topics.back_to_topic", "Back to topic")}
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{topic.title}</h1>
        <p className="text-muted-foreground">{t("topics.edit_topic_image", "Edit topic image")}</p>
      </div>

      <EditTopicImage topicSlug={topic.slug} currentImageUrl={topic.imageUrl} />
    </div>
  );
}
