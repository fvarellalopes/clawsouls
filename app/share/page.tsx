"use client";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SoulPreview } from "@/components/soul-preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, QrCode } from "lucide-react";
import { ShareActions } from "@/components/share-actions";
import { QRCodeDisplay } from "@/components/qrcode-display";
import { useEffect, useState } from "react";

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

function SharePageContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams?.get("data") || "";
  const [soul, setSoul] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataParam) {
      const loadedSoul = loadSoulFromData(dataParam);
      setSoul(loadedSoul);
    }
    setLoading(false);
  }, [dataParam]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!soul) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Personality Not Found</h1>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
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

        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
            <QrCode className="mr-2 h-5 w-5" />
            Scan to Share
          </h2>
          <div className="flex justify-center">
            <QRCodeDisplay url={`https://clawsouls.hub/share?data=${dataParam}`} name={soul.name} />
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

export default function SharePage({ searchParams }: SharePageProps) {
  // For static export, we need to handle this differently
  // Wrapping in Suspense for client-side params
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SharePageContent />
    </Suspense>
  );
}
