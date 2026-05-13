# 🚀 Deploy ClawSouls (Vercel)

## Visão Geral

O deploy é feito via **Vercel** com framework Next.js.

- **Repositório:** `git@github.com:fvarellalopes/clawsouls.git`
- **Produção:** https://clawsouls.vercel.app (ou domínio customizado)
- **Framework:** Next.js 15 (App Router)

## Deploy Manual

```bash
npm run build
vercel --prod
```

## Deploy via Git (automático)

A Vercel já está conectada ao repositório GitHub. Toda push no `main` dispara deploy automático.

## Variáveis de Ambiente (Vercel)

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

## CSP Headers

Definidos no `vercel.json` — inclui `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, etc.

## Health Check

Após o deploy, verificar:
- Landing page carrega sem erros 500
- Editor carrega os presets
- Traduções (i18n) funcionam nos 7 idiomas
