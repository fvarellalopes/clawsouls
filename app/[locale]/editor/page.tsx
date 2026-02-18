"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SoulEditor } from "@/components/soul-editor";
import { useSoulStore } from "@/store/soulStore";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const { loadPreset, setSoul } = useSoulStore();

  useEffect(() => {
    const data = searchParams.get("data");
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
