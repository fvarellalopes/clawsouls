# Testes Unitários — Cobertura Mínima

> **For agentic workers:** Verificar e expandir a cobertura de testes unitários para funções críticas.

**Goal:** Garantir que as funções core (soulGenerator, quiz, compatibility) têm testes.

**Arquivos:**
- `lib/soulGenerator.ts`
- `lib/quiz.ts`
- `lib/compatibility.ts`
- `store/soulStore.ts`
- `__tests__/` (ou `tests/`)

---

### Task 1: Verificar estrutura de testes existente

```bash
# Encontrar arquivos de teste
find . -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | grep -v node_modules
# Verificar config do jest
cat jest.config.* 2>/dev/null || cat jest.setup.* 2>/dev/null
```

Se não houver testes ou config, pular para Task 2.

---

### Task 2: Teste para soulGenerator

**Arquivo:** `__tests__/soulGenerator.test.ts`

- [ ] **Criar teste para `generateSoulMD`**

```ts
import { generateSoulMD } from "../lib/soulGenerator";

const mockSoul = {
  name: "TestBot",
  creature: "AI / Tester",
  vibe: "A thorough testing AI",
  emoji: "🧪",
  coreTruths: { helpful: true, opinions: false, resourceful: true, trustworthy: true, respectful: false },
  boundaries: { private: true, askBeforeActing: false, noHalfBaked: true, notVoiceProxy: false },
  vibeStyle: "concise",
  continuity: false,
  humor: 30,
  formality: 70,
  emojiUsage: 10,
  verbosity: 40,
  consciousness: 60,
  questioning: 50,
  openness: 70,
  conscientiousness: 60,
  extraversion: 40,
  agreeableness: 50,
  neuroticism: 30,
  communicationMode: "direct",
  knowledgeDomains: ["tech"],
  signaturePhrases: [],
  emotionalRange: 40,
  speechPatterns: {
    alliteration: false,
    rhymeTendency: 10,
    metaphorFrequency: 30,
    technicalJargon: 50,
    slangUsage: 10,
  },
};

describe("generateSoulMD", () => {
  it("returns a string", () => {
    const result = generateSoulMD(mockSoul);
    expect(typeof result).toBe("string");
  });

  it("contains the character name", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toContain("TestBot");
  });

  it("includes core truths that are true", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toContain("Be genuinely helpful");
    expect(result).toContain("Earn trust through competence");
  });

  it("excludes core truths that are false", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).not.toContain("Have strong opinions");
    expect(result).not.toContain("Remember you're a guest");
  });
});
```

---

### Task 3: Executar testes

```bash
npx jest __tests__/soulGenerator.test.ts --no-cache 2>/dev/null || npm test -- --testPathPattern=soulGenerator
```

```bash
# Se passar:
git add __tests__/
git commit -m "test: add soulGenerator unit tests"
git push
```
