"use client";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={`bg-primary/10 rounded-lg animate-pulse-soft ${className || ""}`} />
  );
}

export function PresetCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden ring-1 ring-border bg-surface p-5">
      <div className="flex items-center gap-3 mb-3">
        <SkeletonPulse className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <SkeletonPulse className="h-5 w-24 mb-1.5" />
          <SkeletonPulse className="h-3 w-32" />
        </div>
      </div>
      <SkeletonPulse className="h-3 w-full mb-1.5" />
      <SkeletonPulse className="h-3 w-3/4 mb-3" />
      <div className="flex gap-1.5">
        <SkeletonPulse className="h-5 w-16 rounded-full" />
        <SkeletonPulse className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function PresetsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PresetCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <SkeletonPulse className="h-8 w-32" />
          <div className="flex gap-2">
            <SkeletonPulse className="h-8 w-24" />
            <SkeletonPulse className="h-8 w-24" />
            <SkeletonPulse className="h-8 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <SkeletonPulse className="h-10 w-full rounded-xl" />
            <SkeletonPulse className="h-64 w-full rounded-xl" />
            <SkeletonPulse className="h-48 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-2">
            <SkeletonPulse className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <SkeletonPulse className="h-10 w-64 mb-4" />
        <SkeletonPulse className="h-5 w-96 mb-8" />
        <div className="space-y-4">
          <SkeletonPulse className="h-32 w-full rounded-xl" />
          <SkeletonPulse className="h-32 w-full rounded-xl" />
          <SkeletonPulse className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
