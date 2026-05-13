# Otimização do Bundle de Traduções nas Share Pages

> **For agentic workers:** Reduzir o bundle size das páginas `/share` e `/share/[id]` que importam todos os 7 arquivos de tradução.

**Goal:** Eliminar o carregamento de 7 arquivos JSON (~1.9MB total) nas share pages, carregando apenas o locale detectado.

**Arquivos:**
- `app/share/page.tsx`
- `app/share/[id]/page.tsx`

---

### Task 1: Refatorar import de mensagens

**Arquivo:** `app/share/page.tsx` (e `app/share/[id]/page.tsx`)

- [ ] **Substituir imports estáticos por dynamic import**

```tsx
// ANTES (importa todos os 7 JSONs):
import enMessages from "@/messages/en.json";
import ptMessages from "@/messages/pt.json";
// ...7 imports

// DEPOIS (dynamic import apenas do locale detectado):
import { useEffect, useState } from "react";
import type { AbstractIntlMessages } from "next-intl";

// Mapa de locale para import dinâmico
const localeLoaders: Record<string, () => Promise<{ default: AbstractIntlMessages }>> = {
  en: () => import("@/messages/en.json"),
  pt: () => import("@/messages/pt.json"),
  es: () => import("@/messages/es.json"),
  fr: () => import("@/messages/fr.json"),
  de: () => import("@/messages/de.json"),
  ja: () => import("@/messages/ja.json"),
  zh: () => import("@/messages/zh.json"),
};

function detectLocale(): string {
  if (typeof window === "undefined") return "en";
  const lang = navigator.language?.split("-")[0];
  return localeLoaders[lang] ? lang : "en";
}

// No componente:
const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);

useEffect(() => {
  const locale = detectLocale();
  localeLoaders[locale]?.().then(mod => setMessages(mod.default));
}, []);

if (!messages) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

return (
  <NextIntlClientProvider locale={detectLocale()} messages={messages}>
    {/* ... */}
  </NextIntlClientProvider>
);
```

```bash
npm run build
# Verificar: bundle size analysis
# ANTES: ~390kB first load JS (includes all locales)
# DEPOIS: ~105kB shared + locale chunk (carregado sob demanda)
git add app/share/page.tsx app/share/[id]/page.tsx
git commit -m "perf: dynamic locale imports in share pages"
git push
```
