# Contributing to ClawSouls

## 🎯 Types of Contributions

- **New Presets**: Add famous characters from movies, anime, games, books
- **Translations**: Improve or add new language translations
- **Bug Fixes**: Report issues or submit PRs
- **Design**: Improve UI/UX, add animations, improve accessibility
- **Features**: Suggest new personality attributes or editor features

## 📦 Preset Guidelines

When adding a new preset, ensure:

1. **Respect Intellectual Property**: Use characters that are in public domain or create original ones. For famous characters, use them in a transformative, descriptive way (not copying exact dialogue).
2. **Balanced Attributes**: Core truths and boundaries should reflect the character's ethos.
3. **Detailed Description**: 2-3 sentence description that captures the essence.
4. **Relevant Tags**: 3-5 tags for discoverability (genre, archetype, tone).
5. **Emoji & Avatar**: Pick an appropriate emoji and a DiceBear avatar seed.

Example preset structure:

```ts
{
  id: "char-id",
  name: "Character Name",
  creature: "AI / [Origin]",
  vibe: "Short description of communication style",
  emoji: "🎭",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=char-id",
  coreTruths: { ... },
  boundaries: { ... },
  vibeStyle: "concise",
  description: "Detailed 2-3 sentence description.",
  tags: ["tag1", "tag2", "tag3"],
  source: "character",
}
```

## 🏗️ Development Workflow

```bash
npm install
npm run dev
```

Make changes, then:

```bash
npm run build  # Verify build works
npm run lint   # Check for issues
npm run format # Format code
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

## 🌍 Translation Guidelines

When adding translations:

1. Export current messages: `npm run extract-i18n` (if configured)
2. Translate `messages/{locale}.json`
3. Keep placeholder tokens (`{{variable}}`) intact
4. Maintain the same JSON structure
5. Test by switching language in the app

## 🚢 Deploy

Deploys are automatic on push to `main`. For manual deploy:

```bash
npm run build
vercel --prod
```

## ❓ Questions?

Open an issue or reach out via OpenClaw Discord: https://discord.com/invite/clawd

---

Thank you for contributing to ClawSouls! 🎉
