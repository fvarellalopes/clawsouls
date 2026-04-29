"use client";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`bg-primary/10 rounded-lg animate-pulse-soft ${className || ""}`}
    />
  );
}

export function PresetCardSkeleton() {
  return (
    <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 left-0 w-8 h-[2px] bg-primary-container/30" />
      <div className="aspect-square bg-black/50 border-b border-white/5 flex items-center justify-center">
        <SkeletonPulse className="w-20 h-20 rounded" />
      </div>
      <div className="p-6 flex flex-col gap-4 flex-grow">
        <div className="flex flex-col gap-2">
          <SkeletonPulse className="h-3 w-16" />
          <SkeletonPulse className="h-6 w-32" />
        </div>
        <SkeletonPulse className="h-3 w-full" />
        <SkeletonPulse className="h-3 w-3/4" />
        <div className="flex gap-1.5">
          <SkeletonPulse className="h-5 w-16 rounded-full" />
          <SkeletonPulse className="h-5 w-20 rounded-full" />
        </div>
        <SkeletonPulse className="h-10 w-full rounded mt-auto" />
      </div>
    </div>
  );
}

export function PresetsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
