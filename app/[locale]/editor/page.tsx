"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SoulEditor } from "@/components/soul-editor";
import { ThreeBackground } from "@/components/three-background";

interface EditorPageProps {
  params: Promise<{ locale: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const [locale, setLocale] = useState("en");
  const messages = {};

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      <div className="relative z-10">
        <SoulEditor locale={locale} messages={messages} />
      </div>
    </div>
  );
}
