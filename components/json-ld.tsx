export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ClawSouls",
    description: "Visual SOUL.md editor for OpenClaw AI agents. Create, customize, and share AI personalities with Big Five personality model, 300+ presets, and 7 languages.",
    url: "https://clawsouls.hub",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Fernando Varella Lopes",
      url: "https://github.com/fvarellalopes",
    },
    featureList: [
      "Visual personality editor with Big Five model",
      "300+ character presets from anime, games, movies, literature, history",
      "SOUL.md export for OpenClaw",
      "Shareable links with OpenGraph previews",
      "7 languages: English, Portuguese, Spanish, Japanese, French, German, Chinese",
      "10 curated color themes",
      "Personality quiz and compatibility scoring",
      "Achievements and gamification",
      "CLI tool for developers",
      "PWA installable on mobile",
      "Undo/redo with keyboard shortcuts",
      "Import/export JSON configurations",
    ],
    screenshot: "https://clawsouls.hub/og-default.png",
    softwareVersion: "0.4.2",
    inLanguage: ["en", "pt", "es", "ja", "fr", "de", "zh"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
