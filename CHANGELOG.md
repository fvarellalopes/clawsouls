# Changelog

## v0.3.2 — Correção Completa (2026-04-29)

### 🐛 Bug Fixes (todos os 7 bugs do brainstorm)
- **Locale desync** — layout, mobile-nav, date-fns sincronizados com middleware (7 idiomas)
- **Mobile nav regex** — agora detecta fr/de/zh
- **Date-fns crash** — zhCN, de, fr adicionados
- **getLocale hack** — substituído por detecção via pathname
- **Big Five no DB** — type, API e insert agora incluem openness/conscientiousness/extraversion/agreeableness/neuroticism
- **SoulPreview tipado** — `any` → `SoulState["soul"]`
- **Preset type inconsistente** — mapper no usePresets.ts propagado corretamente

### ✨ Quality Improvements (5 de 8 implementadas)
- **Loading skeletons** — PresetCardSkeleton, PresetsGridSkeleton, EditorSkeleton, PageSkeleton
- **API completa** — POST (público), PUT (admin), DELETE (admin) em /api/presets
- **Share URLs compactas** — API /api/share gera IDs curtos (8 chars), fallback pra base64
- **CSP headers** — Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, etc.
- **JSON-LD** — Structured data (WebApplication) pra rich snippets no Google
- **NEXT_PUBLIC_SITE_URL** — env var usada em vez de hardcoded

### 📦 New Files
- `lib/compress.ts` — compressão/decompressão de share data
- `components/skeletons.tsx` — loading skeleton components
- `components/json-ld.tsx` — structured data
- `app/api/share/route.ts` — share API (POST/GET)
- `app/share/[id]/page.tsx` — short URL share page

### 📦 Files Modified
- `app/[locale]/layout.tsx` — JsonLd, ErrorBoundary, 7 locales
- `app/[locale]/presets/page.tsx` — skeletons, tag filters
- `app/share/page.tsx` — tipado, env var
- `components/soul-editor.tsx` — short share URLs, loading state
- `components/share-actions.tsx` — env var
- `lib/db.ts` — Big Five, update_preset, delete_preset
- `pages/api/presets/index.ts` — POST support
- `pages/api/presets/[id].ts` — PUT/DELETE support
- `vercel.json` — CSP + security headers
- `CHANGELOG.md`

---

## v0.3.1 — Hotfixes & Quality (2026-04-29)
