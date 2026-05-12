"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { SoulEditor } from "@/components/soul-editor";

interface EditorPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ preset?: string }>;
}

export default function EditorPage({ params, searchParams }: EditorPageProps) {
  const [locale, setLocale] = useState("en");
  const [presetSlug, setPresetSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
    searchParams.then((sp) => {
      if (sp.preset) setPresetSlug(sp.preset);
    });
  }, [params, searchParams]);

  return (
    <div className="min-h-screen relative" style={{ background: "#09090b" }}>
      <div className="relative z-10">
        <SoulEditor locale={locale} messages={{}} initialPresetSlug={presetSlug} />
      </div>
    </div>
  );
}
