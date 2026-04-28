# Changelog

## v0.4.0 — Growth Features (2026-04-29)

### ✨ New Features
- **CLI Tool** — `npx clawsouls list|generate|export|search` command-line interface
- **Personality Quiz** — 10-question quiz that matches users to their ideal preset based on communication style, problem-solving, humor, and more
- **Compatibility Score** — Calculate similarity percentage between any two soul configurations with breakdown (tone, personality, style)
- **Achievements System** — 10 achievements to unlock (First Export, Social Butterfly, Preset Collector, Polyglot, etc.) with toast notifications and progress tracking
- **Achievements Page** — View all achievements, stats, and unlock progress
- **Dynamic OG Images** — Auto-generated OpenGraph images for shared presets (edge runtime)
- **Tag Filters** — Filter presets by tag on the presets catalog page

### 📦 New Files
- `cli/index.js` — CLI tool implementation
- `lib/quiz.ts` — Quiz questions and scoring algorithm
- `lib/compatibility.ts` — Compatibility calculation engine
- `store/achievementsStore.ts` — Achievements state management
- `components/compatibility-badge.tsx` — Compatibility percentage badge
- `components/achievement-toast.tsx` — Achievement unlock notification
- `app/[locale]/quiz/page.tsx` — Quiz page
- `app/[locale]/achievements/page.tsx` — Achievements page
- `app/share/[id]/opengraph-image.tsx` — Dynamic OG image
- `app/share/[id]/layout.tsx` — Share page metadata

### 🔧 Changes
- Header nav: added Quiz and Achievements links
- Mobile nav: added Quiz and Achievements
- Editor: tracks export/share/language for achievements
- Quiz: tracks quiz completion for achievements
- Header locales: synced to 7 (was 4)
- i18n: added quiz and achievements keys for all 7 locales

---

## v0.3.2 — Correção Completa (2026-04-29)
