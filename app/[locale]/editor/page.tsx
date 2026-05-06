"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { SoulEditor } from "@/components/soul-editor";

interface EditorPageProps {
  params: Promise<{ locale: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const [locale, setLocale] = useState("en");
  const { messages } = useTranslations();

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  return (
    <div className="min-h-screen relative" style={{ background: "#09090b" }}>
      <div className="relative z-10">
        <SoulEditor locale={locale} messages={messages} />
      </div>
    </div>
  );
}
