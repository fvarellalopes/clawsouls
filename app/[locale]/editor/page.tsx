"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SoulEditor } from "@/components/soul-editor";
import { useSoulStore } from "@/store/soulStore";

function EditorContent() {
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

  return <SoulEditor locale="en" messages={{}} />;
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
