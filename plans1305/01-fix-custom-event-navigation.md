# Fix CustomEvent Navigation em My Presets e Quiz

> **For agentic workers:** Corrige o padrão `CustomEvent` + `router.push("/editor")` que não funciona porque o evento morre na navegação.

**Goal:** Substituir `window.dispatchEvent(new CustomEvent("load-soul-preset"))` + `router.push("/editor")` por `router.push(\`/editor?preset=${id}\`)` em todas as páginas que usam esse padrão.

**Arquivos afetados:**
- `app/[locale]/my-presets/page.tsx`
- `app/[locale]/quiz/page.tsx`

---

### Task 1: My Presets — handleLoad

**Arquivo:** `app/[locale]/my-presets/page.tsx:24-28`

- [ ] **Substituir o dispatch por query param**

```tsx
const handleLoad = (soul: any) => {
  // Precisa do ID do preset para passar na URL
  const presetId = soul.id || soul.name?.toLowerCase().replace(/\s+/g, '-');
  router.push(`/editor?preset=${presetId}`);
};
```

**NOTA:** O `soul` salvo em `MyPresetsStore` tem shape `{ id, name, creature, vibe, ... }`. O `id` pode ser o mesmo usado em `data/presets.ts`. Usar `soul.id` quando disponível, fallback para slug do nome.

---

### Task 2: Quiz — handleLoadPreset

**Arquivo:** `app/[locale]/quiz/page.tsx:66-69`

- [ ] **Substituir o dispatch por query param**

```tsx
const handleLoadPreset = (preset: SoulPreset) => {
  router.push(`/editor?preset=${preset.id}`);
};
```

```bash
# Após as duas alterações:
npm run build
# Verificar: ✓ Compiled successfully
```
