# 🤖 AGENTS.md — ClawSouls Development Workflow

> Como o ClawSouls é desenvolvido: sub-agentes paralelos, branches isolados, commits constantes.

---

## Modo de Trabalho

### Brainstorm → Sub-agentes → Merge

O desenvolvimento segue um ciclo claro:

1. **Brainstorm** (`brainstorm.md`) — backlog de features e ideias
2. **Crítica** (`criticas.md`) — análise de design, identificação de problemas
3. **Plano** (`docs/REFACTORING_PLAN.md`, `PLAN.md`) — tarefas priorizadas
4. **Execução** — sub-agentes trabalhando em paralelo em branches isolados
5. **Merge** — integração no `main` após validação

### Sub-agentes Paralelos

Cada tarefa grande vira um sub-agente com:
- **Branch própria** (nunca trabalha direto no `main`)
- **Commits atômicos** — um commit por mudança lógica
- **Push periódico** — a cada 5 minutos, no mínimo, para nunca perder trabalho
- **Build verification** — `npm run build` deve passar antes de commits grandes

### Regras de Branch

```
feat/*          — novas features
refactor/*      — refatorações de código/design
fix/*           — correções de bugs
test/*          — expansão de testes
docs/*          — documentação
```

### Regras de Commit

Formato: `tipo: descrição curta e clara`

Tipos:
- `feat:` — nova funcionalidade
- `refactor:` — mudança de código sem mudar comportamento
- `fix:` — correção de bug
- `test:` — novos testes ou correção de existentes
- `a11y:` — acessibilidade
- `perf:` — performance
- `chore:` — tarefas de manutenção (deps, gitignore, etc.)
- `docs:` — documentação

Exemplos:
```
feat: add Signature Phrases UI to Advanced tab
refactor: remove glassmorphism from cards, keep header only
test: add unit tests for historyStore (push, undo, redo, maxSize)
a11y: add aria-labels to editor controls
chore: add dist/ to gitignore
```

### Regras de Push

- **Push imediato** após cada commit
- **Push periódico** a cada 5 minutos (work in progress é melhor que trabalho perdido)
- Nunca acumular mais de 3 commits sem push

---

## Estrutura de Branches

```
main                          ← branch estável, sempre builda
├── feat/*                    ← features em desenvolvimento
├── refactor/*                ← refatorações
├── test/*                    ← expansão de testes
└── ...
```

### Merge Strategy

1. Sub-agente termina → faz push da branch
2. Verificar se build passa na branch
3. Merge no `main` via `git merge --no-ff`
4. Push do `main`
5. Deletar branch remota da feature

---

## Prioridades (baseado no Brainstorm)

### 🔥 Crítico (já feito ou em andamento)
- [x] Design system (OKLCH, Space Grotesk, light mode default)
- [x] Remover AI slop (glassmorphism, gradient text, Three.js)
- [x] Testes unitários (stores, components, generator)
- [ ] Signature Phrases UI + Emotional Range slider
- [ ] Acessibilidade WCAG 2.1 AA

### 🌟 Alto Impacto
- [ ] Editor progressive disclosure (simplificar tabs)
- [ ] Preset cards com CSS transitions (sem Framer Motion)
- [ ] Footer com créditos
- [ ] Loading states para rotas

### 🚀 Crescimento
- [ ] User auth (GitHub OAuth)
- [ ] Community gallery
- [ ] Discord bot
- [ ] VS Code extension

### ✨ Nice-to-have
- [ ] GPT-generated presets
- [ ] Voice sample TTS
- [ ] A/B test mode polish
- [ ] Arabic + RTL support

---

## Documentos de Referência

| Documento | Propósito |
|-----------|-----------|
| `brainstorm.md` | Backlog completo de features e ideias |
| `criticas.md` | Análise de design — o que está errado e por quê |
| `PLAN.md` | Roadmap com prioridades e próximos passos |
| `docs/DESIGN_SYSTEM.md` | Tokens visuais, paleta, tipografia, componentes |
| `docs/REFACTORING_PLAN.md` | 5 fases de refatoração detalhadas |
| `IMPLEMENTATION_SUMMARY.md` | Histórico do que foi implementado |
| `SUMMARY.md` | Visão geral do projeto |

---

## Setup para Sub-agentes

Quando criar um sub-agente para uma tarefa:

1. Definir branch name no task description
2. Incluir instrução explícita: "commit e push imediatamente, depois a cada 5 minutos"
3. Incluir verificação de build: "execute `npm run build` antes de commits grandes"
4. Especificar escopo de arquivos para evitar conflitos entre agentes
5. Cada sub-agente trabalha em arquivos diferentes quando possível

### Exemplo de Task

```
You are working on the ClawSouls project at /root/.openclaw/workspace/clawsouls

Your task: [descrição clara]

Steps:
1. Create a git branch: `git checkout -b feat/nome-da-feature`
2. [passos específicos]
3. After each change, commit: `git commit -m "feat: descrição"`
4. Push after each commit: `git push origin feat/nome-da-feature`
5. Verify build passes: `npm run build`
6. Continue working and pushing periodically

Work in the /root/.openclaw/workspace/clawsouls directory.
Commit after each meaningful change. Push constantly.
```

---

## Status Atual

**Versão:** 0.4.3
**Features implementadas:** ~42%
**Última atualização:** 2026-04-29

### Branches Ativas
_(atualizar conforme sub-agentes são criados)_

### Merged Recentemente
- `refactor/colors-typography` — paleta OKLCH, tipografia
- `refactor/home-presets-pages` — simplificação de páginas
- `refactor/editor-simplification` — progressive disclosure (WIP)
- `feat/unit-tests` — testes iniciais
- `feat/speech-patterns` — customização de padrões de fala
- `feat/fill-with-ai` — gerar vibe a partir de bullets
- `feat/ab-test-mode` — comparação lado a lado
- `feat/yaml-export` — exportação YAML

---

*Documento criado em 2026-04-29 por disconexo 🔩*
