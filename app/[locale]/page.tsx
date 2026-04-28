"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wand2, Scroll, Download, Share2, Palette, Stars, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThreeBackgroundLazy } from "@/components/three-background-lazy";
import { FadeUp, StaggerContainer, StaggerItem, FloatingElement } from "@/components/animated";

export default function HomePage() {
  const t = useTranslations("home");

  const features = [
    {
      icon: Palette,
      title: t("features.visual"),
      desc: t("features.visualDesc"),
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Stars,
      title: t("features.presets"),
      desc: t("features.presetsDesc"),
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Share2,
      title: t("features.share"),
      desc: t("features.shareDesc"),
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Download,
      title: t("features.export"),
      desc: t("features.exportDesc"),
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ThreeBackgroundLazy />

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4">
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          {/* Floating badge */}
          <FadeUp>
            <FloatingElement>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-10">
                <Stars className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-200 tracking-wide">
                  {t("featureDesc")} · {t("presetsCount")}
                </span>
              </div>
            </FloatingElement>
          </FadeUp>

          {/* Title */}
          <FadeUp delay={0.15}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-wider font-display leading-[0.9]">
              <span className="text-gradient">{t("heroTitle")}</span>
            </h1>
          </FadeUp>

          {/* Subtitle */}
          <FadeUp delay={0.3}>
            <p className="text-lg sm:text-xl md:text-2xl text-purple-200/70 mb-14 max-w-3xl mx-auto leading-relaxed font-body">
              {t("heroSubtitle")}
            </p>
          </FadeUp>

          {/* CTAs */}
          <FadeUp delay={0.45}>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white border-0 px-10 py-7 text-lg rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <Link href="/editor">
                  <Wand2 className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  {t("getStarted")}
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="group border-purple-500/30 bg-purple-950/30 hover:bg-purple-500/10 text-purple-200 px-10 py-7 text-lg rounded-2xl transition-all duration-300"
              >
                <Link href="/presets">
                  <Scroll className="mr-3 h-5 w-5 group-hover:-rotate-6 transition-transform" />
                  {t("browsePresets")}
                </Link>
              </Button>
            </div>
          </FadeUp>

          {/* Scroll indicator */}
          <FadeUp delay={0.8}>
            <motion.div
              className="mt-20 flex flex-col items-center gap-2 text-purple-400/30"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs tracking-[0.3em] uppercase font-display">{t("scroll")}</span>
              <div className="w-px h-8 bg-gradient-to-b from-purple-400/30 to-transparent" />
            </motion.div>
          </FadeUp>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <FadeUp>
            <div className="text-center mb-20">
              <span className="text-xs tracking-[0.4em] uppercase text-amber-400/60 font-display">
                {t("capabilities")}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient font-display tracking-wider">
                {t("forgedForCreators")}
              </h2>
              <p className="text-purple-200/50 mt-4 max-w-xl mx-auto font-body text-lg">
                {t("forgedForCreatorsDesc")}
              </p>
            </div>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative p-8 rounded-2xl bg-[#140d24]/60 backdrop-blur-sm ring-1 ring-purple-500/15 hover:ring-purple-400/30 transition-all duration-300"
                >
                  {/* Icon glow */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl font-display font-bold text-purple-100 mb-3 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-purple-200/50 leading-relaxed font-body">
                    {feature.desc}
                  </p>

                  {/* Hover highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-500/30 transition-all duration-500" />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <FadeUp>
            <FloatingElement delay={0.5}>
              <Sparkles className="h-12 w-12 text-amber-400/60 mx-auto mb-8" />
            </FloatingElement>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient font-display tracking-wider">
              {t("readyToForge")}
            </h2>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="text-xl text-purple-200/50 mb-10 font-body">
              {t("readyToForgeDesc")}
            </p>
          </FadeUp>

          <FadeUp delay={0.45}>
            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold px-12 py-7 text-lg rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
            >
              <Link href="/editor">
                <Zap className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("startCreating")}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
