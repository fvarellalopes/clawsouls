"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Share2, Download, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-secondary/50 mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">{t("featureDesc")}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link href="/editor">
                {t("getStarted")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/presets">{t("browsePresets")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg glass border border-white/10 hover:border-accent/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Palette className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.visual")}</h3>
              <p className="text-muted-foreground">
                {t("features.visualDesc")}
              </p>
            </div>

            <div className="p-6 rounded-lg glass border border-white/10 hover:border-accent/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.presets")}</h3>
              <p className="text-muted-foreground">
                {t("features.presetsDesc")}
              </p>
            </div>

            <div className="p-6 rounded-lg glass border border-white/10 hover:border-accent/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Share2 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.share")}</h3>
              <p className="text-muted-foreground">
                {t("features.shareDesc")}
              </p>
            </div>

            <div className="p-6 rounded-lg glass border border-white/10 hover:border-accent/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.export")}</h3>
              <p className="text-muted-foreground">
                {t("features.exportDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("ctaDesc")}
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground">
            <Link href="/editor">{t("ctaButton")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
