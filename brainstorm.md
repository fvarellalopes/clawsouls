# 🧠 ClawSouls — Brainstorm & Feature Backlog

> Ideias para expansão e melhoria do ClawSouls

## 🎯 Cenário

ClawSouls é um editor visual de SOUL.md para OpenClaw. MVP completo lançado. Próximo passo: crescimento e retenção.

**Última atualização: 2026-04-29 — v0.4.3**

---

## 📋 Ideias por Categoria

### 🎭 Presets & Content

- [x] Expandir presets: +10 personagens famosos ✅ (300 presets)
  - [x] Anime/Manga: Luffy, Spike Spiegel, Light Yagami, Levi, Naruto
  - [x] Movies: Tony Stark, The Dude, Morpheus, Yoda, Vito Corleone
  - [x] Games: GLaDOS, Geralt, Sonic, Master Chief, Arthur Morgan
  - [x] Tropes: Chaotic Evil, Lawful Good, Trickster, Mentor, Villain
- [x] Criar presets temáticos por categoria ✅ (300 presets cobrindo todas)
  - [x] Professores (Socrates, Einstein, Dumbledore)
  - [x] Líderes (Churchill, Mandela, MLK)
  - [x] Artistas (Da Vinci, Bowie, Frida)
  - [x] Cientistas (Tesla, Curie, Hawking)
- [x] Adicionar descrições mais ricas ✅
- [x] Tags de searchBetter ✅ (tags em cada preset)
- [ ] Sistema de rating/likes para presets

### 📊 Advanced Personality Engine

- [x] Big 5 traits mappings ✅
  - [x] Openness → creativity slider
  - [x] Conscientiousness → formalidade & meticulousness
  - [x] Extraversion → expressiveness & emoji usage
  - [x] Agreeableness → empathy & helpfulness
  - [x] Neuroticism → humor variability & sensitivity
- [x] Communication modes ✅ (6 modos)
  - [x] Socratic (sempre pergunta)
  - [x] Diagnostic (analisa problemas)
  - [x] Encouraging (motivacional)
  - [x] Challenging (questiona)
  - [x] Flirty (playful)
  - [x] Direct (straightforward)
- [x] Knowledge domains selection ✅ (10 domínios)
  - [x] Tech, Philosophy, Pop Culture, Science, History, Arts, Sports, Business, Psychology, Literature
- [x] Signature phrases (user-defined catchphrases) ✅
- [x] Emotional range (flat to dramatic) ✅
- [ ] Speech patterns customization:
  - [ ] Alliteration toggle
  - [ ] Rhyme tendency
  - [ ] Metaphor frequency
  - [ ] Technical jargon level
  - [ ] Slang usage

### 🎨 Customization Expansion

- [x] Custom Core Truths (free text input) ✅
- [x] Custom Boundaries (free text input) ✅
- [x] Vibe Style combos (11 opções) ✅
- [x] Color theme presets per personality ✅ (10 temas)
  - [x] Cyberpunk, Ocean, Forest, Sunset, Monochrome
  - [x] Sakura, Bloodborne, Matrix, Arctic, Royal
- [x] Signature phrases ✅
- [x] Emotional range ✅
- [ ] Font style preferences (affects generated SOUL.md?)
- [ ] Speech rhythm (pace, pauses)

### 💾 User Accounts & Cloud

- [ ] Authentication:
  - [ ] Email/password
  - [ ] Google OAuth
  - [ ] GitHub OAuth
  - [ ] Magic link
- [ ] Database para salvar presets:
  - [x] PostgreSQL ou SQLite ✅ (Supabase + SQLite fallback implementado)
  - [ ] Schema: users, presets, versions
- [x] "My Presets" page (dashboard) ✅
  - [x] Lista de presets salvos
  - [x] Criar novo a partir de existente
  - [x] Duplicate
  - [x] Delete
- [ ] Version history (audit trail)
- [x] Import/JSON (paste JSON to load) ✅
- [x] Export/JSON (download full state) ✅

### 🤝 Community Features

- [ ] Public gallery de presets
  - [ ] Browse (grid + search)
  - [ ] Filter por tags
  - [ ] Sort por popularity/date
  - [ ] Pagination or infinite scroll
- [ ] User profiles (minimal)
  - [ ] Avatar
  - [ ] Display name
  - [ ] Bio
  - [ ] Link to their presets
