---
title: "Authentication, Gallery & Themes — System Design"
date: 2026-04-02
status: draft
authors: ["Nexo"]
---

# ClawSouls — High Priority Features Design

**Scope:** Autenticação, perfis de usuário, galeria comunitária de presets, temas de cores customizáveis e sincronização em nuvem.

**Tech Stack:** Supabase (Auth + Postgres), Next.js 15, Zustand, Tailwind CSS, next-themes.

---

## 1. Database Schema

### Tables

#### `profiles`
Gerenciada pelo Supabase Auth automaticamente via `auth.users` trigger.
```sql
create table profiles (
  id uuid primary key references auth.users not null,
  email text unique not null,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies: users can read any profile, update only their own
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
```

#### `user_souls`
Souls salvas pelos usuários (privadas por padrão).
```sql
create table user_souls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  creature text not null,
  vibe text,
  emoji text,
  avatar text,
  core_truths jsonb not null default '{"helpful":true,"opinions":true,"resourceful":true,"trustworthy":true,"respectful":true}',
  boundaries jsonb not null default '{"private":true,"askBeforeActing":true,"noHalfBaked":true,"notVoiceProxy":true}',
  custom_core_truths jsonb default '[]',
  custom_boundaries jsonb default '[]',
  vibe_style text not null default 'concise',
  humor integer not null default 50,
  formality integer not null default 50,
  emoji_usage integer not null default 30,
  verbosity integer not null default 50,
  consciousness integer not null default 50,
  questioning integer not null default 30,
  is_public boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_user_souls_user_id on user_souls(user_id);
create index idx_user_souls_updated_at on user_souls(updated_at desc);

alter table user_souls enable row level security;

create policy "Users can manage own souls." on user_souls for all using (auth.uid() = user_id);
create policy "Public souls are viewable by everyone." on user_souls for select using (is_public = true);
```

#### `community_presets`
Presets públicos da comunidade (cópias de user_souls ou presets originais).
```sql
create table community_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  creature text not null,
  vibe text,
  emoji text,
  avatar text,
  core_truths jsonb not null,
  boundaries jsonb not null,
  custom_core_truths jsonb default '[]',
  custom_boundaries jsonb default '[]',
  vibe_style text not null,
  humor integer not null default 50,
  formality integer not null default 50,
  emoji_usage integer not null default 30,
  verbosity integer not null default 50,
  consciousness integer not null default 50,
  questioning integer not null default 30,
  description text,
  tags jsonb default '[]',
  source text not null default 'custom', -- 'character' | 'custom'
  upvotes integer not null default 0,
  downvotes integer not null default 0,
  downloads integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_community_presets_created_at on community_presets(created_at desc);
create index idx_community_presets_upvotes on community_presets(upvotes desc);
create index idx_community_presets_tags on community_presets using gin(tags);

alter table community_presets enable row level security;

create policy "Public presets are viewable by everyone." on community_presets for select using (true);
create policy "Authenticated users can insert." on community_presets for insert with check (auth.uid() = user_id);
create policy "Users can update own community presets." on community_presets for update using (auth.uid() = user_id);
create policy "Users can delete own community presets." on community_presets for delete using (auth.uid() = user_id);
```

#### `preset_votes`
Votos únicos por usuário/preset.
```sql
create table preset_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  preset_id uuid references community_presets not null,
  vote text check (vote in ('up', 'down')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, preset_id)
);

create index idx_preset_votes_user_preset on preset_votes(user_id, preset_id);
alter table preset_votes enable row level security;
create policy "Users manage own votes." on preset_votes for all using (auth.uid() = user_id);
```

#### `user_favorites`
Favoritos dos usuários.
```sql
create table user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  preset_id uuid references community_presets not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, preset_id)
);

create index idx_user_favorites_user_id on user_favorites(user_id);
alter table user_favorites enable row level security;
create policy "Users manage own favorites." on user_favorites for all using (auth.uid() = user_id);
```

### Triggers

```sql
-- Updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_user_souls_updated_at before update on user_souls for each row execute procedure update_updated_at_column();
create trigger update_community_presets_updated_at before update on community_presets for each row execute procedure update_updated_at_column();
```

---

## 2. Supabase Configuration

### Auth Providers
- Enable: Email (magic link or password), Google OAuth (optional for MVP)
- Set up redirect URLs for Vercel deployment

### Row Level Security (RLS)
All tables have RLS enabled; policies enforce per-user access.

### Storage (optional)
Future: store avatar images in Supabase Storage with public URLs.

---

## 3. Frontend Architecture

### Auth Layer
- `components/auth-provider.tsx`: wraps Next.js layout, provides `useAuth()` hook
- Uses `@supabase/ssr` + `@supabase/auth-helpers-nextjs`
- Session persisted via cookies (not localStorage)

### Store Extensions (`store/soulStore.ts`)

```ts
interface CloudState {
  userId?: string;
  syncStatus: 'idle' | 'syncing' | 'error';
  savedSouls: Array<{ id: string; name: string; updated_at: string }>;
}

// New actions:
setUser(user: User | null): void;
syncSouls(): Promise<void>;
saveSoulToCloud(soulId: string): Promise<boolean>;
publishToGallery(soulId: string): Promise<boolean>;
votePreset(presetId: string, vote: 'up' | 'down'): Promise<void>;
toggleFavorite(presetId: string): Promise<void>;
```

