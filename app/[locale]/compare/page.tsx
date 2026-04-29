"use client";

import { useTranslations } from "next-intl";
import { GitCompareArrows } from "lucide-react";
import { ABTestMode } from "@/components/ab-test-mode";

export default function ComparePage() {
  const t = useTranslations("compare");

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <GitCompareArrows className="h-12 w-12 text-primary mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold font-display text-foreground mb-3">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* A/B Test Component */}
        <div className="animate-fade-in">
          <ABTestMode />
        </div>
      </div>
    </div>
  );
}
