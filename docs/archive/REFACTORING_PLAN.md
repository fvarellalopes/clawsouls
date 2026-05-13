# 🔄 Plano de Refatoração — ClawSouls

> Baseado na crítica de design de 2026-04-29. Objetivo: transformar AI Slop em design intencional.

---

## Visão Geral

A refatoração é dividida em **5 fases**, cada uma com tarefas claras e mensuráveis. O objetivo não é reescrever tudo, mas cirurgicamente corrigir os problemas de design mantendo a base técnica sólida.

**Princípio guia:** Cada elemento visual deve ter uma razão pra existir. Se não comunica, decora. Se decora, remove.

---

## Fase 1: Identidade Visual (Fundação)

**Objetivo:** Definir quem o ClawSouls É visualmente, antes de mudar qualquer código.

### 1.1 Conceito Visual
- [ ] Definir o conceito visual central (opções abaixo)
- [ ] Criar referência visual/mood board
- [ ] Documentar decisões em `docs/DESIGN_SYSTEM.md`

**Conceitos propostos:**
- **"Ink on Paper"** — tinta sobre papel. Fundo off-white/bege, texto escuro, accent em tinta colorida. Orgânico, artesanal, único.
- **"Dark Studio"** — editor de código profundo. Fundo charcoal (#1a1a2e), texto neutro, accent único em coral ou teal. Serio, focado, premium.
- **"Zine Maker"** — estética de fanzine/DIY. Fundo papel, tipografia ousada, recortes, textura de grão. Criativo, jovem, desafiador.

### 1.2 Logo e Marca
- [ ] Criar logo vetorial (SVG) — símbolo + wordmark
- [ ] Definir favicon (não emoji)
- [ ] Criar variações (light/dark, icon-only, full)

### 1.3 Paleta de Cores
- [ ] Definir paleta base com OKLCH:
  - Neutrals tinted (warm ou cool, dependendo do conceito)
  - 1 cor primária (não purple)
  - 1 cor de accent
  - Cores semânticas (success, error, warning, info)
- [ ] Atualizar `globals.css` com novos tokens
- [ ] Atualizar `tailwind.config.ts`
- [ ] Remover gradient text utilities ou reduzir a uso mínimo

---

## Fase 2: Tipografia e Layout

**Objetivo:** Hierarquia clara, legibilidade, personalidade sem excesso.

### 2.1 Fontes
- [ ] Reduzir pra 2 fontes: 1 display + 1 body (ou 1 família com pesos variados)
- [ ] Remover fontes não usadas do `layout.tsx` (Inter, Space Grotesk, JetBrains_Mono importados mas não usados via CSS)
- [ ] Decidir: usar Space Grotesk (já carregada) ou trocar
- [ ] Atualizar `globals.css`: remover `@import` do Google Fonts, usar `next/font` corretamente
- [ ] Remover `text-transform: uppercase` de headings — usar weight/size pra hierarquia

### 2.2 Escala Tipográfica
- [ ] Definir escala modular (ratio 1.25 ou 1.333):
  - caption: 0.75rem
  - body: 1rem (16px)
  - subheading: 1.25rem
  - heading: 1.5rem
  - display: 2rem+
- [ ] Usar `clamp()` pra sizing fluido
- [ ] Definir line-heights: 1.1-1.2 (headings), 1.5-1.7 (body)
- [ ] Max-width de 65ch em blocos de texto

### 2.3 Layout
- [ ] Remover Three.js background da home (ou substituir por SVG/gradient estático)
- [ ] Simplificar hero section: menos elementos, mais espaço
- [ ] Adicionar footer (links, créditos, GitHub)
- [ ] Remover scroll indicator animado
- [ ] Reduzir uso de `backdrop-blur` — manter APENAS no header sticky

---

## Fase 3: Editor — Simplificação

**Objetivo:** Reduzir sobrecarga cognitiva sem perder funcionalidade.

### 3.1 Progressive Disclosure
- [ ] Reorganizar tabs: Basic | Style | Personality | Advanced
- [ ] Basic: name, creature, emoji, vibe (4 campos apenas)
- [ ] Style: vibeStyle, communicationMode, emotionalRange, tone sliders
- [ ] Personality: Big Five, knowledge domains
- [ ] Advanced: speech patterns, custom truths/boundaries, signature phrases
- [ ] Adicionar seção "Quick Start" no topo do editor com 3 opções:
  - "Start from scratch"
  - "Load a preset"  
  - "Fill with AI"

### 3.2 Preview
- [ ] Tornar preview mais proeminente (talvez 50/50 split em vez de 60/40)
- [ ] Melhorar contraste visual entre editor e preview
- [ ] Considerar fundo diferente pra preview (textura papel se conceito "Ink on Paper")

### 3.3 Ações
- [ ] Consolidar botões de export (menu dropdown: SOUL.md, JSON, YAML)
- [ ] Remover botão "Create" duplicado do header
- [ ] Tornar "Share" mais proeminente que "Export"

---

## Fase 4: Presets e Páginas

**Objetivo:** Consistência visual em todas as páginas.

### 4.1 Preset Cards
- [ ] Simplificar animações (CSS transitions em vez de Framer Motion)
- [ ] Melhorar hierarquia visual: nome maior, description mais legível
- [ ] Reduzir de 300 pra ~50 presets curados (ou melhorar a curadoria)
- [ ] Adicionar preview on hover (mostrar SOUL.md parcial)

### 4.2 Home Page
- [ ] Reduzir hero pra 70vh (não 92vh)
- [ ] Simplificar features section: 3 features, não 4
- [ ] Remover "bottom CTA" redundante
- [ ] Adicionar footer

### 4.3 Compare Page
- [ ] Garantir consistência visual com editor
- [ ] Melhorar empty state (guia o usuário, não só "selecione presets")

### 4.4 Quiz Page
- [ ] Simplificar visual
- [ ] Melhorar feedback das recomendações

---

## Fase 5: Polish e Performance

**Objetivo:** Detalhes finais e otimização.

### 5.1 Animações
- [ ] Auditar todas as animações Framer Motion
- [ ] Remover animações sem propósito (bounce, float, stagger desnecessários)
- [ ] Manter apenas: page transitions, hover feedback, loading states
- [ ] Usar CSS transitions pra micro-interações

### 5.2 Performance
- [ ] Avaliar bundle size do Three.js (se mantido)
- [ ] Code splitting pra rotas
- [ ] Lazy load de presets
- [ ] Otimizar imagens

### 5.3 Acessibilidade
- [ ] Auditar contraste de cores (WCAG AA)
- [ ] Verificar focus indicators em todos os elementos interativos
- [ ] Testar com screen reader
- [ ] Garantir que funciona sem JS (SSR)

### 5.4 Temas de Cores
- [ ] Atualizar os 10 temas pra seguir a nova paleta
- [ ] Garantir que cada tema tem identidade própria (não só trocar primary/accent)
- [ ] Adicionar 1-2 temas light mode

---

## Ordem de Execução

```
Fase 1 (Identidade) → Fase 2 (Tipografia) → Fase 3 (Editor) → Fase 4 (Páginas) → Fase 5 (Polish)
     ↓                      ↓                      ↓                  ↓                  ↓
  DESIGN_SYSTEM.md      globals.css           soul-editor.tsx     page.tsx files      audit final
  paleta.css            tailwind.config       layout simplificado  presets page        animations
  logo.svg              fontes fixas          progressive disclosure  home page        performance
```

**Cada fase gera commits independentes.** Não mergear fase 5 antes de validar fase 1.

---

## Métricas de Sucesso

- [ ] Ninguém olha e diz "AI fez isso" em 5 segundos
- [ ] Hierarquia visual clara: olho vai pro lugar certo em 2 segundos
- [ ] Editor usável sem tutorial (progressive disclosure funciona)
- [ ] Bundle size não aumenta (pode diminuir com remoção do Three.js)
- [ ] WCAG AA em todas as cores de texto

---

*Plano criado em 2026-04-29 por disconexo*
