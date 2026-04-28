# Changelog

## v0.3.1 — Hotfixes & Quality (2026-04-29)

### 🐛 Bug Fixes
- **Locale desync** — `layout.tsx` only had 4 locales while middleware had 7. Now all 7 locales (en, pt, es, ja, fr, de, zh) are properly registered in layout, mobile nav, and date-fns mapping.
- **Mobile nav broken on new locales** — Regex for stripping locale prefix now includes `fr`, `de`, `zh`.
- **Date-fns crash on zh/de/fr** — Added `zhCN`, `de`, `fr` locale imports and mappings in MyPresetsPage.
- **MyPresetsPage `getLocale` hack** — Replaced `(router as any).getLocale?.()` with proper pathname-based locale detection.
- **Big Five missing from DB** — Added `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism` to `Preset` type, `rowToPreset`, and `insert_preset` for both Supabase and SQLite.
- **SoulPreview typed** — Replaced `any` with `SoulState["soul"]`.

### ✨ New Features
- **Import SOUL.md** — Users can now import existing SOUL.md files (not just JSON). Parser extracts name, creature, vibe style, core truths, boundaries, and vibe description from markdown patterns.
- **Error Boundaries** — Added `ErrorBoundary` component wrapping page content and Three.js background. Prevents full-page crashes from component errors.
- **Lazy Three.js** — Homepage Three.js background is now lazy-loaded with `next/dynamic`. Eliminates ~150KB from initial bundle. Shows solid background color while loading.

### 📦 New Files
- `components/error-boundary.tsx`
- `components/three-background-lazy.tsx`
- `lib/soulParser.ts`

### 📦 Files Changed
- `app/[locale]/layout.tsx` — 7 locales + ErrorBoundary
- `app/[locale]/my-presets/page.tsx` — date-fns locales + getLocale fix
- `app/[locale]/page.tsx` — lazy Three.js
- `components/import-json-dialog.tsx` — SOUL.md import
- `components/mobile-nav.tsx` — locale regex
- `components/soul-preview.tsx` — typed
- `lib/db.ts` — Big Five in type/API/insert

---

## v0.3.0 — Quality & Completeness (2026-04-29)

### 🐛 Critical Fixes
- **Fixed broken test suite** — Updated `soulGenerator.test.ts` to match actual store schema (boundary keys were outdated)
- **Added Tone Attributes to SOUL.md output** — Users configure humor, formality, emojiUsage, verbosity, consciousness, questioning via sliders, but these were missing from generated SOUL.md. Now included as a dedicated "Tone" section.
- **Added "Balanced" vibe style** — Morpheus and Vito Corleone presets used `balanced` but it wasn't defined in the generator. Now a first-class vibe style.
- **Fixed Export JSON** — Big Five personality traits (openness, conscientiousness, extraversion, agreeableness, neuroticism) were missing from JSON export.

### ✨ Improvements
- **i18n for vibe style labels** — Editor vibe style dropdown was hardcoded in Portuguese. Now uses `next-intl` translations across all 7 locales.
- **Accessibility** — Added `aria-label` to icon-only buttons, `role="status"` and `aria-live="polite"` on auto-save indicator.
- **SEO** — Added `robots.ts`, `sitemap.ts` with locale-aware routes.
- **Tone profile bars** — Live preview shows animated bars for 6 tone attributes.
- **Type safety** — Removed `any` types in key components.

---

## v0.2.0 — Enhanced Presets & UX (2026-02-18)
