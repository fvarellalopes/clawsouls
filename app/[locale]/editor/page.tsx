"use client";

import { useState, useEffect } from "react";
import { SoulEditor } from "@/components/soul-editor";

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
      <div className="relative z-10">
        <SoulEditor locale={locale} messages={messages} />
      </div>
    </div>
  );
}
