export default function PresetDetailLoading() {
  return (
    <div className="min-h-screen bg-surface-dim animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="h-4 w-48 bg-foreground/10 rounded mb-8" />
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-64 aspect-square rounded-2xl bg-foreground/10" />
          <div className="flex-1 space-y-4">
            <div className="h-4 w-24 bg-foreground/10 rounded" />
            <div className="h-8 w-64 bg-foreground/10 rounded" />
            <div className="h-4 w-48 bg-foreground/10 rounded" />
            <div className="h-20 w-full bg-foreground/10 rounded" />
            <div className="h-12 w-40 bg-foreground/10 rounded" />
          </div>
        </div>
        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-foreground/[0.02] border border-border">
              <div className="h-3 w-16 bg-foreground/10 rounded mb-2" />
              <div className="h-8 w-20 bg-foreground/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
