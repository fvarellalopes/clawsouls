import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SoulPreview } from "@/components/soul-preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";

interface SharePageProps {
  searchParams: { data?: string };
}

function loadSoulFromData(data: string) {
  try {
    const decoded = atob(data);
    const soul = JSON.parse(decoded);
    return soul;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  searchParams,
}: SharePageProps): Promise<Metadata> {
  const soul = searchParams.data ? loadSoulFromData(searchParams.data) : null;

  if (!soul) {
    return {
      title: "ClawSouls — Personality Not Found",
      description: "The requested personality could not be loaded.",
    };
  }

  return {
    title: `${soul.name} — ClawSouls`,
    description: soul.vibe || `Check out ${soul.name}'s personality on ClawSouls. ${soul.creature}. ${soul.vibe}`,
    openGraph: {
      title: `${soul.name} — ClawSouls`,
      description: soul.vibe || `Personality profile: ${soul.creature}`,
      url: `https://clawsouls.hub/share?data=${searchParams.data}`,
      siteName: "ClawSouls",
      type: "website",
      images: soul.avatar
        ? [
            {
              url: soul.avatar,
              alt: soul.name,
              type: "image/svg+xml",
            },
          ]
        : [
            {
              url: "https://clawsouls.hub/og-default.png",
              alt: "ClawSouls",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${soul.name} — ClawSouls`,
      description: soul.vibe || `Personality profile: ${soul.creature}`,
      images: soul.avatar ? [soul.avatar] : ["https://clawsouls.hub/og-default.png"],
    },
  };
}

export default function SharePage({ searchParams }: SharePageProps) {
  const soul = searchParams.data ? loadSoulFromData(searchParams.data) : null;

  if (!soul) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {soul.avatar && (
              <img
                src={soul.avatar}
                alt={soul.name}
                className="w-24 h-24 rounded-full border-4 border-accent"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{soul.name}</h1>
              <p className="text-xl text-muted-foreground">{soul.creature}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{soul.vibe}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h2 className="text-2xl font-semibold mb-4">Copy Share Link</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Anyone with this link can load this personality into ClawSouls.
            </p>
            <div className="flex space-x-2">
              <input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}${typeof window !== "undefined" ? window.location.pathname : ""}?data=${searchParams.data}`}
                className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${typeof window !== "undefined" ? window.location.origin : ""}${typeof window !== "undefined" ? window.location.pathname : ""}?data=${searchParams.data}`
                  );
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <h2 className="text-2xl font-semibold mb-4">Load in ClawSouls</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Want to edit this personality? Click below to open it in the editor.
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/editor?data=${searchParams.data}`}>
                Open in Editor
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Suspense fallback={<div>Loading preview...</div>}>
          <SoulPreview soul={soul} />
        </Suspense>

        <div className="mt-8 text-center">
          <Button asChild size="lg" className="bg-accent text-accent-foreground">
            <Link href="/editor">
              Create Your Own
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
