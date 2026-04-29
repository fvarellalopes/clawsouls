"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { achievements, useAchievementsStore } from "@/store/achievementsStore";
import { Trophy, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AchievementsPage() {
  const t = useTranslations("achievements");
  const { unlockedIds, stats } = useAchievementsStore();

  const unlockedCount = unlockedIds.length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-fade-up">
          <Trophy className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-fg font-display mb-3">{t("title")}</h1>
          <p className="text-muted-fg text-lg mb-4">
            {t("unlockedSummary", { unlockedCount, totalCount, percentage })}
          </p>
          <div className="max-w-xs mx-auto h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: t("exports"), value: stats.totalExports, emoji: "📄" },
            { label: t("shares"), value: stats.totalShares, emoji: "🔗" },
            { label: t("quizzes"), value: stats.quizzesTaken, emoji: "🧠" },
            { label: t("languages"), value: stats.languagesUsed.length, emoji: "🌍" },
          ].map((stat, i) => (
            <div key={stat.label} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <Card className="bg-surface border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="text-2xl font-bold text-fg">{stat.value}</div>
                  <div className="text-xs text-muted-fg">{stat.label}</div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, i) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div key={achievement.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <Card className={`overflow-hidden transition-all duration-200 ${
                  isUnlocked ? "bg-surface border-accent/30 ring-1 ring-accent/10" : "bg-surface/40 border-border opacity-60"
                }`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{isUnlocked ? achievement.emoji : "🔒"}</div>
                      <div className="flex-1">
                        <h3 className={`font-bold font-display ${isUnlocked ? "text-accent" : "text-muted-fg"}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm mt-1 ${isUnlocked ? "text-muted-fg" : "text-muted-fg/50"}`}>
                          {achievement.description}
                        </p>
                        {isUnlocked && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-xs">
                            <Sparkles className="h-3 w-3" />
                            {t("unlocked")}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-border">
            <Link href="/editor">
              <Sparkles className="mr-2 h-4 w-4" />
              {t("keepCreating")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
