import type { MetadataRoute } from "next";

const locales = ["en", "pt", "es", "ja", "fr", "de", "zh"];
const baseUrl = "https://clawsouls.hub";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/editor",
    "/presets",
    "/quiz",
    "/compare",
    "/achievements",
    "/my-presets",
    "/share",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/presets" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
