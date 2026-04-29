# 🚀 Prompt de Inicialização — ClawSouls

> Use este prompt ao iniciar uma nova sessão para continuar o trabalho no ClawSouls.

---

## Instruções

Você é um agente trabalhando no projeto **ClawSouls** — um editor visual de SOUL.md para OpenClaw.

### 1. Setup do Ambiente

```bash
# Gerar chave SSH (se não existir)
ssh-keygen -t ed25519 -C "disconexo@openclaw" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
# ⚠️ O usuário precisa adicionar essa chave em https://github.com/settings/ssh/new

# Configurar git
git config --global user.name "disconexo"
git config --global user.email "disconexo@openclaw"

# Clonar repositório
cd /root/.openclaw/workspace
git clone git@github.com:fvarellalopes/clawsouls.git

# Instalar dependências
cd clawsouls && npm install

# Verificar build
npm run build

# Verificar testes
npm test
```

### 2. Leitura Obrigatória

Antes de qualquer trabalho, leia ESTES arquivos (na ordem):

```
1. AGENTS.md              ← Regras de trabalho, prioridades, modo de operação
2. brainstorm.md          ← Backlog completo de features
3. criticas.md            ← Análise de design — o que está errado
4. PLAN.md                ← Roadmap com prioridades
5. docs/DESIGN_SYSTEM.md  ← Tokens visuais, paleta, tipografia
6. docs/REFACTORING_PLAN.md ← 5 fases de refatoração
7. prompt.md              ← Este arquivo
```

### 3. Modo de Trabalho

**Brainstorm → Sub-agentes → Merge**

1. Consulte `brainstorm.md` e `PLAN.md` para saber o que fazer
2. Consulte `criticas.md` para saber o que corrigir
3. Crie sub-agentes para tarefas paralelas (cada um com branch própria)
4. Cada sub-agente DEVE:
   - Commitar imediatamente após cada mudança
   - Push a cada 5 minutos (nunca perder trabalho)
   - Verificar `npm run build` antes de commits grandes
   - Seguir o DESIGN_SYSTEM.md para decisões visuais

**Formato de commit:** `tipo: descrição curta`
- `feat:` nova feature | `refactor:` refatoração | `fix:` bugfix
- `test:` testes | `a11y:` acessibilidade | `perf:` performance
- `chore:` manutenção | `docs:` documentação

### 4. Estado Atual (atualizar conforme progresso)

**Versão:** 0.4.3
**Features implementadas:** ~42%+

**Concluído:**
- ✅ Design system (OKLCH, Space Grotesk, light mode default)
- ✅ Removido AI slop (glassmorphism, gradient text, Three.js)
- ✅ 229 testes unitários (stores, components, generator, edge cases)
- ✅ Signature Phrases UI + Emotional Range slider com validação
- ✅ Acessibilidade (aria-labels, semantic HTML, focus styles)
- ✅ Performance (React.memo, loading states, optimizePackageImports)
- ✅ Footer com créditos

**Próximas prioridades (ver PLAN.md):**
- Editor progressive disclosure (simplificar tabs)
- Export YAML format
- User auth (GitHub OAuth)
- Community gallery
- VS Code extension / OpenClaw plugin

### 5. Comandos Úteis

```bash
cd /root/.openclaw/workspace/clawsouls

# Desenvolvimento
npm run dev              # Servidor dev com turbopack
npm run build            # Build de produção
npm test                 # Rodar todos os testes
npm run lint             # Lint
npm run format           # Format com prettier

# Git
git status               # Ver mudanças
git log --oneline -10    # Ver commits recentes
git branch -a            # Ver branches
git push origin main     # Push para GitHub

# CLI do projeto
npx clawsouls list-presets
npx clawsouls search --query="detective"
```

### 6. Regras de Segurança

- NUNCA commitar `.env`, tokens, senhas
- NUNCA trabalhar direto no `main` para features grandes
- SEMPRE verificar build antes de push
- SEMPRE usar branches (`feat/*`, `refactor/*`, `test/*`)
- Deletar branches merged para manter o repo limpo

### 7. Estrutura do Projeto

```
clawsouls/
├── app/                  # Next.js App Router (rotas, layouts, API)
├── components/           # UI components (editor, preview, cards, ui/)
├── store/                # Zustand stores (soul, history, autoSave, myPresets)
├── data/                 # Presets database (300+ personagens)
├── lib/                  # Utilitários (soulGenerator, utils)
├── messages/             # i18n (en, pt, es, ja, zh, de, fr)
├── public/               # Assets estáticos
├── scripts/              # Scripts de setup e validação
├── docs/                 # Documentação (DESIGN_SYSTEM, REFACTORING_PLAN)
├── brainstorm.md         # Backlog de features
├── criticas.md           # Análise de design
├── PLAN.md               # Roadmap
├── AGENTS.md             # Regras de trabalho
└── prompt.md             # Este arquivo
```

---

**Nome:** disconexo 🔩
**Repo:** https://github.com/fvarellalopes/clawsouls
**Workspace:** /root/.openclaw/workspace/clawsouls

*Atualizado: 2026-04-29*
