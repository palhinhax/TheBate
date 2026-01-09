"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";

type NextTopicNavigationProps = {
  currentSlug: string;
};

type NextTopic = {
  slug: string;
  title: string;
};

export default function NextTopicNavigation({
  currentSlug,
}: NextTopicNavigationProps) {
  const { t, isLoading: translationsLoading } = useTranslations();
  const router = useRouter();
  const [nextTopic, setNextTopic] = useState<NextTopic | null | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNextTopic() {
      try {
        const response = await fetch(`/api/topics/${currentSlug}/next`);
        if (response.ok) {
          const data = await response.json();
          setNextTopic(data.nextTopic);
        } else {
          setNextTopic(null);
        }
      } catch (error) {
        console.error("Error fetching next topic:", error);
        setNextTopic(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNextTopic();
  }, [currentSlug]);

  // Don't render anything while loading translations or fetching
  if (translationsLoading || isLoading) {
    return (
      <div className="mt-8 border-t pt-8">
        <p className="text-center text-sm text-muted-foreground">
          {t("topics.next_topic_loading", "Loading next topic...")}
        </p>
      </div>
    );
  }

  // Don't render if no next topic available
  if (!nextTopic) {
    return null;
  }

  const handleNavigation = () => {
    router.push(`/t/${nextTopic.slug}`);
  };

  return (
    <div className="mt-8 border-t pt-8">
      <div className="rounded-lg border bg-card p-6 transition-all hover:shadow-md">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          {t("topics.next_topic", "Next topic")}
        </p>
        <Link
          href={`/t/${nextTopic.slug}`}
          className="group block"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation();
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold group-hover:text-primary">
              {nextTopic.title}
            </h3>
            <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </Link>
        <div className="mt-4">
          <Button
            onClick={handleNavigation}
            className="w-full sm:w-auto"
            size="sm"
          >
            {t("topics.next_topic", "Next topic")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
