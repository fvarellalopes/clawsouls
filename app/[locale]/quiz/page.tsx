"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quizQuestions, scorePresets } from "@/lib/quiz";
import { usePresets } from "@/lib/usePresets";
import { PresetCard } from "@/components/preset-card";
import { SoulPreset } from "@/store/soulStore";
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, Trophy } from "lucide-react";
import { useAchievementsStore } from "@/store/achievementsStore";
import Link from "next/link";

type Phase = "intro" | "quiz" | "results";

export default function QuizPage() {
  const t = useTranslations("quiz");
  const router = useRouter();
  const { presets } = usePresets();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { incrementQuiz } = useAchievementsStore();

  const results = useMemo(() => {
    if (Object.keys(answers).length < quizQuestions.length) return [];
    return scorePresets(presets, answers).slice(0, 3);
  }, [answers, presets]);

  const progress = (Object.keys(answers).length / quizQuestions.length) * 100;

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const question = quizQuestions[currentQuestion];
    setAnswers((prev) => ({ ...prev, [question.id]: selectedOption }));

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setPhase("results");
      incrementQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      const prevQuestion = quizQuestions[currentQuestion - 1];
      setSelectedOption(answers[prevQuestion.id] ?? null);
    }
  };

  const handleRestart = () => {
    setPhase("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
  };

  const handleLoadPreset = (preset: SoulPreset) => {
    window.dispatchEvent(new CustomEvent("load-soul-preset", { detail: preset }));
    router.push("/editor");
  };

  // ─── INTRO ───
  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-7xl mb-8"
          >
            🧠
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient font-display tracking-wider mb-4">
            {t("personalityQuiz")}
          </h1>
          <p className="text-purple-200/60 text-lg mb-8 leading-relaxed">
            {t("quizIntro", { count: quizQuestions.length })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setPhase("quiz")}
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-8 py-6 text-lg rounded-2xl"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {t("start")}
            </Button>
            <Button asChild size="lg" variant="outline" className="border-purple-500/20 px-8 py-6 text-lg rounded-2xl">
              <Link href="/presets">
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t("browseAll")}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── QUIZ ───
  if (phase === "quiz") {
    const question = quizQuestions[currentQuestion];

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-purple-300/50 mb-2">
              <span>{t("questionProgress", { current: currentQuestion + 1, total: quizQuestions.length })}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-purple-500/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-amber-400"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-purple-100 font-display mb-8 leading-tight">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
                      selectedOption === idx
                        ? "border-purple-400/60 bg-purple-500/15 text-purple-100"
                        : "border-purple-500/15 bg-[#140d24]/60 text-purple-200/70 hover:border-purple-400/30 hover:bg-[#140d24]/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedOption === idx ? "border-purple-400" : "border-purple-500/30"
                        }`}
                      >
                        {selectedOption === idx && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2.5 h-2.5 rounded-full bg-purple-400"
                          />
                        )}
                      </div>
                      <span className="text-base">{option.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="text-purple-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back")}
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="bg-purple-600 text-white px-8"
            >
              {currentQuestion === quizQuestions.length - 1 ? t("seeResults") : t("next")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS ───
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Trophy className="h-16 w-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gradient font-display tracking-wider mb-4">
            {t("yourMatches")}
          </h1>
          <p className="text-purple-200/60 text-lg">
            {t("matchesDesc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {results.map((result, i) => (
            <motion.div
              key={result.preset.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="bg-[#140d24]/60 border-purple-500/15 overflow-hidden">
                <div className="p-4 text-center">
                  {i === 0 && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3">
                      🏆 {t("bestMatch")}
                    </div>
                  )}
                  <div className="text-5xl mb-3">{result.preset.emoji}</div>
                  <h3 className="text-xl font-bold text-purple-100 font-display">{result.preset.name}</h3>
                  <p className="text-sm text-purple-300/50 mb-2">{result.preset.creature}</p>
                  <div className="text-3xl font-bold text-amber-400 mb-4">
                    {result.matchPercentage}%
                  </div>
                  <p className="text-sm text-purple-200/50 line-clamp-3 mb-4">
                    {result.preset.description}
                  </p>
                  <Button
                    onClick={() => handleLoadPreset(result.preset)}
                    className="w-full bg-purple-600 text-white"
                  >
                    {t("useThis")}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={handleRestart} className="border-purple-500/20">
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("retake")}
          </Button>
        </div>
      </div>
    </div>
  );
}
