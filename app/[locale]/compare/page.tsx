"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { ABTestMode } from "@/components/ab-test-mode";

export default function ComparePage() {
  const t = useTranslations("compare");

  return (
    <div className="min-h-screen bg-surface-dim">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 flex flex-col gap-10">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="flex flex-col gap-2">
            <span className="font-display text-yellow-400 uppercase tracking-widest">
              {t("title")}
            </span>
            <h1 className="font-display text-yellow-400 text-3xl">
              {t("title")}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
              {t("description")}
            </p>
          </div>
          <Link
            href="/"
            className="font-label-caps text-label-caps text-white/40 hover:text-primary-container transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            {t("backToHome")}
          </Link>
        </section>

        {/* AB Test Component */}
        <div className="animate-fade-in">
          <ABTestMode />
        </div>
      </div>
    </div>
  );
}