- [ ] Community submission:
  - [ ] "Submit to gallery" button
  - [ ] Moderation queue (admin approval)
  - [ ] Report/inappropriate flag
- [ ] Social interactions:
  - [ ] Like presets
  - [ ] Comment on presets
  - [ ] Follow users
- [ ] Leaderboards:
  - [ ] Most liked this week
  - [ ] Trending
  - [ ] Top contributors

### 🔧 Developer Tools

- [x] API REST ✅
  - [x] `POST /api/share` (create share link)
  - [x] `GET /api/presets` (list)
  - [x] `GET /api/presets/:id`
  - [x] `GET /api/health`
  - [ ] Auth headers for private presets
- [x] CLI tool (`npx clawsouls`) ✅
  - [x] `generate --preset=shadow`
  - [x] `list-presets`
  - [x] `export --format=json`
  - [x] `search`
- [ ] VS Code extension:
  - [ ] Preview SOUL.md in panel
  - [ ] Quick access to presets
  - [ ] Sync with cloud account
- [ ] OpenClaw plugin:
  - [ ] Import directly from ClawSouls button
  - [ ] Deep link: `openclaw://import?url=...`
- [ ] SDK (JavaScript):
  - `import { generate } from 'clawsouls-sdk'`

### 📱 Mobile & PWA

- [x] PWA manifest ✅
  - [x] `manifest.json` (icons, name, theme_color)
  - [x] Service worker (cache assets)
  - [x] Install banner
- [x] Mobile-optimized UI ✅
  - [x] Touch-friendly sliders
  - [x] Bottom nav bar
  - [x] Responsive layout
- [x] QR code share ✅
  - [x] Generate QR on share page
- [x] Native share sheet ✅
  - [x] Web Share API for mobile
  - [ ] Share to WhatsApp, Telegram, Twitter

### 🎯 UX Improvements

- [x] Undo/Redo stack ✅
  - [x] Cmd+Z / Ctrl+Z
  - [x] Redo shortcut (Ctrl+Y / Ctrl+Shift+Z)
  - [x] Visual undo/redo buttons
- [x] Auto-save (debounced) ✅
  - [x] Save to localStorage
  - [x] Visual save indicator
- [ ] Template library:
  - [ ] Pre-built sections (e.g., "support agent template")
  - [ ] Mix & match blocks
- [x] Export formats ✅
  - [x] JSON (full state)
  - [ ] YAML (for readability)
  - [x] SOUL.md (markdown)
- [x] Print to PDF (browser print styles) ✅
- [x] Copy to clipboard button (SOUL.md content) ✅
- [ ] "Fill with AI" — GPT generates vibe description from bullet points

### 🔮 Experimental & AI-Powered

- [ ] GPT-generated presets:
  - [ ] Text input: "Create a preset for a pirate AI"
  - [ ] Call OpenAI API to generate all fields
  - [ ] User can edit before saving
- [ ] Voice sample generation:
  - [ ] TTS for greeting message
  - [ ] Select voice (ElevenLabs, Web Speech API)
  - [ ] Play in editor
- [x] Personality quiz ✅
  - [x] 10 questions about preferences
  - [x] Recommend top 3 presets
  - [x] "Which character are you?" fun result
- [ ] A/B test mode:
  - [ ] Create variant A and B
  - [ ] Compare side-by-side
  - [ ] Pick favorite
- [x] Compatibility score ✅
  - [x] Compare user's preset to famous ones
  - [x] Show similarity percentage
  - [x] "You're 87% like Sherlock Holmes"

### 📈 Growth & Marketing Hacks

- [ ] Embeddable widget:
  - [ ] "Create your OpenClaw soul" button
  - [ ] Iframe embed for blogs/communities
  - [ ] Customizable height/width
- [ ] Discord bot:
  - [ ] `/clawsouls generate --preset=...` command
  - [ ] Post SOUL.md as code block
  - [ ] Interactive editor in DMs?
- [ ] Twitter bot:
  - [ ] Daily random preset tweet
  - [ ] "Try this personality" + share link
  - [ ] Hashtag #ClawSouls
- [ ] Affiliate/referral system:
  - [ ] Unique referral links
  - [ ] Credits for premium features
  - [ ] Leaderboard of top referrers
- [ ] Paid tiers (optional):
  - [ ] Free: 5 saves, basic presets
  - [ ] Pro ($5/mo): unlimited, custom domains, advanced attrs
  - [ ] Team ($15/mo): collab, shared gallery
