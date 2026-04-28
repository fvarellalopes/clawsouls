"use client";

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
import { decompressSoul } from "@/lib/compress";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import enMessages from "@/messages/en.json";

function loadSoulFromData(data: string): Record<string, any> | null {
  return null;
}

function loadSoulFromBase64(data: string): Record<string, any> | null {
  try {
    const decoded = atob(data);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function SharePageContent() {
  const t = useTranslations("share");
  const searchParams = useSearchParams();
  const dataParam = searchParams?.get("data") || "";
  const [soul, setSoul] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataParam) {
      const loadedSoul = loadSoulFromBase64(dataParam);
      setSoul(loadedSoul);
    }
    setLoading(false);
  }, [dataParam]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="animate-pulse text-purple-300/50">{t("loading")}</div>
      </div>
    );
  }

  if (!soul) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("personalityNotFound")}</h1>
          <p className="text-purple-300/50 mb-6">{t("shareLinkExpired")}</p>
          <Button asChild>
            <Link href="/">{t("backToHome")}</Link>
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
              {t("backToHome")}
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {soul.avatar && typeof soul.avatar === "string" && (
              <img
                src={soul.avatar}
                alt={typeof soul.name === "string" ? soul.name : "Avatar"}
                className="w-24 h-24 rounded-full border-4 border-accent"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{typeof soul.name === "string" ? soul.name : "Unknown"}</h1>
              <p className="text-xl text-muted-foreground">{typeof soul.creature === "string" ? soul.creature : ""}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{typeof soul.vibe === "string" ? soul.vibe : ""}</p>
        </div>

        <ShareActions dataParam={dataParam} />

        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
            <QrCode className="mr-2 h-5 w-5" />
            {t("scanToShare")}
          </h2>
          <div className="flex justify-center">
            <QRCodeDisplay url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://clawsouls.hub"}/share?data=${dataParam}`} name={typeof soul.name === "string" ? soul.name : ""} />
          </div>
        </div>

        <Suspense fallback={<div>{t("loadingPreview")}</div>}>
          <SoulPreview soul={soul as any} />
        </Suspense>

        <div className="mt-8 text-center">
          <Button asChild size="lg" className="bg-accent text-accent-foreground">
            <Link href="/editor">
              {t("createYourOwn")}
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{enMessages.share.loading}</div>}>
        <SharePageContent />
      </Suspense>
    </NextIntlClientProvider>
  );
}
