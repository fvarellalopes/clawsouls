"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Wand2, Scroll, Crown, Stars } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stars background */}
      <div className="stars" />
      
      {/* Decorative orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 min-h-[90vh] flex items-center justify-center">
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          {/* Mystical badge */}
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full glass mb-8 animate-float">
            <Stars className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-200">{t("featureDesc")}</span>
          </div>
          
          {/* Main title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-wider">
            <span className="text-gradient">{t("heroTitle")}</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-purple-200/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white border-0 px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Link href="/editor">
                <Wand2 className="mr-3 h-5 w-5" />
                {t("getStarted")}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-purple-500/50 bg-transparent hover:bg-purple-500/10 text-purple-200 px-8 py-6 text-lg rounded-xl transition-all duration-300"
            >
              <Link href="/presets">
                <Scroll className="mr-3 h-5 w-5" />
                {t("browsePresets")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Forja das Almas</span>
            </h2>
            <p className="text-purple-300/60 text-lg">
              Crie personalidades únicas com ferramentas místicas
            </p>
          </div>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Sparkles className="h-7 w-7" />}
              title={t("features.visual")}
              description={t("features.visualDesc")}
              delay={0}
            />
            <FeatureCard 
              icon={<Crown className="h-7 w-7" />}
              title={t("features.presets")}
              description={t("features.presetsDesc")}
              delay={100}
            />
            <FeatureCard 
              icon={<Scroll className="h-7 w-7" />}
              title={t("features.share")}
              description={t("features.shareDesc")}
              delay={200}
            />
            <FeatureCard 
              icon={<Wand2 className="h-7 w-7" />}
              title={t("features.export")}
              description={t("features.exportDesc")}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="card-glow p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">{t("ctaTitle")}</span>
            </h2>
            <p className="text-xl text-purple-200/70 mb-10 leading-relaxed">
              {t("ctaDesc")}
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-semibold px-10 py-7 text-lg rounded-xl shadow-lg shadow-amber-500/30"
            >
              <Link href="/editor">
                <Wand2 className="mr-3 h-5 w-5" />
                {t("ctaButton")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) {
  return (
    <div 
      className="card-glow p-8 group cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/30">
        <span className="text-amber-400">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-purple-100">{title}</h3>
      <p className="text-purple-300/60 leading-relaxed">{description}</p>
    </div>
  );
}