- [ ] Content marketing:
  - [ ] Blog: "How to design an AI personality"
  - [ ] YouTube tutorial
  - [ ] Case studies (famous presets explained)

### 🎮 Gamification

- [x] Achievements system ✅
  - [x] "First Export" (download first SOUL.md)
  - [x] "Preset Collector" (use 10 presets)
  - [x] "Share Star" (shared 100 times)
  - [x] "Community Contributor" (submitted preset)
  - [x] "Polyglot" (used all 4 languages)
  - [x] 10 achievements total with toast notifications
- [ ] Level system:
  - [ ] XP from actions (export, share, create)
  - [ ] Level up unlocks:
    - [ ] New emoji choices
    - [ ] Exclusive avatar styles
    - [ ] Advanced attributes
- [ ] Daily challenges:
  - [ ] "Create a personality with humor=90"
  - [ ] "Use a preset from each category"
  - [ ] "Share 3 times"
  - [ ] Rewards: badges, XP
- [ ] Leaderboards:
  - [ ] Global: most presets created
  - [ ] Weekly: most shares
  - [ ] Community: most likes

### 🛡️ Trust, Safety & Legal

- [ ] Content moderation:
  - [ ] Flag inappropriate presets
  - [ ] Admin dashboard to review
  - [ ] Auto-filter slurs/offensive language
- [ ] Report system:
  - [ ] Button on preset cards
  - [ ] Reasons: offensive, copyright, spam
  - [ ] Email notification to admin
- [ ] Age gating:
  - [ ] Warning for mature-themed presets
  - [ ] "Are you 18+?" modal (if flagged)
- [ ] Copyright policy:
  - [ ] DMCA takedown form
  - [ ] celebrity/fictional character guidelines
  - [ ] "Transformative use" policy in ToS
- [ ] Privacy policy:
  - [ ] What data we collect (localStorage, optional cloud)
  - [ ] No selling data
  - [ ] GDPR compliance (data export/delete)
- [ ] Terms of Service:
  - [ ] Acceptable use
  - [ ] Content ownership (users own their presets)
  - [ ] Disclaimers (AI personalities are fictional)

### 🌍 Localization & Depth

- [x] More languages ✅ (7 idiomas)
  - [x] French (fr)
  - [x] German (de)
  - [x] Chinese (zh)
  - [x] Portuguese (pt)
  - [x] Spanish (es)
  - [x] Japanese (ja)
  - [ ] Arabic (ar) + RTL support
  - [ ] Russian (ru)
  - [ ] Hindi (hi)
- [ ] Cultural presets per region:
  - [ ] Brazil: soccer player, samba dancer, politician
  - [ ] Japan: samurai, geisha, anime tropes
  - [ ] USA: cowboy, hip-hop artist, baseball player
  - [ ] UK: royal, pub landlord, detective
- [ ] RTL layout support:
  - [ ] CSS `direction: rtl`
  - [ ] Flip margins/padding
  - [ ] Test Arabic/Hebrew
- [ ] Region-specific examples in translations:
  - [ ] References local pop culture
  - [ ] Use local date formats, currencies

### 📊 Analytics & Insights

- [ ] User behavior tracking:
  - [ ] Which tabs are used most?
  - [ ] Time spent on each section
  - [ ] Drop-off points (where users leave)
  - [ ] Export vs Share conversion rate
- [ ] Preset analytics:
  - [ ] Most viewed presets
  - [ ] Most exported presets
  - [ ] Most shared presets
  - [ ] Average attribute settings per preset
- [ ] Heatmap of attribute usage:
  - [ ] Which slider positions are most common?
  - [ ] Clusters (e.g., "sarcastic & concise" vs "verbose & emoji")
- [ ] Error tracking:
  - [ ] Catch JSON parse errors on share
  - [ ] Missing preset IDs
  - [ ] Build errors (Sentry or similar)
- [x] Vercel Analytics ✅
- [ ] Dashboard (admin):
  - [ ] Daily active users
  - [ ] Total presets created
  - [ ] Export/download counts
  - [ ] Geographic distribution

### 🔧 Technical Debt & Polish

- [ ] Code quality:
  - [ ] Unit tests for `soulGenerator` (Jest)
  - [ ] Component tests (React Testing Library)
  - [ ] E2E tests (Playwright)
  - [ ] Storybook for UI components
