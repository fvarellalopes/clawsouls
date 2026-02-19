"use client";

import { Suspense, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { SoulEditor } from "@/components/soul-editor";
import { useSoulStore } from "@/store/soulStore";

interface EditorPageProps {
  params: Promise<{ locale: string }>;
}

function EditorContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const { setSoul } = useSoulStore();

  useEffect(() => {
    const data = searchParams?.get("data");
    if (data) {
      try {
        const decoded = atob(data);
        const soul = JSON.parse(decoded);
        setSoul(soul);
      } catch (e) {
        console.error("Failed to load shared soul:", e);
      }
    }
  }, [searchParams, setSoul]);

  return <SoulEditor locale={locale} messages={{}} />;
}

export default function EditorPage({ params }: EditorPageProps) {
  const { locale } = use(params);
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-purple-400">Loading editor...</div>
        </div>
      </div>
    }>
      <EditorContent locale={locale} />
    </Suspense>
  );
}
