"use client";

import { useTranslations } from "@/lib/use-translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Achievement = {
  id: string;
  achievement: {
    key: string;
    name: Record<string, string>;
    description: Record<string, string>;
    icon: string;
    tier: string;
  };
  unlockedAt: string;
};

type AchievementsDisplayProps = {
  achievements: Achievement[];
  karma: number;
};

const tierColors = {
  BRONZE: "bg-amber-700 text-white",
  SILVER: "bg-gray-400 text-gray-900",
  GOLD: "bg-yellow-500 text-gray-900",
  PLATINUM: "bg-purple-600 text-white",
};

export function AchievementsDisplay({ achievements, karma }: AchievementsDisplayProps) {
  const { t, locale } = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("achievements")}</span>
          <Badge variant="outline" className="text-lg font-bold">
            ⚡ {karma} {t("karma")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">{t("no_achievements_yet")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {achievements.map((userAchievement) => {
              const achievement = userAchievement.achievement;
              const tierColor =
                tierColors[achievement.tier as keyof typeof tierColors] || tierColors.BRONZE;

              return (
                <div
                  key={userAchievement.id}
                  className="relative rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div>
                      <h3 className="font-semibold">
                        {achievement.name[locale] || achievement.name.en}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description[locale] || achievement.description.en}
                      </p>
                    </div>
                    <Badge className={tierColor}>{achievement.tier}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
