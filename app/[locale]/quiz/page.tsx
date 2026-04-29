"use client";

import { useState, useMemo } from "react";
import { useTranslations, useMessages } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quizQuestions, scorePresets } from "@/lib/quiz";
import { usePresets } from "@/lib/usePresets";
import { SoulPreset } from "@/store/soulStore";
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, Trophy } from "lucide-react";
import { useAchievementsStore } from "@/store/achievementsStore";
import Link from "next/link";

type Phase = "intro" | "quiz" | "results";

export default function QuizPage() {
  const t = useTranslations("quiz");
  const router = useRouter();
  const messages = useMessages();
  const presetsMessages = (messages as any)?.presets as Record<string, Record<string, string>> | undefined;
  const { presets } = usePresets(presetsMessages);
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

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-lg animate-fade-up">
          <div className="text-7xl mb-8">🧠</div>
          <h1 className="text-4xl md:text-5xl font-bold text-fg font-display mb-4">
            {t("personalityQuiz")}
          </h1>
          <p className="text-muted-fg text-lg mb-8 leading-relaxed">
            {t("quizIntro", { count: quizQuestions.length })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setPhase("quiz")} className="bg-primary text-primary-fg px-8 py-6 text-lg rounded-xl">
              <Sparkles className="mr-2 h-5 w-5" />
              {t("start")}
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border px-8 py-6 text-lg rounded-xl">
              <Link href="/presets">
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t("browseAll")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    const question = quizQuestions[currentQuestion];
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-fg mb-2">
              <span>{t("questionProgress", { current: currentQuestion + 1, total: quizQuestions.length })}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-400" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div key={currentQuestion} className="animate-fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-fg font-display mb-8 leading-tight">
              {question.question}
            </h2>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                    selectedOption === idx
                      ? "border-primary/60 bg-primary/10 text-fg"
                      : "border-border bg-surface text-muted-fg hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedOption === idx ? "border-primary" : "border-border"
                    }`}>
                      {selectedOption === idx && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <span className="text-base">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={handleBack} disabled={currentQuestion === 0} className="text-muted-fg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back")}
            </Button>
            <Button onClick={handleNext} disabled={selectedOption === null} className="bg-primary text-primary-fg px-8">
              {currentQuestion === quizQuestions.length - 1 ? t("seeResults") : t("next")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-fade-up">
          <Trophy className="h-16 w-16 text-accent mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-fg font-display mb-4">{t("yourMatches")}</h1>
          <p className="text-muted-fg text-lg">{t("matchesDesc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {results.map((result, i) => (
            <div key={result.preset.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <Card className="bg-surface border-border overflow-hidden">
                <div className="p-4 text-center">
                  {i === 0 && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold mb-3">
                      🏆 {t("bestMatch")}
                    </div>
                  )}
                  <div className="text-5xl mb-3">{result.preset.emoji}</div>
                  <h3 className="text-xl font-bold text-fg font-display">{result.preset.name}</h3>
                  <p className="text-sm text-muted-fg mb-2">{result.preset.creature}</p>
                  <div className="text-3xl font-bold text-accent mb-4">{result.matchPercentage}%</div>
                  <p className="text-sm text-muted-fg line-clamp-3 mb-4">{result.preset.description}</p>
                  <Button onClick={() => handleLoadPreset(result.preset)} className="w-full bg-primary text-primary-fg">
                    {t("useThis")}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={handleRestart} className="border-border">
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("retake")}
          </Button>
        </div>
      </div>
    </div>
  );
}
