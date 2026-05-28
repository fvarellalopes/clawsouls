# Loading States Consistentes

> **For agentic workers:** Garantir que todas as páginas tenham loading states adequados.

**Goal:** Verificar se todas as rotas com dados assíncronos têm `loading.tsx` ou fallback UI.

**Arquivos a verificar:**
- `app/[locale]/presets/loading.tsx`
- `app/[locale]/editor/loading.tsx`
- `app/[locale]/quiz/loading.tsx`
- `app/[locale]/my-presets/loading.tsx`
- `app/[locale]/achievements/loading.tsx`
- `app/[locale]/compare/loading.tsx`
- `app/[locale]/preset/[slug]/loading.tsx`

---

### Task 1: Verificar quais páginas têm loading.tsx

```bash
ls -la app/\[locale\]/*/loading.tsx 2>/dev/null
```

Páginas que precisam de loading (dados assíncronos):
- `/presets` — usa `usePresets()` hook (fetch)
- `/editor` — carrega SoulEditor
- `/quiz` — carrega presets via `usePresets()`
- `/my-presets` — carrega do localStorage (instantâneo, talvez não precise)
- `/achievements` — store local (instantâneo)
- `/compare` — carrega presets do `data/presets.ts`
- `/preset/[slug]` — server component com async data

---

### Task 2: Criar loading.tsx para os que faltam

- [ ] **Criar `app/[locale]/preset/[slug]/loading.tsx`** se não existir

```tsx
export default function PresetDetailLoading() {
  return (
    <div className="min-h-screen bg-surface-dim animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="h-4 w-48 bg-white/10 rounded mb-8" />
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-64 aspect-square rounded-2xl bg-white/10" />
          <div className="flex-1 space-y-4">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-8 w-64 bg-white/10 rounded" />
            <div className="h-4 w-48 bg-white/10 rounded" />
            <div className="h-20 w-full bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

```bash
npm run build
git add app/[locale]/preset/[slug]/loading.tsx
git commit -m "feat: add loading state for preset detail page"
git push
```
