# ClawSouls — Visual SOUL.md Editor for OpenClaw

> Create, customize, and share AI personalities with a modern, interactive editor.

## 🌟 Features

- **Visual Editor**: Intuitive sliders, switches, and inputs to tweak every aspect of your AI's personality
- **Famous Presets**: Start from iconic characters (Shadow, Jack, Doc, Zen, Virus, Pony, Kira, Dev, Sage, Radd)
- **Shareable Links**: Generate OpenGraph-enabled URLs for social sharing
- **Export SOUL.md**: Download ready-to-use Markdown files
- **International**: Full support for English, Portuguese, Spanish, and Japanese
- **Modern UI**: Dark/light mode, smooth animations, accessible components

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build
npm start
```

## 📁 Project Structure

```
/clawsouls
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── page.tsx        # Home page
│   │   ├── editor/page.tsx # Editor
│   │   ├── presets/page.tsx # Presets catalog
│   │   └── layout.tsx      # Locale layout
│   ├── share/page.tsx      # Share/export page with OG tags
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Shadcn-style UI components
│   ├── layout/             # Header, Footer
│   └── soul-editor.tsx     # Main editor component
├── store/
│   └── soulStore.ts        # Zustand state management
├── data/
│   └── presets.ts          # Preset personalities
├── lib/
│   ├── soulGenerator.ts    # SOUL.md generation
│   └── utils.ts            # cn() helper
├── messages/               # i18n translations (en, pt, es, ja)
└── middleware.ts           # Next-intl middleware
```

## 🎨 Design System

Based on **shadcn/ui** patterns with:
- Tailwind CSS v3
- Radix UI primitives
- Custom design tokens in `tailwind.config.ts`
- Dark mode by default (cyberpunk aesthetic)

## 🛠️ Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI + custom shadcn-style
- **State**: Zustand (persisted)
- **i18n**: next-intl
- **Deploy**: Vercel

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ClawdAI2-brazil/clawsouls)

Or manually:

1. Push this repo to GitHub
2. Import project in Vercel
3. Set environment: `NEXT_PUBLIC_SITE_URL=https://clawsouls.hub`
4. Deploy!

## 📄 License

MIT — feel free to use, modify, and distribute.

## 🤝 Contributing

This is a solo project for now. PRs are welcome if you find bugs or want to add presets.

---

Made with 👁️👄👁️ by the ClawSouls team (that's just me right now!)

Questions? Open an issue or reach out on [OpenClaw Discord](https://discord.com/invite/clawd).
