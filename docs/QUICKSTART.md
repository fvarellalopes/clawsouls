# 🚀 ClawSouls — Quick Start Guide

> Visual SOUL.md editor for OpenClaw AI personalities

## 📦 Installation

```bash
git clone git@github.com:fvarellalopes/clawsouls.git
cd clawsouls
npm install
```

## 🏃 Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

## 🛠️ Features

1. **Homepage** (`/`) – Hero section + feature grid
2. **Editor** (`/[locale]/editor`) – Full visual editor with tabs:
   - Basic Info (name, creature, vibe, emoji, avatar, vibe style)
   - Personality (core truths & boundaries toggles)
   - Attributes (tone sliders: humor, formalidade, verbosidade, etc.)
   - Advanced (signature phrases, emotional range)
3. **Presets** (`/[locale]/presets`) – Browse 516 character templates with tag filter + search
4. **Quiz** (`/[locale]/quiz`) – 10-question personality quiz → matched preset
5. **Compare** (`/[locale]/compare`) – Side-by-side preset comparison
6. **My Presets** (`/[locale]/my-presets`) – Save, manage, duplicate, delete
7. **Achievements** (`/[locale]/achievements`) – 10 unlockable achievements
8. **Share** (`/share?data=...`) – Compressed URL sharing with OG preview

## 🎯 Create a Personality

1. Click **Get Started** on homepage
2. Fill in Basic Info (name, creature, short vibe description)
3. Choose Core Truths and Boundaries (switches)
4. Tune Attributes with sliders (humor, formality, emoji usage, etc.)
5. Preview SOUL.md output in real-time
6. **Download** as `.md` file or **Share** the link

## 🎭 Use a Preset

1. Go to `/[locale]/presets`
2. Pick a character (516 available)
3. Click **Load Preset**
4. Tweak sliders as desired
5. Export or share!

## 🌍 Internationalization

The app supports **7 languages**: en, pt, es, fr, de, ja, zh

Click the globe icon in header to switch.

Add new translation:
- Edit `messages/{locale}.json` following the existing structure

## 📤 Deploy to Vercel

```bash
# Push to GitHub first
git push origin main

# Or use Vercel CLI
vercel --prod
```

Auto-deploy is configured — every push to `main` triggers a Vercel build.

Set env `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard.

## 📖 Project Structure

```
├── app/[locale]/           # i18n routes (editor, presets, quiz, compare, my-presets, achievements, preset/[slug])
├── app/share/              # Share page (OG tags, QR code)
├── app/api/                # API routes (presets, share, filtered-presets)
├── components/
│   ├── ui/                 # Radix UI components (Select, Dialog, Slider, etc.)
│   ├── layout/             # Header, Footer
│   └── *.tsx               # PresetCard, SoulEditor, PresetDetail, ABTestMode, etc.
├── store/                  # Zustand stores (soulStore, themeStore, achievementsStore, etc.)
├── data/                   # data/presets.ts (516 presets) + database.sqlite
├── lib/                    # Business logic (soulGenerator, supabase, quiz, themes, export)
├── messages/               # i18n JSON per locale (7 languages)
├── public/avatars/         # 526 generated avatar PNGs
└── scripts/                # Utility scripts + archive/
```

## 🧪 Test SOUL Generation

```bash
npm test           # Jest test suite
npm run build      # Verify TypeScript + Next.js build
npm run lint       # ESLint
```

## 📝 Add New Presets

Edit `data/presets.ts`. Follow the existing `SoulPreset` structure:

```ts
{
  id: "unique-id",
  name: "Character Name",
  creature: "AI / Origin",
  vibe: "Short description of communication style",
  emoji: "🎭",
  avatar: "",  // empty = auto-fallback
  coreTruths: { helpful: true, opinions: true, ... },
  boundaries: { private: true, askBeforeActing: true, ... },
  vibeStyle: "concise",
  description: "2-3 sentence detailed description",
  tags: ["tag1", "tag2", "tag3"],
  source: "character",
  humor: 50,
  formalidade: 50,
  verbosidade: 50,
  emojiUsage: 50,
  // ... more attribute fields
}
```

## 🐛 Troubleshooting

- **Port already in use**: `lsof -ti:3000 | xargs kill -9`
- **Dependencies missing**: `rm -rf node_modules && npm install`
- **Build fails**: Check Node.js ≥ 18

## 📄 License

Projeto pessoal — © 2026 Fernando Lopes (disconexo)

---

Made with 👁️👄👁️
