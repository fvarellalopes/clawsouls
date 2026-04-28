export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ClawSouls",
    description: "Visual SOUL.md editor for OpenClaw AI agents. Create, customize, and share AI personalities.",
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
      "Visual personality editor",
      "30+ character presets",
      "SOUL.md export",
      "Shareable links",
      "7 languages supported",
      "Big Five personality model",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
