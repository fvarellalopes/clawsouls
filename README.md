# ClawSouls — Visual SOUL.md Editor

> Create, customize, and share AI personalities with a modern, interactive editor.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![Version](https://img.shields.io/badge/version-0.5.0-blue) ![Presets](https://img.shields.io/badge/presets-522-gold)

---

## ✨ Features

### 🎭 Editor Visual
- **522 presets** de personagens icônicos (anime, filmes, games, literatura)
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
| 🇺🇸 English | 522 |
| 🇧🇷 Português | 522 |
| 🇪🇸 Español | 522 |
| 🇫🇷 Français | 522 |
| 🇩🇪 Deutsch | 522 |
| 🇯🇵 日本語 | 522 |
| 🇨🇳 中文 | 522 |

### 🖼️ Avatar Pipeline
Geração de avatares via **Z-Image-Turbo** no Google Colab:
- 1024×1024 → crop 512×768
- CFG=0, 8 steps
- FastAPI + cloudflared tunnel
- 24+ avatares gerados

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
| Storage | Supabase |
| Auth | GitHub OAuth (em breve) |
| Avatares | Z-Image-Turbo + Colab |

---

## 📁 Estrutura

```
clawsouls/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing
│   ├── presets/            # Global directory
│   └── soul-editor.tsx     # Editor principal
├── components/
│   ├── layout/             # Header, Footer
│   └── ui/                 # GlassPanel, CyberSlider, etc.
├── presets/                # Dados dos personagens (7 idiomas)
├── public/
│   └── avatars/            # Avatares gerados
├── scripts/                # Utilitários (tradução, etc.)
└── docs/
    └── archive/            # Documentos históricos
```

---

## 📄 Licença

Projeto pessoal — © 2026 Fernando Lopes (disconexo)
