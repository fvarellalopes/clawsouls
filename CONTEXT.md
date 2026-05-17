# ClawSouls — Domain Context

## What is ClawSouls?

ClawSouls is a visual editor and gallery for **SOUL.md** personality profiles used by OpenClaw AI agents. Users browse, customize, create, and share AI personality presets.

## Core Concepts

- **Preset** — A named personality configuration (Big Five traits, vibe, boundaries, tags, avatar). The atomic unit of the system. ~522 exist, sourced from `data/presets.ts` and Supabase.
- **SOUL.md** — The generated markdown output of a preset. What the AI agent actually consumes. Always generated in English regardless of UI locale.
- **Karma** — A 0-100 score measuring preset quality, computed from personality balance, vibe quality, completeness, and community ratings. Three tiers: Unstable (0-30), Developing (31-60), Refined (61+).
- **Rating** — A user's vote on a preset: like/dislike (boolean) + star score (0-5). One rating per anonymous user per preset. Persisted in Supabase `preset_ratings` table.
- **Avatar** — A WebP image for a preset, generated via Z-Image-Turbo FP8 on Colab GPU. Stored in `public/avatars/`.
- **Creature** — The species/type of the AI personality (Human, Demon, AI, Yoruba Orisha, etc.). A taxonomy term, not a gameplay mechanic.
- **Anonymous ID** — A browser-generated fingerprint (`anon_...`) stored in localStorage. Used to de-duplicate ratings without requiring authentication.

## Architecture Decisions

- **Dual data sources**: Supabase (primary, 299 presets) + local `data/presets.ts` (513 presets, fallback). The API merges both, deduplicating by `id`.
- **7 locales**: en, pt-BR, es, fr, de, ja, zh-CN. UI text is translated; SOUL.md output is always English.
- **No auth yet**: Anonymous ID is the closest thing to user identity. Auth (GitHub OAuth) is planned but not implemented.
