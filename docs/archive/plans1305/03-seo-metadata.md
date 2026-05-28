# Configurar metadataBase e SEO

> **For agentic workers:** Configurar `metadataBase` no `next.config` e melhorar metatags Open Graph para SEO.

**Goal:** Eliminar warning `metadataBase property is not set` e garantir que Open Graph images usem URL de produção.

**Arquivos:**
- `next.config.mjs` (ou `next.config.ts`)
- `app/[locale]/layout.tsx`
- `app/sitemap.ts`
- `app/robots.ts`

---

### Task 1: Configurar metadataBase

- [ ] **Verificar se existe `next.config.mjs` ou `next.config.ts`**

```bash
ls -la next.config.*
```

- [ ] **Adicionar `metadataBase` no config**

Se `next.config.mjs`:
```mjs
const nextConfig = {
  // ... existing config
  experimental: {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://clawsouls.vercel.app'),
  },
};
```

Se não existir experimental.metadataBase, usar no layout:
```tsx
// app/[locale]/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://clawsouls.vercel.app'),
  // ...
};
```

- [ ] **Rodar build e verificar se o warning sumiu**

```bash
npm run build 2>&1 | grep -i "metadataBase"
# Expected: no output (warning gone)
```

---

### Task 2: Open Graph images por preset (opcional)

- [ ] **Adicionar `generateMetadata` dinâmico para páginas de preset**

```tsx
// app/[locale]/preset/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return {
    openGraph: {
      title: `ClawSouls — ${slug}`,
      description: `Customize the ${slug} AI personality preset.`,
      images: [`/avatars/${slug}.png`],
    },
  };
}
```

```bash
npm run build
git add next.config.mjs app/[locale]/preset/[slug]/page.tsx
git commit -m "chore: configure metadataBase and OG images"
git push
```
