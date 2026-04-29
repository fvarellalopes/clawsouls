# 🎨 Design System — ClawSouls (Refatoração)

> Documento de referência visual. Todas as decisões de design passam por aqui.

---

## Conceito Visual: "Ink on Paper"

ClawSouls é uma ferramenta criativa. O design deve sentir-se como um ateliê de escrita — orgânico, intencional, vivo. Não como um painel de controle genérico.

**Metáfora:** Você está escrevendo uma alma em papel. A interface é o papel, o conteúdo é a tinta.

**Anti-metáfora:** Dashboard dark-mode com glassmorphism e partículas flutuantes.

---

## Paleta de Cores

### Base (OKLCH)

```css
/* Neutrals — warm tinted, NOT pure gray */
--color-paper:      oklch(0.97 0.01 80);      /* off-white, quase papel */
--color-paper-dark: oklch(0.15 0.01 80);      /* charcoal quente */
--color-ink:        oklch(0.12 0.02 80);      /* quase preto, mas quente */
--color-ink-light:  oklch(0.85 0.01 80);      /* texto em fundo escuro */
--color-muted:      oklch(0.55 0.01 80);      /* texto secundário */
--color-subtle:     oklch(0.40 0.01 80);      /* texto terciário */
--color-border:     oklch(0.85 0.01 80);      /* bordas em light */
--color-border-dark: oklch(0.25 0.01 80);     /* bordas em dark */

/* Primary — Deep Indigo (não purple neon) */
--color-primary:    oklch(0.45 0.15 270);     /* indigo profundo */
--color-primary-fg: oklch(0.97 0.01 270);     /* texto sobre primary */

/* Accent — Warm Coral */
--color-accent:     oklch(0.65 0.18 30);      /* coral quente */
--color-accent-fg:  oklch(0.12 0.02 30);      /* texto sobre accent */

/* Semantic */
--color-success:    oklch(0.60 0.15 145);     /* verde */
--color-error:      oklch(0.55 0.20 25);      /* vermelho */
--color-warning:    oklch(0.70 0.15 75);      /* amarelo */
--color-info:       oklch(0.60 0.12 240);     /* azul */
```

### Light Mode (default)

```css
--bg:       var(--color-paper);
--fg:       var(--color-ink);
--surface:  oklch(0.99 0.005 80);
--border:   var(--color-border);
```

### Dark Mode

```css
--bg:       var(--color-paper-dark);
--fg:       var(--color-ink-light);
--surface:  oklch(0.18 0.01 80);
--border:   var(--color-border-dark);
```

### Regras de Cor

