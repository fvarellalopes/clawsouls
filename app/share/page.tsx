import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SoulPreview } from "@/components/soul-preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ShareActions } from "@/components/share-actions";

interface SharePageProps {
  searchParams: Promise<{ data?: string }>;
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
  const params = await searchParams;
  const soul = params.data ? loadSoulFromData(params.data) : null;

  if (!soul) {
    return {
      title: "ClawSouls — Personality Not Found",
      description: "The requested personality could not be loaded.",
    };
  }

  return {
    title: `${soul.name} — ClawSouls`,
    description: soul.vibe || `Check out ${soul.name}'s personality on ClawSouls.`,
    openGraph: {
      title: `${soul.name} — ClawSouls`,
      description: soul.vibe || `Personality profile: ${soul.creature}`,
      url: `https://clawsouls.hub/share?data=${params.data}`,
      siteName: "ClawSouls",
      type: "website",
      images: soul.avatar
        ? [{ url: soul.avatar, alt: soul.name }]
        : [{ url: "https://clawsouls.hub/og-default.png", alt: "ClawSouls" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${soul.name} — ClawSouls`,
      description: soul.vibe || `Personality profile: ${soul.creature}`,
      images: soul.avatar ? [soul.avatar] : ["https://clawsouls.hub/og-default.png"],
    },
  };
}

export default async function SharePage({ searchParams }: SharePageProps) {
  const params = await searchParams;
  const dataParam = params.data || "";
  const soul = dataParam ? loadSoulFromData(dataParam) : null;

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

        <ShareActions dataParam={dataParam} />

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
