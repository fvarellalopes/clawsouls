"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/error-boundary";

const ThreeBackground = dynamic(
  () => import("@/components/three-background").then((mod) => mod.ThreeBackground),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0514]" />
    ),
  }
);

export function ThreeBackgroundLazy() {
  return (
    <ErrorBoundary fallback={<div className="fixed inset-0 z-0 bg-[#0a0514]" />}>
      <ThreeBackground />
    </ErrorBoundary>
  );
}