1. **Neutrals = 60%** da interface
2. **Primary = 30%** (ações, links, headings importantes)
3. **Accent = 10%** (CTA único, badges, destaques)
4. **Gradient text = 0%** (remover completamente)
5. **Glassmorphism = apenas header sticky** (e mesmo assim, sutil)
6. **Nunca** gray text em colored background
7. **Nunca** pure black (#000) ou pure white (#fff)

---

## Tipografia

### Fontes

```
Display:  Space Grotesk (já carregada, bold, personality)
Body:     Inter (já carregada, legível, neutra)
Mono:     JetBrains Mono (já carregada, pra código)
```

**Remover:** Cinzel, Crimson Pro, Fira Code (não usados ou redundantes)

### Escala Modular (ratio 1.25)

| Token        | Size (rem) | Size (px) | Weight | Use               |
|-------------|-----------|----------|--------|-------------------|
| caption     | 0.75      | 12       | 400    | Labels, metadata  |
| body        | 1.0       | 16       | 400    | Texto principal   |
| subheading  | 1.25      | 20       | 500    | Labels de seção   |
| heading     | 1.5       | 24       | 600    | Títulos de card   |
| display     | 2.0       | 32       | 700    | Títulos de página |
| hero        | 3.0+      | 48+      | 700    | Hero section      |

### Regras de Tipografia

1. **Max-width: 65ch** em blocos de texto
2. **Line-height:** 1.1-1.2 (headings), 1.5-1.7 (body)
3. **Letter-spacing:** default (não forçar uppercase/tracking)
4. **Headings:** Space Grotesk, weight 600-700, SEM uppercase
5. **Body:** Inter, weight 400, 16px mínimo
6. **3 pesos máximo** por fonte (Regular, Medium, Semibold)

---

## Espaçamento

### Escala (4px base)

| Token | Value | Use                    |
|-------|-------|------------------------|
| xs    | 4px   | Gap entre ícones       |
| sm    | 8px   | Gap interno de card    |
| md    | 16px  | Padding de seção       |
| lg    | 24px  | Gap entre seções       |
| xl    | 32px  | Margem de página       |
| 2xl   | 48px  | Seções grandes         |
| 3xl   | 64px  | Hero sections          |

### Regras de Espaço

1. **Nunca** usar o mesmo spacing em tudo — criar ritmo
2. **Tight groups:** elementos relacionados juntos (8px)
3. **Clear separation:** grupos distintos com gap generoso (24-32px)
4. **Nesting de cards = proibido** — flatten a hierarquia

---

## Bordas e Cantos

```
Border radius:
  sm:  6px   (badges, tags)
  md:  8px   (inputs, buttons)
  lg:  12px  (cards)
  xl:  16px  (modals, containers grandes)

Border color: var(--border) — sempre sutil
Border width: 1px (nunca 2px+ exceto focus states)
```

**Remover:**
- Bordas coloridas em um lado (lazy accent)
- Bordas gradient
- Bordas grossas decorativas

---

## Cards

### Antes (AI Slop)
```css
/* Glassmorphism everywhere */
background: rgba(20, 13, 36, 0.7);
backdrop-filter: blur(20px);
border: 1px solid rgba(168, 85, 247, 0.15);
border-radius: 1rem;
box-shadow: 0 0 30px rgba(168, 85, 247, 0.1);
```

### Depois (Intencional)
```css
/* Clean, purposeful */
background: var(--surface);
border: 1px solid var(--border);
border-radius: 12px;
/* Sombra apenas em hover/elevation */
transition: box-shadow 0.2s ease;
&:hover {
  box-shadow: 0 4px 12px oklch(0 0 0 / 0.08);
}
```

---

## Animações

### Permitidas
- **Hover feedback:** scale(1.02), shadow increase, color shift (CSS transitions)
- **Page transitions:** fade + slide-up (0.3s ease-out)
- **Loading states:** skeleton, spinner (CSS)
- **Copy feedback:** check icon aparece por 2s (CSS)

### Proibidas
- **Bounce easing** — tacky, dated
- **Float animation** — sem propósito
- **Stagger animation** em grids — overkill
- **Three.js particles** — GPU waste
- **WhileHover rotate** em logos — childish
- **AnimatePresence** pra tudo — desnecessário

### Regra Geral
Se uma animação não melhora a usabilidade (feedback, transição, orientação), ela não deve existir.

---

## Componentes

### Header
- Fundo: `var(--bg)` com `opacity: 0.95` + `backdrop-filter: blur(8px)` (sutil, não glass)
- Logo: SVG real, não emoji + gradient text
- Nav: links simples, sem ghost buttons com opacity 60%
- CTA: 1 botão primário (accent color)

### Editor
- Split pane: 50/50 (não 60/40)
- Tabs: texto simples, sem ícones em cada tab
- Cards: fundo `var(--surface)`, borda sutil, sem glow
- Sliders: accent color no track, não gradient
- Preview: fundo levemente diferente (textura papel se conceito "Ink on Paper")

### Preset Cards
- Fundo `var(--surface)`
- Hover: sutil shadow increase + border color change
- Emoji grande (32px), nome em display font, description em body
- Tags: small, muted, uppercase tracking
- SEM animações Framer Motion

### Buttons
- Primary: accent color, text escuro, sem gradient
- Secondary: outline com border, sem ghost
- Ghost: apenas pra ícones de toolbar
- Todos: 8px border-radius, transição CSS 0.15s

---

## Dark Mode

Dark mode é **opção**, não default. O default é light mode (mais profissional, menos AI tell).

```html
<html lang="en"> <!-- sem class="dark" por default -->
```

O toggle de tema persiste em localStorage. A primeira visita é light.

---

## Do NOT (Anti-Patterns)

- ❌ Purple-on-dark como default
- ❌ Gradient text em headings ou métricas
- ❌ Glassmorphism em cards
- ❌ Three.js backgrounds
- ❌ Framer Motion em cada elemento
- ❌ Cinzel ou qualquer fonte "fantasia"
- ❌ `text-transform: uppercase` em headings
- ❌ Neon glow effects
- ❌ Card grids idênticos (variar layout)
- ❌ Botões com `shadow-purple-500/25`
- ❌ `backdrop-blur-xl` em tudo

---

*Documento criado em 2026-04-29 por disconexo*
