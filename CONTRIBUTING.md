# Contributing to ClawSouls

## 🎯 Types of Contributions

- **New Presets**: Add famous characters from movies, anime, games, books, mythology
- **Translations**: Improve or add new language translations
- **Bug Fixes**: Report issues or submit PRs
- **Design**: Improve UI/UX, add animations, improve accessibility
- **Features**: Suggest new personality attributes or editor features

## 📦 Preset Guidelines

When adding a new preset to `data/presets.ts`, ensure:

1. **Respect Intellectual Property**: Use characters that are in public domain or create original ones. For famous characters, use them in a transformative, descriptive way (not copying exact dialogue).
2. **Balanced Attributes**: Core truths and boundaries should reflect the character's ethos.
3. **Detailed Description**: 2-3 sentence description that captures the essence.
4. **Relevant Tags**: 3-5 tags for discoverability (genre, archetype, tone).
5. **Emoji**: Pick an appropriate emoji.
6. **Avatar**: Leave `avatar` field empty — avatars are generated via the Z-Image-Turbo pipeline and stored as PNGs in `public/avatars/`.

Preset structure:

```ts
{
  id: "char-id",
  name: "Character Name",
  creature: "AI / [Origin]",
  vibe: "Short description of communication style",
  emoji: "🎭",
  avatar: "",
  coreTruths: { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true },
  boundaries: { private: true, askBeforeActing: true, noHalfBaked: true, notVoiceProxy: true },
  vibeStyle: "concise", // concise | expressive | verbose | poetic | technical | philosophical
  description: "Detailed 2-3 sentence description.",
  tags: ["tag1", "tag2", "tag3"],
  source: "character",
  humor: 50,
  formalidade: 50,
  verbosidade: 50,
  emojiUsage: 50,
  // ... see SoulPreset type for full attribute list
}
```

## 🏗️ Development Workflow

```bash
npm install
npm run dev
```

Make changes, then:

```bash
npm run build   # Verify TypeScript + Next.js build
npm run lint    # ESLint
npm test        # Jest test suite
```

## 📝 Commit Convention

We use Conventional Commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Build/CI changes

## 📜 Code Style

- TypeScript strict mode
- Tailwind CSS for styling
- Components follow Radix UI patterns
- Use existing UI components from `components/ui/`
- Keep components small and focused
- Zustand for state management

## 🌍 Translation Guidelines

The app supports **7 locales**: en, pt, es, fr, de, ja, zh

When adding or updating translations:

1. Edit the corresponding file in `messages/{locale}.json`
2. Keep placeholder tokens (`{{variable}}`) intact
3. Maintain the same JSON structure
4. Test by switching language in the app
5. Add new locale by creating a new file and adding it to the `locales` array in `app/[locale]/layout.tsx`

## 🚢 Deploy

Auto-deploy on push to `main` via Vercel GitHub integration. For manual deploy:

```bash
npm run build
vercel --prod
```

Required env vars on Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ❓ Questions?

Open an issue or contribute directly via pull request.

---

Thank you for contributing to ClawSouls! 🎉
