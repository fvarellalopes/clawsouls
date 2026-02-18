# 🚀 ClawSouls — Quick Start Guide

> Visual editor for OpenClaw SOUL.md files

## 📦 Installation

```bash
cd /root/clawsouls
npm install
```

## 🏃 Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

## 🛠️ Features

1. **Homepage** (`/`) – Hero section + feature grid
2. **Editor** (`/editor`) – Full visual editor with tabs:
   - Basic Info (name, creature, vibe, emoji, avatar, vibe style)
   - Personality (core truths & boundaries toggles)
   - Attributes (tone sliders: humor, formalidade, verbosidade, etc.)
   - Advanced (presets, reset)
3. **Presets** (`/presets`) – Load famous character templates
4. **Share** (`/share?data=...`) – View, copy link, export preview
5. **i18n** – Switch languages (en/pt/es/ja)

## 🎯 Create a Personality

1. Click **Get Started** on homepage
2. Fill in Basic Info (name, creature, short vibe description)
3. Choose Core Truths and Boundaries (switches)
4. Tune Attributes with sliders (humor, formality, emoji usage, etc.)
5. Preview SOUL.md output in real-time
6. **Download** as `.md` file or **Share** the link

## 🎭 Use a Preset

1. Go to `/presets`
2. Pick a character (e.g., Shadow, Jack, Zen)
3. Click **Load Preset**
4. Tweak sliders as desired
5. Export or share!

## 🌍 Internationalization

The app supports 4 languages. Click the globe icon in header to switch.

Add new translation:
- Edit `messages/{locale}.json` following the existing structure

## 📤 Deploy to Vercel

```bash
# Push to GitHub first
gh repo create ClawdAI2-brazil/clawsouls --public --source=. --push

# Deploy via Vercel CLI
npm i -g vercel
vercel --prod
```

Or use the Vercel dashboard:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ClawdAI2-brazil/clawsouls)

Set env `NEXT_PUBLIC_SITE_URL=https://clawsouls.hub`

## 📖 Project Structure

```
├── app/[locale]/       # i18n routes (home, editor, presets)
├── app/share/          # Share page (OG tags)
├── components/
│   ├── ui/             # shadcn-style components (Button, Card, etc.)
│   ├── layout/         # Header, Footer
│   └── soul-editor.tsx # Main editor component
├── store/soulStore.ts  # Zustand state
├── data/presets.ts     # Character presets data
├── lib/soulGenerator.ts# SOUL.md generator
└── messages/           # Translations
```

## 🧪 Test SOUL Generation

```bash
node scripts/test-generator.js
```

## 📝 Add New Presets

Edit `data/presets.ts`. Follow this structure:

```ts
{
  id: "unique-id",
  name: "Character Name",
  creature: "AI / Origin",
  vibe: "Short description of communication style",
  emoji: "🎭",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=id",
  coreTruths: { helpful: true, opinions: true, ... },
  boundaries: { private: true, askBeforeActing: true, ... },
  vibeStyle: "concise",
  description: "2-3 sentence detailed description",
  tags: ["tag1", "tag2", "tag3"],
  source: "character"
}
```

## 🐛 Troubleshooting

**Port already in use**: `lsof -ti:3000 | xargs kill -9`
**Dependencies missing**: `rm -rf node_modules && npm install`
**Build fails**: Check Node.js ≥ 18

## 📄 License

MIT

---

Made with 👁️👄👁️

Questions? Open an issue on GitHub.
