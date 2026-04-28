# Changelog

## v0.3.0 — Quality & Completeness (2026-04-29)

### 🐛 Critical Fixes
- **Fixed broken test suite** — Updated `soulGenerator.test.ts` to match actual store schema (boundary keys were outdated)
- **Added Tone Attributes to SOUL.md output** — Users configure humor, formality, emojiUsage, verbosity, consciousness, questioning via sliders, but these were missing from generated SOUL.md. Now included as a dedicated "Tone" section.
- **Added "Balanced" vibe style** — Morpheus and Vito Corleone presets used `balanced` but it wasn't defined in the generator. Now a first-class vibe style.
- **Fixed Export JSON** — Big Five personality traits (openness, conscientiousness, extraversion, agreeableness, neuroticism) were missing from JSON export.

### ✨ Improvements
- **i18n for vibe style labels** — Editor vibe style dropdown was hardcoded in Portuguese. Now uses `next-intl` translations across all 7 locales (en, pt, es, ja, zh, de, fr).
- **Accessibility** — Added `aria-label` to icon-only buttons (undo, redo, theme toggle), `role="status"` and `aria-live="polite"` on auto-save indicator.
- **SEO** — Added `robots.ts`, `sitemap.ts` with locale-aware routes. Public files get indexed, API and share routes excluded.
- **Expanded test coverage** — Added tests for tone attributes, custom core truths, custom boundaries, and balanced vibe style.

### 📦 Files Changed
- `lib/soulGenerator.ts` — Added tone attributes section, balanced vibe style
- `components/soul-editor.tsx` — i18n vibe styles, Big Five in JSON export, accessibility
- `lib/__tests__/soulGenerator.test.ts` — Complete rewrite matching actual schema
- `messages/{en,pt,es,ja,zh,de,fr}.json` — Added vibeStyles and customize keys
- `app/robots.ts` — New
- `app/sitemap.ts` — New
- `public/robots.txt` — New

---

## v0.2.0 — Enhanced Presets & UX (2026-02-18)

### ✨ New Features
- **11 new presets** added (total now 21):
  - Luffy (Pirate Captain)
  - Spike Spiegel (Bounty Hunter)
  - Tony Stark (Genius Billionaire)
  - GLaDOS (Rogue AI)
  - Yoda (Jedi Master)
  - Geralt of Rivia (Witcher)
  - Dumbledore (Headmaster)
  - Shawn Spencer (Fake Psychic)
  - Ciri (Child of Destiny)
- **Undo/Redo** functionality in editor
  - Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y / Ctrl+Shift+Z (redo)
  - Toolbar buttons with icons
  - 50-state history buffer
- **Auto-save indicator** in editor toolbar
  - Shows "Saving..." during save
  - Shows timestamp of last save
- **PWA support**
  - Web App Manifest with icons and theme color
  - Service Worker for offline caching (next-pwa)
  - Installable on mobile devices
  - Apple web app capable meta tags

### 🎯 Editor Improvements
- Enhanced soulStore with undo/redo methods
- Added historyStore for state history management
- Added autoSaveStore for saving status UI
- Debounced history push (100ms) to avoid noise
- Auto-save trigger after each change (500ms delay)

### 📦 Dependencies
- Added: next-pwa ^5.6.0 (dev)

### 🐛 Bug Fixes
- Fixed editor state handling for undo/redo after preset load
- Improved localStorage persistence reliability

### 📚 Documentation
- Updated brainstorm.md with 80+ feature ideas
- Updated CHANGELOG with new features
- Added validation script (scripts/validate.js)

---

## v0.1.0 — Initial Release (2026-02-18)

### ✨ Features
- Visual SOUL.md editor with sliders, switches, and selects
- 10 famous character presets (Shadow, Jack, Doc, Zen, Virus, Pony, Kira, Dev, Sage, Radd)
- Real-time preview of generated SOUL.md
- Export/download as Markdown file
- Shareable links with OpenGraph metadata
- Internationalization: English, Portuguese, Spanish, Japanese
- Dark/light theme toggle
- Fully responsive design
- Zustand state persistence

### 🛠️ Tech Stack
- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS v3
- Radix UI primitives
- next-intl for i18n
- shadcn/ui component patterns

### 🚀 Deployment
- Vercel-ready with vercel.json
- Domain: clawsouls.hub
- Static generation + serverless functions

---

Made with 👁️👄👁️ by the ClawSouls team.
