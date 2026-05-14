# ClawSouls — Visual SOUL.md Editor

> Create, customize, and share AI personalities with a modern, interactive editor.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![Version](https://img.shields.io/badge/version-0.5.0-blue) ![Presets](https://img.shields.io/badge/presets-516-gold) ![Avatars](https://img.shields.io/badge/avatars-524-cyan)

---

## ✨ Features

### 🎭 Editor Visual
- **516 presets** de personagens icônicos (anime, filmes, games, literatura, mitologia)
- Sliders interativos para **Big Five**, tom, registro, emojis
- **Signature Phrases** — padrões de fala customizáveis
- **Fill with AI** — descreva em bullets, gere a vibe automaticamente
- **AB Test Mode** — compare duas configurações lado a lado
- **Export** — YAML, SOUL.md, JSON

### 🎨 Design System "Stitch"
- Paleta dark com acento gold (#facc15)
- Glass panels com backdrop-blur
- Theme toggle (light/dark mode)
- Tipografia: Space Grotesk (display) + Inter (body)
- Ícones: Material Symbols

### 🌍 i18n — 7 Idiomas
| Idioma | Presets |
|---|---|
| 🇺🇸 English | 516 |
| 🇧🇷 Português | 516 |
| 🇪🇸 Español | 516 |
| 🇫🇷 Français | 516 |
| 🇩🇪 Deutsch | 516 |
| 🇯🇵 日本語 | 516 |
| 🇨🇳 中文 | 516 |

### 🖼️ Avatar Pipeline
Geração de avatares via **Z-Image-Turbo** no Google Colab:
- 1024×1024 → crop 512×768
- CFG=0, 8 steps
- FastAPI + cloudflared tunnel
- **524 avatares WebP** gerados (-91% tamanho vs PNG)

---

## 🚀 Quick Start

```bash
git clone git@github.com:fvarellalopes/clawsouls.git
cd clawsouls
npm install
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS |
| Estado | Zustand |
| Ícones | Material Symbols |
| Fontes | Space Grotesk + Inter |
| Deploy | Vercel |
| Storage | Supabase + SQLite |
| Dados | data/presets.ts (516 presets) |
| Avatares | Z-Image-Turbo + Colab |

---

## 📁 Estrutura

```
clawsouls/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page
│   ├── [locale]/           # Rotas i18n
│   │   ├── editor/         # Editor visual
│   │   ├── presets/        # Galeria de presets
│   │   ├── quiz/           # Quiz de personalidade
│   │   ├── compare/        # Comparação lado a lado
│   │   ├── my-presets/     # Presets salvos
│   │   ├── preset/[slug]/  # Detalhe do preset + SOUL.md
│   │   └── achievements/   # Conquistas
│   ├── api/                # API routes (presets, share, filtered-presets)
│   └── share/              # Página de compartilhamento
├── components/
│   ├── layout/             # Header, Footer
│   ├── ui/                 # GlassPanel, CyberSlider, Select, etc.
│   ├── soul-editor.tsx     # Editor principal
│   ├── preset-card.tsx     # Card de preset
│   ├── preset-detail.tsx   # Detalhe do preset
│   ├── fill-with-ai-dialog.tsx
│   ├── ab-test-mode.tsx
│   └── ...                 # +15 componentes
├── data/
│   ├── presets.ts          # Dados dos 516 presets
│   ├── database.sqlite     # SQLite cache
│   └── migrations/         # Esquemas SQL
├── lib/                    # Lógica de negócio
│   ├── soulGenerator.ts    # Geração de SOUL.md
│   ├── supabase.ts         # Cliente Supabase
│   ├── usePresets.ts       # Hook de presets
│   └── ...                 # quiz, themes, export, etc.
├── store/                  # Zustand stores
│   ├── soulStore.ts
│   ├── themeStore.ts
│   ├── achievementsStore.ts
│   └── ...
├── messages/               # Traduções i18n JSON (7 idiomas)
├── public/
│   └── avatars/            # 524 avatares WebP gerados
├── scripts/
│   ├── scan-avatars.mjs    # Scan de avatares
│   ├── translate_presets.mjs
│   ├── setup_supabase_schema.py
│   └── archive/             # Scripts históricos
├── docs/                   # Documentação
│   ├── CHANGELOG.md         # Histórico de versões
│   ├── QUICKSTART.md        # Guia rápido
│   ├── DEPLOY.md            # Instruções de deploy
│   ├── COLLAB_SETUP.md      # Setup do Colab para avatares
│   ├── PLAN.md              # Roadmap
│   ├── brainstorm.md        # Backlog de ideias
│   └── archive/             # Documentos históricos
├── cli/                    # CLI clawsouls
├── sql/                    # Queries SQL
└── supabase/               # Config Supabase
```

---

## 📄 Licença

Projeto pessoal — © 2026 Fernando Lopes (disconexo)
