"use client";

import { use } from "react";
import { SoulEditor } from "@/components/soul-editor";

interface EditorPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ preset?: string }>;
}

export default function EditorPage({ params, searchParams }: EditorPageProps) {
  const { locale } = use(params);
  const sp = use(searchParams);
  const presetSlug = sp?.preset;

  return (
    <div className="min-h-screen relative" style={{ background: "#09090b" }}>
      <div className="relative z-10">
        <SoulEditor locale={locale} messages={{}} initialPresetSlug={presetSlug} />
      </div>
    </div>
  );
}
