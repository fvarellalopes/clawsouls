"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SoulPreview } from "@/components/soul-preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, QrCode, Loader2 } from "lucide-react";
import { avatarUrl } from "@/lib/avatar";
import { QRCodeDisplay } from "@/components/qrcode-display";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import enMessages from "@/messages/en.json";
import ptMessages from "@/messages/pt.json";
import esMessages from "@/messages/es.json";
import jaMessages from "@/messages/ja.json";
import frMessages from "@/messages/fr.json";
import deMessages from "@/messages/de.json";
import zhMessages from "@/messages/zh.json";

const localeMessages: Record<string, AbstractIntlMessages> = {
  en: enMessages as unknown as AbstractIntlMessages,
  pt: ptMessages as unknown as AbstractIntlMessages,
  es: esMessages as unknown as AbstractIntlMessages,
  ja: jaMessages as unknown as AbstractIntlMessages,
  fr: frMessages as unknown as AbstractIntlMessages,
  de: deMessages as unknown as AbstractIntlMessages,
  zh: zhMessages as unknown as AbstractIntlMessages,
};

function detectLocale(): string {
  if (typeof window === "undefined") return "en";
  const lang = navigator.language?.split("-")[0];
  return localeMessages[lang] ? lang : "en";
}

function ShareByIdContent() {
  const t = useTranslations("share");
  const params = useParams();
  const id = params?.id as string;
  const [soul, setSoul] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/share?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Share not found");
        return res.json();
      })
      .then((data) => setSoul(data.soul))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-subtle-fg animate-spin" />
      </div>
    );
  }

  if (error || !soul) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("shareNotFound")}</h1>
          <p className="text-muted-fg mb-6">{t("linkExpired")}</p>
          <Button asChild>
            <Link href="/">{t("backToHome")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${id}`
    : `${process.env.NEXT_PUBLIC_SITE_URL || "https://clawsouls.hub"}/share/${id}`;

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
            <img
              src={avatarUrl(soul as any)}
              alt={typeof soul.name === "string" ? soul.name : "Avatar"}
              className="w-24 h-24 rounded-full border-4 border-accent object-cover"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">{typeof soul.name === "string" ? soul.name : "Unknown"}</h1>
              <p className="text-xl text-muted-foreground">{typeof soul.creature === "string" ? soul.creature : ""}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{typeof soul.vibe === "string" ? soul.vibe : ""}</p>
        </div>

        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
            <QrCode className="mr-2 h-5 w-5" />
            {t("scanToShare")}
          </h2>
          <div className="flex justify-center">
            <QRCodeDisplay url={shareUrl} name={typeof soul.name === "string" ? soul.name : ""} />
          </div>
        </div>

        <div className="mt-8">
          <SoulPreview soul={soul as any} />
        </div>

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

export default function ShareByIdPage() {
  const locale = detectLocale();
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages[locale] || enMessages}>
      <ShareByIdContent />
    </NextIntlClientProvider>
  );
}
