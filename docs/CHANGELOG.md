# Changelog

## v0.5.1 — Missing Pieces: API Share, Avatars, SEO, Cleanup (2026-05-11)

### 🐛 Fixes
- **KNOWN_AVATARS** — migrado de set hardcoded (13) para detecção dinâmica (325) via `scripts/scan-avatars.mjs`
- **Preset cards** — agora mostram avatar para todos os 325 personagens com PNG gerado

### ✨ Features
- **Share API** — `/api/share` endpoint (GET + POST) com armazenamento Supabase
- **Sitemap** — 56 URLs (7 locales × 8 rotas), changeFrequency e priority
- **Robots.txt** — permite crawling, desabilita `/api/`
- **OG Image** — SVG 1200×630 no estilo Stitch (gold, dark, badges)
- **Loading states** — quiz, achievements, my-presets, compare pages

### 🧹 Chores
- Scripts obsoletos movidos para `scripts/archive/` (16 arquivos)
- Backup files removidos (`presets.ts.backup`, `prompts_v5_backup.json`)

## v0.5.0 — Stitch Redesign & Avatar Pipeline (2026-05-11)

### 🎨 Stitch Redesign
- **Visual overhaul** — Design system "Stitch" implementado (gold #facc15, dark surfaces, glass panels)
- **Header** — Theme toggle (light/dark mode), logo gold, nav links atualizados
- **Footer** — Stitch-styled com links GitHub/Discord
- **Editor** — 1223 linhas, 7/5 split, Undo/Redo/Share/Export, Signature Phrases
- **Presets** — Grid responsivo 4/3/2/1 cols, gold accent, filtro/busca
- **Landing** — Badge "System Online", Bento grid, Feature cards

### 🌍 i18n — Mass Translation
- **224 novos presets** traduzidos em 7 idiomas
- **Total:** 522 presets × 7 idiomas = 3.654 entradas
- Script de tradução automatizada em `scripts/translate_presets.mjs`

### 🖼️ Avatar Pipeline
- Pipeline Z-Image-Turbo no Colab GPU (FastAPI + cloudflared)
- Geração 1024×1024 → crop 512×768, CFG=0, 8 steps
- 24+ avatares gerados e commitados em `public/avatars/`

### 🐛 Fixes
- `layout.tsx` — imports corrigidos pra usar `components/layout/header.tsx` (com theme toggle)
- `useParams()` fallback pra locale no Header
- Header/Footer antigos descontinuados

## v0.4.2 — Bug Fixes & i18n Improvements (2026-04-29)

### 🐛 Bug Fixes
- **Emoji Usage slider broken** — `attributeOptions` used `emoji_usage` key but store uses `emojiUsage`, causing the slider to read/write `undefined`. Fixed to `emojiUsage`.
- **Achievement tracking on every render** — `addLanguageUsed()` was called outside `useEffect`, firing on every render. Moved to proper `useEffect` with locale dependency.
- **Share page `loadSoulFromData` was a no-op** — Function always returned `null`. Now properly calls `decompressSoul()` for compressed share data.
- **OG image hardcoded domain** — `opengraph-image.tsx` fetched from `https://clawsouls.hub` instead of using `NEXT_PUBLIC_SITE_URL` env var.
- **Share URLs hardcoded** — Share pages used hardcoded `clawsouls.hub` domain. Now uses `window.location.origin` or env var fallback.

### 🌍 i18n
- **Share pages locale detection** — Both `/share` and `/share/[id]` now detect browser locale and load the correct translation (en, pt, es, ja, fr, de, zh) instead of always showing English.

---

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
