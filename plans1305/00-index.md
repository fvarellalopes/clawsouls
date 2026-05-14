# Plano Técnico ClawSouls — 13 de Maio de 2026

## Análise do App — Resumo Executivo

**Versão atual:** 0.5.1
**Presets:** 516 personagens
**Idiomas:** 7 (en, pt, es, fr, de, ja, zh)
**Avatares gerados:** 526

---

## Prioridades

### 🔴 Crítico (quebrado agora)
| # | Problema | Plano |
|---|---|---|
| 1 | My Presets + Quiz usam `CustomEvent` quebrado | `01-fix-custom-event-navigation.md` |
| 2 | Avatares pipeline (526 gerados, pipeline concluída) | `02-avatars-pipeline.md` |
| 3 | `metadataBase` não configurado (SEO quebrado) | `03-seo-metadata.md` |

### 🟡 Melhoria
| # | Melhoria | Plano |
|---|---|---|
| 4 | Página de detalhe do preset (hoje só redirect) | `04-preset-detail-page.md` |
| 5 | Lazy loading + WebP para imagens | `05-image-optimization.md` |
| 6 | Loading states consistentes | `06-loading-states.md` |

### 🔵 Otimização
| # | Otimização | Plano |
|---|---|---|
| 7 | Share pages carregam todos os 7 JSONs de tradução | `07-share-page-bundle.md` |
| 8 | Testes unitários para funções core | `08-unit-tests.md` |

---

## Estrutura de Arquivos Modificados

```
app/
├── [locale]/
│   ├── my-presets/page.tsx         ← 01 (fix CustomEvent)
│   ├── quiz/page.tsx               ← 01 (fix CustomEvent)
│   ├── preset/[slug]/page.tsx      ← 04 (novo detail page)
│   ├── preset/[slug]/loading.tsx   ← 06 (novo)
│   └── layout.tsx                  ← 03 (metadataBase)
├── share/
│   ├── page.tsx                    ← 07 (dynamic imports)
│   └── [id]/page.tsx               ← 07 (dynamic imports)
components/
├── preset-card.tsx                 ← 05 (loading="lazy")
├── preset-detail.tsx               ← 04 (novo)
lib/
├── avatar.ts                       ← 05 (WebP support)
data/
└── presets.ts                      ← (referência para prompts)
public/
└── avatars/                        ← 02 (gerar imagens)
__tests__/
└── soulGenerator.test.ts           ← 08 (novo)
next.config.mjs                     ← 03 (se existir)
```

---

## Ordem de Execução Recomendada

1. **01** → Fix CustomEvent (5 min) → commit
2. **03** → metadataBase (5 min) → commit
3. **06** → loading states (10 min) → commit
4. **05** → image optimization (10 min) → commit
5. **04** → preset detail page (20 min) → commit
6. **07** → share page bundle (15 min) → commit
7. **08** → unit tests (20 min) → commit
8. **02** → avatar pipeline (Colab) → commits conforme geração

**Tempo estimado total (1-7): ~1.5h de código**
**Tempo estimado (2 - avatares): ~4-6h de GPU Colab**
