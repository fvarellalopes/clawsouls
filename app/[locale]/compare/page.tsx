"use client";

import { useTranslations } from "next-intl";
import { GitCompareArrows } from "lucide-react";
import { ABTestMode } from "@/components/ab-test-mode";

export default function ComparePage() {
  const t = useTranslations("compare");

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10 animate-fade-up">
          <GitCompareArrows className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-fg font-display mb-3">{t("title")}</h1>
          <p className="text-muted-fg text-lg max-w-2xl mx-auto">{t("description")}</p>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <ABTestMode />
        </div>
      </div>
    </div>
  );
}
