"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Stars, Share2 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations("home");

  const features = [
    {
      icon: Palette,
      title: t("features.visual"),
      desc: t("features.visualDesc"),
    },
    {
      icon: Stars,
      title: t("features.presets"),
      desc: t("features.presetsDesc"),
    },
    {
      icon: Share2,
      title: t("features.share"),
      desc: t("features.shareDesc"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="min-h-[70vh] flex items-center justify-center px-4"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, oklch(0.45 0.13 270 / 0.04) 0%, transparent 70%)",
        }}
      >
        <div className="container mx-auto text-center max-w-3xl animate-fade-in">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 font-display leading-tight text-foreground">
            {t("heroTitle")}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-body">
            {t("heroSubtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:opacity-90 px-8 py-6 text-base rounded-lg font-semibold transition-opacity duration-150"
            >
              <Link href="/editor">
                {t("getStarted")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary px-8 py-6 text-base rounded-lg transition-colors duration-150"
            >
              <Link href="/presets">
                {t("browsePresets")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
              {t("forgedForCreators")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-body">
              {t("forgedForCreatorsDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border transition-shadow duration-150 hover:shadow-md"
              >
                <feature.icon className="h-8 w-8 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-display font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
