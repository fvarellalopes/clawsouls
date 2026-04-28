"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GitCompareArrows } from "lucide-react";
import { ABTestMode } from "@/components/ab-test-mode";

export default function ComparePage() {
  const t = useTranslations("compare");

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <GitCompareArrows className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gradient font-display tracking-wider mb-3">
            {t("title")}
          </h1>
          <p className="text-purple-200/50 text-lg max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* A/B Test Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ABTestMode />
        </motion.div>
      </div>
    </div>
  );
}
