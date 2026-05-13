# Plano: Rotas diretas de preset + SOUL.md + llms.txt

## Contexto

O app ClawSouls (Next.js 15, App Router, i18n via next-intl) atualmente carrega presets
no editor apenas via UI (clicando em cards). Não há URLs diretas para:

1. Abrir um preset no editor: `/preset/glados`
2. Obter o SOUL.md de um preset: `/presets/glados/SOUL.md`

O llms.txt também precisa referenciar essas URLs.

---

## Arquivos a modificar / criar

### 1. `app/[locale]/editor/page.tsx` — Aceitar searchParam `?preset=slug`

**O que mudar:**
- Adicionar `searchParams` à prop do componente (Next.js 15 usa `searchParams: Promise<{...}>`)
- Extrair `preset` de searchParams
- Passar `initialPresetSlug` para `<SoulEditor>`

```tsx
interface EditorPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ preset?: string }>;
}
```

### 2. `components/soul-editor.tsx` — Aceitar `initialPresetSlug` prop

**O que mudar:**
- Aceitar prop opcional `initialPresetSlug?: string`
- No mount (`useEffect`), se `initialPresetSlug` estiver setado:
  - Buscar preset por slug no array `presets` de `data/presets.ts`
  - Se encontrado, chamar `loadPreset(preset)` e setar `phase="editor"`
  - Se não encontrado, mostrar mensagem de erro ou manter phase="presets"
- Usar `usePresets` ou importar `presets` de `@/data/presets` diretamente

**Detalhes de implementação:**
- `data/presets.ts` já exporta `presets: SoulPreset[]` e `SoulPreset` do `store/soulStore.ts`
- `soul-editor.tsx` já tem função `handleSelectPreset` que faz `loadPreset` + `setSelectedPresetId` + setTimeout
- Só precisa de um `useEffect` que chama `handleSelectPreset` no mount se `initialPresetSlug` existir

### 3. `app/[locale]/preset/[slug]/page.tsx` — Nova rota para editor com preset

**Criar:** `app/[locale]/preset/[slug]/page.tsx`

Esta página simplesmente **redireciona** para `/editor?preset={slug}` usando `redirect()`
do Next.js. O editor com searchParam faz o trabalho pesado.

```tsx
import { redirect } from "next/navigation";

interface PresetPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default function PresetPage({ params }: PresetPageProps) {
  const { locale, slug } = await params;
  redirect(`/${locale}/editor?preset=${slug}`);
}
```

**Por que redirect e não renderizar direto?**
- Evita duplicar a lógica do SoulEditor em duas páginas
- Mantém `/editor?preset=X` como o único ponto de entrada para edição
- O redirect é instantâneo (server-side, 307 Temporary)

### 4. `app/presets/[slug]/SOUL.md/route.ts` — Nova rota SOUL.md

**Criar diretório + arquivo:** `app/presets/[slug]/SOUL.md/route.ts`

Importante: o diretório se chama `SOUL.md` (com ponto), que Next.js interpreta
como rota literal `/SOUL.md` no final da URL.

**Funcionamento:**
- Recebe GET com `slug` param
- Busca preset em `data/presets.ts` pelo `id`
- Gera SOUL.md usando `generateSoulMD(soulState)` de `lib/soulGenerator.ts`
- Retorna como `text/plain; charset=utf-8`

**A rota NÃO é prefixada com locale** porque:
- O middleware i18n exclui URLs com `.` (regex `.*\\..*`)
- `/presets/glados/SOUL.md` contém `.md` → middleware não processa
- Serve sem locale detection, ideal para LLMs

```ts
import { NextRequest, NextResponse } from "next/server";
import { presets } from "@/data/presets";
import { generateSoulMD } from "@/lib/soulGenerator";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  const preset = presets.find(p => p.id === slug);
  
  if (!preset) {
    return new NextResponse("404 Not Found", { status: 404 });
  }

  // Construir soul state do preset
  const soulState = {
    name: preset.name,
    creature: preset.creature,
    vibe: preset.vibe,
    emoji: preset.emoji,
    avatar: preset.avatar,
    description: preset.description,
    coreTruths: { ...preset.coreTruths },
    boundaries: { ...preset.boundaries },
    vibeStyle: preset.vibeStyle,
    humor: preset.humor ?? 50,
    formality: preset.formality ?? 50,
    emojiUsage: preset.emojiUsage ?? 50,
    verbosity: preset.verbosity ?? 50,
    consciousness: preset.consciousness ?? 50,
    questioning: preset.questioning ?? 50,
    continuity: preset.continuity ?? 50,
    openness: preset.openness ?? 50,
    conscientiousness: preset.conscientiousness ?? 50,
    extraversion: preset.extraversion ?? 50,
    agreeableness: preset.agreeableness ?? 50,
    neuroticism: preset.neuroticism ?? 50,
    // campos que não estão no preset usam defaults
    customCoreTruths: [],
    customBoundaries: [],
    signaturePhrases: [],
    knowledgeDomains: [],
    emotionalRange: 50,
    communicationMode: "balanced",
    speechPatterns: {
      alliteration: false,
      rhymeTendency: 50,
      metaphorFrequency: 50,
      sentenceLength: 50,
      vocabularyComplexity: 50,
    },
  };

  const md = generateSoulMD(soulState);
  
  return new NextResponse(md, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

### 5. `public/llms.txt` — Atualizar com links de presets

Adicionar seção com links para os SOUL.md de cada preset.

Como são 521 presets, o llms.txt vai ficar grande. Opções:
- Listar todos (pode ser muito longo)
- Listar os mais relevantes (categoria "anime", "mythology", "ai_digital", etc.)
- Usar seção "Optional" para presets menos importantes

O format do llms.txt:
```markdown
## Presets

- [GLaDOS](https://clawsouls.vercel.app/presets/glados/SOUL.md): AI research assistant with Portal personality
- [Jack](https://clawsouls.vercel.app/presets/j4ck/SOUL.md): Cyberpunk noir detective
- [Zen](https://clawsouls.vercel.app/presets/zen/SOUL.md): Enlightened AI meditation guide
...
```

**Estratégia:** Incluir todos os presets que têm avatar gerado (434 atuais),
ordenados alfabeticamente. Como são muitos, colocar na seção "Optional" para
que LLMs possam pular se não precisarem de contexto completo.

**Geração automática:** Usar script para gerar a lista a partir do JSON ou do
data/presets.ts, em vez de escrever manualmente.

---

## Fluxo final

```
/preset/glados
  → middleware i18n detecta locale, redireciona para /{locale}/preset/glados
  → app/[locale]/preset/[slug]/page.tsx redireciona para /{locale}/editor?preset=glados
  → app/[locale]/editor/page.tsx lê searchParams.preset="glados"
  → passa initialPresetSlug="glados" para <SoulEditor>
  → SoulEditor no mount carrega o preset da lista local
  → exibe editor diretamente (fase "editor", não "presets")

/presets/glados/SOUL.md
  → middleware i18n ignora (contém .md)
  → app/presets/[slug]/SOUL.md/route.ts
  → busca preset em data/presets.ts
  → gera markdown via generateSoulMD()
  → retorna text/plain
```

## Ordem de implementação

1. `app/[locale]/editor/page.tsx` — Adicionar searchParams
2. `components/soul-editor.tsx` — Adicionar initialPresetSlug prop
3. `app/[locale]/preset/[slug]/page.tsx` — Nova rota de redirect
4. `app/presets/[slug]/SOUL.md/route.ts` — Nova rota SOUL.md
5. `public/llms.txt` — Atualizar com links