- [ ] Performance:
  - [ ] Lazy load presets data (chunk)
  - [ ] Virtualize preset grid (if >100)
  - [ ] Optimize images (next/image)
  - [ ] Code splitting (dynamic imports for editor tabs)
- [x] SEO ✅
  - [x] `sitemap.xml`
  - [x] `robots.txt`
  - [x] Structured data (JSON-LD for presets)
  - [x] Meta tags per page
- [x] Accessibility (WCAG 2.1 AA) ✅
  - [x] Skip-to-content link
  - [x] Focus-visible styles
  - [x] ARIA labels where needed
  - [ ] Audit with axe DevTools
  - [ ] Fix color contrast
- [x] Error boundaries ✅
  - [x] Editor crash protection
  - [x] Fallback UI for failed presets load
- [ ] Build optimization:
  - [ ] Analyze bundle size (next-bundle-analyzer)
  - [ ] Remove unused dependencies
  - [ ] Tree-shaking verification
- [ ] Security:
  - [ ] CSP headers
  - [ ] Sanitize user inputs (XSS prevention in preview)
  - [x] Rate limiting on API routes ✅
  - [ ] No secrets in client bundle

---

## 📊 Priorização Sugerida

### 🔥 Critical (antes do launch público)

- [x] Teste de compartilhamento no Twitter/Discord
- [x] Ajuste fino de OG tags
- [x] Validar export no OpenClaw real
- [x] Corrigir bugs encontrados em testes
- [ ] Configurar domínio clawsouls.hub na Vercel

### 🌟 High Impact (logo após launch)

- [x] +10 presets (diversidade) ✅ (300 presets)
- [x] Undo/redo no editor ✅
- [x] Auto-save com recovery ✅
- [x] Mobile responsive polishing ✅
- [x] Google Analytics + Vercel Analytics ✅
- [x] PWA basic (manifest + install banner) ✅

### 🚀 Growth (2-4 semanas pós-launch)

- [ ] User accounts (simples: email + password)
- [ ] Cloud save (login required)
- [ ] Community gallery
- [ ] Discord bot
- [x] CLI tool ✅

### ✨ Nice-to-have (se tempo/recursos)

- [ ] GPT-generated presets
- [ ] Voice sample TTS
- [x] Personality quiz ✅
- [x] Gamification (achievements) ✅
- [x] Mais idiomas (FR, DE, ZH) ✅ (7 idiomas)

---

## 📈 Métricas de Sucesso

- **Ativação**: % de visitantes que criam um preset (target: >30%)
- **Exportação**: downloads por dia (target: 100+)
- **Compartilhamento**: shares por dia (target: 50+)
- **Retenção**: visitantes retornam em 7 dias (target: >20%)
- **Presets criados**: média por usuário (target: 2.5+)
- **Tempo no editor**: média (target: 3-5 minutos)

---

## 🎯 Próximas Ações Imediatas

1. [ ] Deploy em produção (Vercel)
2. [ ] Configurar clawsouls.hub DNS
3. [ ] Testar OpenGraph em Twitter Card validator
4. [ ] Coletar feedback de 5-10 amigos
5. [ ] UI para Signature Phrases e Emotional Range
6. [ ] Escrever post de lançamento (Dev.to, Indie Hackers)
7. [ ] Anunciar no Discord OpenClaw
8. [ ] Configurar GA4
9. [ ] Documentar API (se for pública)
10. [ ] Community gallery (precisa auth)

---

## 📊 Progresso Geral

| Categoria | Feito | Total | % |
|-----------|-------|-------|---|
| Presets & Content | 5 | 6 | 83% |
| Advanced Personality | 5 | 6 | 83% |
| Customization | 7 | 9 | 78% |
| User Accounts | 4 | 8 | 50% |
| Community | 0 | 12 | 0% |
| Developer Tools | 4 | 7 | 57% |
| Mobile & PWA | 5 | 6 | 83% |
| UX Improvements | 6 | 10 | 60% |
| Experimental | 2 | 5 | 40% |
| Growth & Marketing | 0 | 12 | 0% |
| Gamification | 1 | 4 | 25% |
| Trust & Safety | 0 | 12 | 0% |
| Localization | 1 | 5 | 20% |
| Analytics | 1 | 6 | 17% |
| Technical Debt | 4 | 10 | 40% |

**Overall: ~42% das features implementadas**

---

**Status**: Em desenvolvimento ativo. Features core 100% prontas. Crescimento e community são próximos passos.

*Updated: 2026-04-29*
