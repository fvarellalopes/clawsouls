# 🎨 Stitch Redesign — Cyber Terminal

> Redesign completo do ClawSouls baseado no protótipo gerado pelo Google Stitch.
> Estética: "Cyber Terminal" — dark-first, gold accents, Material Symbols, glass-panels.

**Data:** 2026-04-29
**Status:** Em execução (5 subagentes paralelos)
**Branch principal:** `redesign/stitch-cyber-terminal`

---

## 🎯 Visão do Design

### Conceito: "Neural Terminal"
Interface de terminal neural cyberpunk. Fundo escuro (#09090b), acentos dourados (#facc15), tipografia técnica (Space Grotesk), ícones Material Symbols, painéis de vidro com blur.

### Anti-metáfora (o que NÃO fazer)
- ❌ Purple-on-dark
- ❌ Gradient text decorativo
- ❌ Glassmorphism em tudo
- ❌ Three.js particles
- ❌ Framer Motion em cada elemento
- ❌ Cinzel ou fontes fantasia

### O que o Stitch define
- ✅ Dark mode default (`bg-[#09090b]`)
- ✅ Primary container: `#facc15` (gold)
- ✅ Surface hierarchy: `#131315` → `#201f22` → `#2a2a2c` → `#353437`
- ✅ Typography: Space Grotesk (display) + Inter (body)
- ✅ Material Symbols Outlined para ícones
- ✅ Glass panels: `bg-white/5 backdrop-blur-xl border-white/10`
- ✅ Gold glow: `shadow-[0_0_15px_rgba(250,204,21,0.2)]`
- ✅ Custom range sliders: gold thumb, dark track

---

## 📐 Páginas do Stitch

### 1. Landing Page (`/`)
- Hero: "UNLEASH THE SOUL OF AI" (gradient gold, 48px)
- Badge: "System Online" (gold border, rounded-full)
- CTAs: "Launch Editor" (gold bg) + "Browse Presets" (gold border)
- Bento Grid: Editor mockup (8 cols) + Code output (4 cols)
- Features: 3 cards (Visual Editor, 30+ Presets, Instant Share)
- Footer: copyright + links

### 2. Presets Catalog (`/presets`)
- Header: "Global Directory" + "Character Presets"
- Filter dropdown (All Archetypes)
- Grid: 4 cols (xl), 3 (lg), 2 (md), 1 (sm)
- Cards: image + ARCH-01 code + name + description + LOAD PRESET button
- Hover: gold border, glow, image scale

### 3. Editor (`/editor`)
- Actions bar: title + Undo/Redo/Share/Export buttons
- 7/5 split: editor left, preview right
- Tabs: PERSONALITY | BASIC INFO | TONE ATTRIBUTES | ADVANCED
- Cognitive Parameters: Big Five sliders
- Syntactic Tone Profile: Verbosity, Humor, Formality, Emoji toggles
- Preview: "LIVE_STREAM.MD" terminal style
- Export animation: SVG circuit lines + SOUL chip pulse

### 4. Export/Share Modal
- File preview (code block with gold syntax)
- Download .MD / .JSON buttons
- Share link with copy
- Social share (Discord, X/Twitter)

---

## 🔧 Subagentes Paralelos

| # | Subagente | Branch | Escopo | Status |
|---|-----------|--------|--------|--------|
| 1 | design-system | `redesign/stitch-cyber-terminal` | tailwind.config.ts + globals.css + layout.tsx | 🔄 |
| 2 | header-footer | `feat/header-footer-redesign` | Header + Footer components | 🔄 |
| 3 | landing-page | `feat/landing-page-redesign` | Home page | 🔄 |
| 4 | presets-page | `feat/presets-redesign` | Presets page + cards | 🔄 |
| 5 | editor-page | `feat/editor-redesign` | Editor + Preview + Export animation | 🔄 |

### Fluxo de merge
```
main ← redesign/stitch-cyber-terminal ← feat/header-footer-redesign
                                        ← feat/landing-page-redesign
                                        ← feat/presets-redesign
                                        ← feat/editor-redesign
```

---

## 📋 Checklist de Implementação

### Design System
- [ ] Tailwind config com tokens Stitch (surface-container, primary-container, etc.)
- [ ] Font families (h1, h2, h3, label-caps, mono-data, body-sm/md/lg)
- [ ] Font sizes customizados
- [ ] CSS globals: glass-panel, glow-gold, glow-accent
- [ ] Custom range slider styles
- [ ] Dark mode default
- [ ] Material Symbols import no layout

### Header
- [ ] Logo "ClawSouls" em yellow-400 (sem ícone)
- [ ] Nav: Editor, Presets, Library, Docs (uppercase, Space Grotesk)
- [ ] CTA: "Connect Terminal" (gold bg)
- [ ] Settings + Account icons (Material Symbols)
- [ ] backdrop-blur-xl + border-b white/10

### Footer
- [ ] Copyright: "© 2024 CLAWSOULS TERMINAL // SYSTEM STATUS: NOMINAL"
- [ ] Links: Terms, Privacy, GitHub, Discord
- [ ] Muted text, gold hover

### Landing Page
- [ ] Hero section com badge "System Online"
- [ ] Title "UNLEASH THE SOUL OF AI" com gold gradient
- [ ] Subtitle + 2 CTAs
- [ ] Bento grid (editor mockup + code output)
- [ ] Features grid (3 cards com Material Symbols)
- [ ] Radial gradient background

### Presets Page
- [ ] Header com "Global Directory" + filter
- [ ] Grid responsivo (4/3/2/1 cols)
- [ ] Cards com gold accent bar, image, version badge
- [ ] Hover effects (gold border, glow)
- [ ] "LOAD PRESET" button com gold hover

### Editor
- [ ] Actions bar (title + buttons)
- [ ] 7/5 grid split
- [ ] Tabs bar (gold active)
- [ ] Cognitive Parameters section (Big Five sliders)
- [ ] Syntactic Tone Profile (sliders + toggles)
- [ ] Live Preview panel (LIVE_STREAM.MD)
- [ ] Export animation overlay (circuit lines + SOUL chip)

---

## 🎨 Tokens de Design (Referência Rápida)

```
Background:     #09090b
Surface:        #131315
Surface Low:    #1c1b1d
Surface High:   #2a2a2c
Surface Highest:#353437
Primary:        #facc15 (gold)
On Surface:     #e5e1e4
On Surface Var: #d1c6ab
Outline:        #9a9078
Outline Variant:#4d4632
Error:          #ffb4ab
White/10:       rgba(255,255,255,0.1)
White/5:        rgba(255,255,255,0.05)
Glass:          bg-white/5 backdrop-blur-xl border-white/10
Glow:           shadow-[0_0_15px_rgba(250,204,21,0.2)]
```

---

## 📊 Métricas de Sucesso

- [ ] Dark-first com gold accents em todas as páginas
- [ ] Material Symbols como ícones principais
- [ ] Glass panels apenas onde faz sentido (header, cards, preview)
- [ ] Custom sliders com gold thumb
- [ ] Export animation funcional
- [ ] Build passa sem erros
- [ ] Todas as funcionalidades existentes mantidas
- [ ] Responsivo (mobile-first)

---

*Documento criado em 2026-04-29 por disconexo 🔩*
