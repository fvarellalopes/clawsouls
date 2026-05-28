# Otimização de Imagens (WebP + Lazy Loading)

> **For agentic workers:** Adicionar lazy loading nativo e conversão para WebP nos avatares.

**Goal:** Melhorar performance de carregamento das imagens de avatar usando lazy loading nativo e formato WebP.

**Arquivos:**
- Modificar: `lib/avatar.ts`
- Modificar: `components/preset-card.tsx`

---

### Task 1: Atualizar helper avatarUrl

**Arquivo:** `lib/avatar.ts`

- [ ] **Adicionar suporte a WebP nos paths**

```tsx
export function avatarUrl(preset: { avatar?: string; id?: string; name?: string }): string {
  if (preset.avatar) return preset.avatar;
  const id = preset.id || preset.name?.toLowerCase().replace(/\s+/g, '-');
  // Tentar WebP primeiro, fallback para PNG
  return `/avatars/${id}.webp`; // servidor pode servir PNG se WebP não existir
}
```

```bash
# Verificar se os avatares existem em PNG
ls public/avatars/*.png 2>/dev/null | head -3
```

---

### Task 2: Adicionar lazy loading ao PresetCard

**Arquivo:** `components/preset-card.tsx`

- [ ] **Adicionar atributos `loading="lazy"` e `decoding="async"`**

```tsx
<img
  src={avatarUrl(preset) || preset.avatar}
  alt={preset.name}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 rounded"
/>
```

```bash
npm run build
git add lib/avatar.ts components/preset-card.tsx
git commit -m "perf: add lazy loading and WebP support for avatars"
git push
```
