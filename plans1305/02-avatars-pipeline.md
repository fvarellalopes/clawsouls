# Gerar Avatares Restantes (Z-Image-Turbo + Colab)

> **For agentic workers:** Continuar a geração em lote dos avatares ClawSouls via pipeline Z-Image-Turbo no Google Colab.

**Goal:** Gerar avatares ClawSouls via Z-Image-Turbo FP8 no Colab. **Total gerado: 526 avatares.**

**Arquitetura:**
- Colab notebook com FastAPI + cloudflared tunnel
- ZImagePipeline (bfloat16, CFG=0, 8 steps, 1024x1024 → crop 512x768)
- Script `gen_batch.py` faz requests com delay de 1 min entre cada
- Imagens salvas em `public/avatars/`

**Arquivos:**
- `gen_batch.py`
- `scripts/scan-avatars.mjs`
- `public/avatars/`
- `data/presets.ts` (para prompts)

---

### Task 1: Verificar estado atual

- [ ] **Contar quantos avatares existem vs prompts disponíveis**

```bash
ls public/avatars/*.png 2>/dev/null | wc -l
# Comparar com total de presets que têm prompt
grep -c '"prompt"' data/presets.ts
```

- [ ] **Verificar último avatar gerado e continuar de onde parou**

```bash
ls -t public/avatars/*.png | head -5
```

---

### Task 2: Subir notebook Colab

- [ ] **Abrir Google Colab e criar novo notebook com runtime T4 GPU**
- [ ] **Executar células de instalação:**
  - `diffusers`, `transformers`, `torch`, `accelerate`
  - `fastapi`, `uvicorn`, `pyngrok` ou `cloudflared`
- [ ] **Carregar modelo Z-Image-Turbo FP8** (`Z-Image-Turbo-T5B-FP8`)

---

### Task 3: Iniciar FastAPI + tunnel

- [ ] **Iniciar `server.py` com FastAPI na porta 8081**
- [ ] **Iniciar cloudflared tunnel**
- [ ] **Verificar healthcheck:** `curl <tunnel-url>/health`

---

### Task 4: Rodar gen_batch.py

- [ ] **Executar script de geração em lote**

```bash
python gen_batch.py --tunnel-url <URL> --token $CLAWSOULS_TOKEN --start <N> --count 50
```

Delay entre requests: 60s (40s geração + 20s margem)

---

### Task 5: Verificar e commitar avatares

```bash
git add public/avatars/
git commit -m "feat: add batch-generated avatars (N novos)"
git push
```
