import { PresetsGridSkeleton } from "@/components/skeletons";

export default function PresetsLoading() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="h-10 w-64 mx-auto mb-3 rounded-lg animate-pulse bg-primary/10" />
          <div className="h-5 w-96 mx-auto rounded-lg animate-pulse bg-primary/10" />
        </div>
        <div className="max-w-md mx-auto mb-6">
          <div className="h-12 w-full rounded-xl animate-pulse bg-primary/10" />
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full animate-pulse bg-primary/10" />
          ))}
        </div>
        <PresetsGridSkeleton count={9} />
      </div>
    </div>
  );
}
