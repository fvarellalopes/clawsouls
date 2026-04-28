"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { achievements, useAchievementsStore } from "@/store/achievementsStore";
import { Trophy, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AchievementsPage() {
  const { unlockedIds, stats } = useAchievementsStore();

  const unlockedCount = unlockedIds.length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Trophy className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gradient font-display tracking-wider mb-3">
            Achievements
          </h1>
          <p className="text-purple-200/50 text-lg mb-4">
            {unlockedCount} of {totalCount} unlocked ({percentage}%)
          </p>
          <div className="max-w-xs mx-auto h-2 rounded-full bg-purple-500/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Exports", value: stats.totalExports, emoji: "📄" },
            { label: "Shares", value: stats.totalShares, emoji: "🔗" },
            { label: "Quizzes", value: stats.quizzesTaken, emoji: "🧠" },
            { label: "Languages", value: stats.languagesUsed.length, emoji: "🌍" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#140d24]/60 border-purple-500/15">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="text-2xl font-bold text-purple-100">{stat.value}</div>
                  <div className="text-xs text-purple-300/50">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, i) => {
            const isUnlocked = unlockedIds.includes(achievement.id);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`overflow-hidden transition-all duration-300 ${
                    isUnlocked
                      ? "bg-[#140d24]/80 border-amber-500/30 ring-1 ring-amber-500/10"
                      : "bg-[#140d24]/40 border-purple-500/10 opacity-60"
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">
                        {isUnlocked ? achievement.emoji : "🔒"}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold font-display tracking-wide ${
                          isUnlocked ? "text-amber-300" : "text-purple-300/40"
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          isUnlocked ? "text-purple-200/60" : "text-purple-300/30"
                        }`}>
                          {achievement.description}
                        </p>
                        {isUnlocked && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs"
                          >
                            <Sparkles className="h-3 w-3" />
                            Unlocked
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-purple-500/20">
            <Link href="/editor">
              <Sparkles className="mr-2 h-4 w-4" />
              Keep Creating
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
