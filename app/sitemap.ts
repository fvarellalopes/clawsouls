import { MetadataRoute } from "next";

const BASE_URL = "https://clawsouls.hub";
const locales = ["en", "pt", "es", "ja", "zh", "de", "fr"];
const routes = ["", "/editor", "/presets", "/my-presets"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Add root redirect
  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  });

  // Add locale-specific routes
  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 0.9 : route === "/editor" ? 0.8 : 0.6,
      });
    }
  }

  return entries;
}