### Sync Hook (`hooks/useCloudSync.ts`)
- On user login → `syncSouls()` fetches all user_souls → merges into store (local wins by default on conflict)
- On soul change (debounced 1s) → if logged in → POST /api/souls (create or update)
- On page load → if logged in → auto-sync

### Cloud Status Component
`components/cloud-status-badge.tsx`: shows icon (offline/syncing/synced) + tooltip.

---

## 4. API Routes (Next.js)

**Auth routes** handled by Supabase SSR automatically.

**Protected API routes** use `verifySession()` from `@supabase/ssr`.

### `/api/souls`
- `GET`: list user's souls (limit/offset)
- `POST`: upsert a soul (body includes `id` if updating)

### `/api/souls/:id`
- `GET`: fetch one (must own or is_public)
- `PATCH`: update fields (partial)
- `DELETE`: remove

### `/api/souls/:id/publish`
- `POST`: copy soul to `community_presets` with current user attribution; set `is_public=true` on user_souls

### `/api/presets/community`
- `GET`: list gallery with filters `?tag=cyberpunk&sort=upvotes|date&limit=20`

### `/api/presets/:id/vote`
- `POST`: toggle vote (up/down), update counters

### `/api/presets/:id/favorite`
- `POST`: toggle favorite

All	protected routes return 401 if no session.

---

## 5. UI Components

### Header Updates
- If logged out: "Sign in" button
- If logged in: Avatar (initials + dropdown)
  - "My Souls" → redirects `/my-presets` (reuse existing page)
  - "Gallery" → `/presets/community`
  - "Profile" → `/profile` (optional)
  - "Sign out"

### MyPresets Page (`app/[locale]/my-presets/page.tsx`)
- Shows grid of user's souls (from store.savedSouls)
- Edit/Delete buttons
- "Publish to Gallery" toggle switch per soul

### Gallery Page (`app/[locale]/presets/community/page.tsx`)
- Grid of community presets (from `/api/presets/community`)
- Each card: upvote/downvote buttons, download count, "Use this preset" button
- Filters: tags, sort order (top, recent)
- Pagination or infinite scroll

### Theme Picker
- Store: `theme: 'dark'|'light'|'purple'|'blue'|'green'|'neon'`
- `next-themes` provider wraps layout
- `components/theme-picker.tsx`: floating palette in toolbar
- `globals.css`: define CSS variables per theme

---

## 6. Error Handling & UX

### Offline / Sync Errors
- Toast notifications:
  - `⚠️ Offline — changes saved locally` (status=yellow)
  - `🔄 Syncing...` (status=blue)
  - `✅ Synced` (status=green, auto-dismiss 3s)
  - `❌ Sync failed: <error>` (status=red, retry button)

### Auth Errors
- If 401 on protected API → clear local session → show toast "Session expired, please sign in again" → redirect to /login

### Conflict Resolution
- When saving soul that has stale `updated_at`: show modal:
  - "This soul was modified on another device. Overwrite server version or reload?"
  - Options: Overwrite (local wins) | Reload (server wins) | Cancel

### Validation
- Client-side required fields: name, creature
- API returns 422 with field errors → show inline

---

## 7. Implementation Plan (Step-by-Step)

1. **Supabase setup** (if not already):
   - Create tables via Supabase SQL editor (script in `scripts/supabase-schema.sql`)
   - Enable Auth providers (email, google)
   - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

2. **Install dependencies**:
   - `@supabase/supabase-js`, `@supabase/ssr`, `next-themes`

3. **Auth provider**:
   - Create `components/auth-provider.tsx`
   - Wrap root layout (`app/layout.tsx`) with `<AuthProvider>`
   - Add login page (`app/login/page.tsx`) or dialog

4. **Store expansion**:
   - Add `CloudState` fields to `soulStore`
   - Implement `setUser`, `syncSouls`, `saveSoulToCloud`, etc.
   - Add `theme` state with persist + `next-themes` integration

5. **API routes**:
   - Implement all routes with `verifySession()` middleware
   - Add appropriate error responses

6. **Cloud sync hook**:
   - `useCloudSync()` to auto-sync on login and debounced saves
   - Handle offline queue (localStorage flag + retry)

7. **UI components**:
   - `CloudStatusBadge`
   - `UserAvatar` dropdown
   - `ThemePicker`
   - Update `MyPresetsPage` with publish toggle
   - Create `GalleryPage`

8. **Testing flow**:
   - Sign up/in → create soul → refresh page → data persists
   - Offline → edit → sign in → sync happens
   - Gallery → vote → verify count updates
   - Theme → switch colors → persists

9. **Polish**:
   - Loading skeletons
   - Error toast design
   - Accessibility (keyboard nav, ARIA)

---

## 8. Rollout Strategy

- Feature flags via `openclaw.json` → `features.auth` (default false)
- Deploy to Vercel preview → test with 1-2 users
- Enable for all after QA

---

## 9. Open Questions

- **Conflito de edição:** devemos promptar ou last-write-wins? → **last-write-wins** para MVP
- **Rate limits no Supabase:** já somos limitados; podemos adicionar `pg_sleep` se necessário
- **Moderação de Galeria:** reports? → adiar para v2

---

**Status:** Pronto para implementação.

