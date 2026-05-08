# Image Generation — Batch Avatar Pre-Generation (Colab)

**Author:** disconexo  
**Date:** 2026-05-08  
**Status:** Draft  
**Scope:** Batch avatar generation pipeline using Colab GPU → static assets for Clawsouls

---

## 1. Contexto e Objetivo

O Clawsouls atualmente usa avatares SVG do DiceBear (URLs externas por seed). O objetivo é **pré-gerar avatares únicos** para todos os presets existentes (e futuros), usando Stable Diffusion XL rodando em GPU no Google Colab. Os avatares gerados serão commitados como assets estáticos no projeto.

### Por que batch?
- Elimina dependência de runtime GPU em produção
- Sem necessidade de API serverless proxy
- Zero latency no frontend (assets locais via CDN/Vercel)
- Avatares consistentes e versionados no git

### Restrições
- Colab GPU limitada (T4 ~15GB VRAM) — batch deve ser sequencial
- Modelo SDXL base (~6.5GB) + VAE + tokenizer cabem em T4 16GB
- Cada geração leva ~10-30s dependendo dos steps

---

## 2. Arquitetura

```
┌──────────────────┐     ┌────────────────────┐     ┌──────────────────┐
│  Google Colab     │     │  Script batch       │     │  Repositório      │
│  (GPU T4)         │     │  collab_batch_gen.py│     │  (assets/avatars) │
│                   │     │                     │     │                   │
│  - SDXL model     │────▶│  - Lê presets.json  │────▶│  - avatar/NAME.png│
│  - diffusers      │     │  - Gera 1 por 1     │     │  - commit + push  │
│  - FastAPI (opt)  │     │  - Salva em disco   │     │                   │
└──────────────────┘     └────────────────────┘     └──────────────────┘

┌──────────────────┐     ┌────────────────────┐
│  Clawsouls App    │     │  Frontend           │
│                   │     │                     │
│  assets/avatars/  │◀────│  src/avatar/N.png   │
│  (public/static)  │     │  <img src> local    │
└──────────────────┘     └────────────────────┘
```

**Fluxo:**
1. Rodar Colab → executa `collab_batch_gen.py`
2. Script lê todos os presets do repo (ou Supabase)
3. Para cada preset: monta prompt → gera imagem → salva como PNG
4. Imagens salvas em `public/avatars/`
5. Commit + push dos assets gerados
6. Frontend referencia `avatar/NOME.png` locais

---

## 3. Colab Script — Batch Generation

### `collab_batch_gen.py`

```python
"""
ClawSouls Avatar Generator — Batch Mode
Google Colab (GPU runtime required: Runtime > Change runtime type > T4 GPU)

Usage:
  1. Upload this script to Colab
  2. Run all cells
  3. Download the generated avatars folder
  4. Copy to /public/avatars/ in the Clawsouls repo
"""

import json
import os
import base64
import io
import hashlib
import time
from pathlib import Path

import torch
from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler
from PIL import Image
import requests

# ═══════════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════════

MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"
OUTPUT_DIR = "/content/avatars"
SEED_BASE = 42

# Prompt configs
DEFAULT_STEPS = 25
DEFAULT_GUIDANCE = 7.5

# ═══════════════════════════════════════════════════════════════════
# PROMPT ENGINE (mirrors lib/avatarEngine.ts logic)
# ═══════════════════════════════════════════════════════════════════

EMOJI_HINTS = {
    "🔬": "scientific goggles, lab coat details",
    "🕵️": "detective hat, trench coat",
    "🌟": "sparkles, star-shaped accessories",
    "⚡": "electric energy aura, lightning motifs",
    "🧘": "lotus position, meditation beads, serene",
    "🤖": "mechanical parts, circuit patterns",
    "🏴‍☠️": "pirate bandana, adventurous look",
    "💻": "techwear, holographic screen elements",
    "🎤": "microphone, stage lights, glamorous",
    "🌳": "nature elements, leaves, organic flowing design",
    "🕶️": "sunglasses, cool demeanor",
    "😈": "mischievous grin, horns, dark aesthetic",
    "👽": "alien features, cosmic glow",
    "🐉": "dragon scales, mythical aura",
    "🦊": "fox ears, cunning expression",
    "🐱": "cat ears, playful whiskers",
    "👁️": "mystical third eye, all-seeing aura",
    "💀": "skull motifs, dark mysticism",
    "🎭": "theater mask, dramatic duality",
}

DOMAIN_ACCENTS = {
    "tech": "circuit patterns, holographic UI elements",
    "philosophy": "ancient scrolls, ethereal glow",
    "science": "molecular structures, lab equipment details",
    "arts": "paint splashes, creative chaos",
    "history": "ancient runes, time-worn textures",
    "literature": "floating text, book pages",
    "pop-culture": "retro gaming elements, neon signs",
    "sports": "athletic build, competitive energy",
    "business": "sharp suit, corporate confidence",
    "psychology": "thoughtful gaze, abstract mind visuals",
}


def build_prompt(soul: dict) -> str:
    """Convert soul attributes to an SDXL prompt."""
    name = soul.get("name", "Unknown")
    creature = soul.get("creature", "mysterious entity")
    vibe = soul.get("vibe", "enigmatic")
    emoji = soul.get("emoji", "")
    humor = soul.get("humor", 50)
    formality = soul.get("formality", 50)
    emoji_usage = soul.get("emojiUsage", 30)
    openness = soul.get("openness", 70)
    conscientiousness = soul.get("conscientiousness", 50)
    extraversion = soul.get("extraversion", 50)
    agreeableness = soul.get("agreeableness", 50)
    neuroticism = soul.get("neuroticism", 30)
    vibe_style = soul.get("vibeStyle", "concise")
    knowledge_domains = soul.get("knowledgeDomains", [])
    emotional_range = soul.get("emotionalRange", 50)
    communication_mode = soul.get("communicationMode", "direct")

    # Art style selection
    is_high_formality = formality > 65
    is_playful = humor > 65
    is_minimal = vibe_style in ("minimal", "concise")
    is_dramatic = emotional_range > 75 or vibe_style == "dramatic"
    is_tech = any(d in ("tech", "science") for d in knowledge_domains)

    art_style = "cyberpunk digital illustration"
    if is_high_formality:
        art_style = "elegant digital painting, Renaissance lighting"
    elif is_playful:
        art_style = "colorful anime-inspired digital art, vibrant"
    elif is_minimal:
        art_style = "minimalist vector art, clean lines, geometric"
    elif is_tech:
        art_style = "sci-fi concept art, holographic elements"
    elif is_dramatic:
        art_style = "cinematic digital painting, dramatic chiaroscuro lighting"

    # Mood/atmosphere
    atmosphere = "dark atmospheric background with neon accents"
    if agreeableness > 70:
        atmosphere = "warm, inviting background with soft golden light"
    elif neuroticism > 60:
        atmosphere = "unstable, glitching background with fractured light"
    elif extraversion > 70:
        atmosphere = "dynamic, energetic background with bold colors"
    elif openness > 75:
        atmosphere = "dreamy, surreal background with cosmic elements"

    # Expression
    expression = "calm, confident expression"
    if neuroticism > 60:
        expression = "tense, alert expression"
    elif extraversion > 70:
        expression = "bright, engaging smile"
    elif agreeableness > 70:
        expression = "gentle, warm expression"
    elif openness > 70:
        expression = "curious, contemplative gaze"
    elif humor > 70:
        expression = "sly, playful smirk"

    # Build descriptor list
    descriptors = [creature, vibe]

    if expression != "calm, confident expression":
        descriptors.append(expression)

    descriptors.append(art_style)

    if vibe_style not in ("concise", "minimal"):
        descriptors.append(f"vibe: {vibe_style}")

    # Emoji → visual hint
    if emoji and emoji in EMOJI_HINTS:
        descriptors.append(EMOJI_HINTS[emoji])

    # Domain accents
    for domain in knowledge_domains:
        if domain in DOMAIN_ACCENTS:
            descriptors.append(DOMAIN_ACCENTS[domain])

    # Unique seed-based micro-variation descriptor
    descriptors.append("unique, one-of-a-kind character design")

    prompt = (
        f"close-up portrait, centered, detailed face, "
        f"professional character art of {descriptors[0]}, "
        f"{', '.join(descriptors[1:])}, "
        f"{atmosphere}, highly detailed, 4k, masterpiece"
    )

    return prompt.strip()


def build_negative_prompt() -> str:
    return (
        "blurry, low quality, deformed, ugly, duplicate, disfigured, "
        "bad anatomy, bad proportions, extra limbs, mutated hands, "
        "text, watermark, signature, logo, "
        "photorealistic, 3d render, "
        "nude, NSFW, gore"
    )


# ═══════════════════════════════════════════════════════════════════
# LOAD PRESETS
# ═══════════════════════════════════════════════════════════════════

def load_presets_from_github(repo_raw_url: str = None) -> list:
    """
    Load presets from GitHub raw URL.
    Default: load from local presets.ts data.
    """
    if repo_raw_url:
        resp = requests.get(repo_raw_url, timeout=30)
        resp.raise_for_status()
        # Need to extract from the export
        data = resp.json()
        return data.get("presets", data) if isinstance(data, dict) else data

    # Fallback: try local file
    local_paths = [
        "/content/data/presets.ts",
        "/content/presets.ts",
        "data/presets.ts",
    ]
    for path in local_paths:
        if os.path.exists(path):
            with open(path) as f:
                content = f.read()
            # Parse the `export const presets: SoulPreset[] = [...]` section
            # Quick regex extraction
            import re
            presets_text = re.search(
                r"export const presets:\s*SoulPreset\[\]\s*=\s*(\[.*?\]);",
                content,
                re.DOTALL,
            )
            if presets_text:
                return json.loads(presets_text.group(1).replace("'", '"'))
    raise FileNotFoundError("Could not find presets.ts")


def load_presets_from_supabase(supabase_url: str, supabase_key: str) -> list:
    """Load presets directly from Supabase."""
    import requests
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
    }
    resp = requests.get(f"{supabase_url}/rest/v1/presets", headers=headers)
    resp.raise_for_status()
    return resp.json()


# ═══════════════════════════════════════════════════════════════════
# GENERATION
# ═══════════════════════════════════════════════════════════════════

def generate_avatar(pipe, soul: dict, output_path: str, index: int, total: int):
    """Generate a single avatar and save to disk."""
    name = soul.get("name", f"soul_{index}")
    safe_name = "".join(c if c.isalnum() or c in "._-" else "_" for c in name)

    prompt = build_prompt(soul)
    negative = build_negative_prompt()

    print(f"\n{'='*60}")
    print(f"[{index+1}/{total}] Generating: {name}")
    print(f"  Creature: {soul.get('creature', 'N/A')}")
    print(f"  Vibe: {soul.get('vibe', 'N/A')[:60]}...")
    print(f"  Prompt: {prompt[:100]}...")
    print(f"{'='*60}")

    start = time.time()

    generator = torch.Generator(device="cuda")
    generator.manual_seed(SEED_BASE + index)

    image = pipe(
        prompt=prompt,
        negative_prompt=negative,
        num_inference_steps=DEFAULT_STEPS,
        guidance_scale=DEFAULT_GUIDANCE,
        width=512,
        height=768,
        generator=generator,
    ).images[0]

    elapsed = time.time() - start

    # Save
    os.makedirs(output_path, exist_ok=True)
    filepath = os.path.join(output_path, f"{safe_name}.png")
    image.save(filepath, "PNG")

    print(f"  ✅ Saved: {filepath} ({elapsed:.1f}s)")
    return filepath


def main():
    print("=" * 60)
    print("🖼️  ClawSouls Avatar Generator — Batch Mode")
    print("=" * 60)

    # Check GPU
    if not torch.cuda.is_available():
        print("❌ No GPU available! Use Runtime > Change runtime type > T4 GPU")
        return

    print(f"✅ GPU: {torch.cuda.get_device_name(0)}")
    print(f"   VRAM: {torch.cuda.get_device_properties(0).total_mem / 1e9:.1f} GB")

    # Load model
    print(f"\n📦 Loading model: {MODEL_ID}")
    pipe = StableDiffusionXLPipeline.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True,
    )

    # Optimize for T4
    pipe.enable_attention_slicing()
    pipe.enable_vae_tiling()
    pipe = pipe.to("cuda")

    print("✅ Model loaded and optimized for T4\n")

    # Load presets
    source = os.environ.get("PRESET_SOURCE", "local")
    print(f"📋 Loading presets from: {source}")

    if source == "supabase":
        presets = load_presets_from_supabase(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_KEY"],
        )
    else:
        # Try GitHub raw first
        try:
            presets = load_presets_from_github(
                "https://raw.githubusercontent.com/ClawdAI2-brazil/clawsouls/main/data/presets.ts"
            )
        except Exception:
            presets = load_presets_from_github()

    print(f"✅ Loaded {len(presets)} presets\n")

    # Generate
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    generated = []
    failed = []

    for i, preset in enumerate(presets):
        try:
            filepath = generate_avatar(pipe, preset, OUTPUT_DIR, i, len(presets))
            generated.append({"name": preset.get("name"), "file": filepath})
        except Exception as e:
            print(f"  ❌ Failed: {e}")
            failed.append({"name": preset.get("name"), "error": str(e)})

        # Free VRAM between generations
        torch.cuda.empty_cache()

    # Summary
    print("\n" + "=" * 60)
    print(f"📊 RESULTS: {len(generated)} generated, {len(failed)} failed")
    print(f"📁 Output: {OUTPUT_DIR}")

    if failed:
        print("\nFailed presets:")
        for f in failed:
            print(f"  ❌ {f['name']}: {f['error']}")

    # Save manifest
    manifest_path = os.path.join(OUTPUT_DIR, "_manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(generated, f, indent=2)
    print(f"\n📋 Manifest saved: {manifest_path}")

    # Create a tarball for easy download
    import tarfile
    tar_path = "/content/avatars.tar.gz"
    with tarfile.open(tar_path, "w:gz") as tar:
        for item in generated:
            tar.add(item["file"], arcname=os.path.basename(item["file"]))
    print(f"📦 Archive: {tar_path}")
    print("\n✅ Done! Copy avatars to public/avatars/ in your repo.")


if __name__ == "__main__":
    main()
```

### Células do Colab

```
# Célula 1: Instalação (~5 min)
!pip install -q diffusers transformers accelerate torch torchvision \
  pillow safetensors omegaconf

# Célula 2: Download do modelo (~5 min, ~6.5GB)
import torch
from diffusers import StableDiffusionXLPipeline
pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16,
    variant="fp16",
    use_safetensors=True,
)
print("Model downloaded and ready!")

# Célula 3: Upload do script e execução
# (no Colab, use o upload manual ou monte o Google Drive)
# from google.colab import files
# uploaded = files.upload()
# !python collab_batch_gen.py
```

---

## 4. Estrutura de Assets

```
clawsouls/
├── public/
│   └── avatars/
│       ├── jack.png
│       ├── doc.png
│       ├── glados.png
│       ├── zen.png
│       ├── radd.png
│       ├── pony.png
│       ├── kira.png
│       ├── dev.png
│       ├── sage.png
│       ├── luffy.png
│       ├── spike.png
│       ├── yoda.png
│       ├── geralt.png
│       └── _manifest.json
├── src/
│   └── lib/
│       └── avatar.ts          # Utilitário para resolver avatar URLs
├── collab_batch_gen.py         # Script de geração batch
└── ...
```

### `src/lib/avatar.ts`

```typescript
import type { SoulState } from "@/store/soulStore";

const DEFAULT_AVATAR = "/placeholder-avatar.png"; // fallback genérico

/**
 * Resolve a local avatar URL based on the soul's name.
 * Falls back to a generic avatar if none exists.
 */
export function resolveAvatarUrl(soul: SoulState["soul"]): string {
  if (!soul.name) return DEFAULT_AVATAR;
  return `/avatars/${soul.name.toLowerCase().replace(/\s+/g, "")}.png`;
}
```

---

## 5. Frontend Integration

### 5.1 Atualizar `soulStore.ts`

Remover o campo `avatar?: string` do estado editável (passa a ser derivado):

```typescript
// Remover `avatar` do estado editável
// Avatar agora é derivado do nome: /avatars/{nome}.png
```

Ou manter `avatar` como campo opcional para overrides (avatar customizado).

### 5.2 Atualizar uso de avatar no frontend

Onde quer que `soul.avatar` ou `preset.avatar` seja usado:

```tsx
// ANTES (DiceBear):
// <img src={preset.avatar} />

// DEPOIS (assets locais):
import { resolveAvatarUrl } from "@/lib/avatar";
<img src={resolveAvatarUrl(soul)} />
```

### 5.3 Adicionar placeholder

Criar um avatar placeholder (`public/placeholder-avatar.png`) para presets que ainda não têm avatar gerado.

---

## 6. Workflow de Regeneração

Quando novos presets forem adicionados:

1. Editar `data/presets.ts` com o novo preset
2. Rodar o script no Colab novamente
3. Novos avatares são gerados e adicionados à pasta
4. Commit + push dos novos PNGs

```bash
# Script auxiliar para verificar cobertura
# Verifica se todos os presets têm avatar correspondente
node scripts/check-avatar-coverage.js
```

---

## 7. Alternativas Consideradas

### Abordagem A: Geração on-the-fly via API (descartada)
- ❌ Mantém dependência de Colab rodando 24/7
- ❌ Latência de ~10-30s por request
- ❌ Colab desconecta após limite de tempo

### Abordagem B: Hugo/CDN + modelo fine-tuned (descartada)
- ❌ Overkill para o estágio atual
- ❌ Requer fine-tuning que consome mais VRAM

### Abordagem C: Batch pre-generation (**escolhida**)
- ✅ Zero runtime dependency no Colab
- ✅ Assets versionados no git
- ✅ Instantâneo no frontend
- ✅ Simplicidade operacional

---

## 8. Próximos Passos

1. ~~Criar design document~~ ✅
2. Criar `collab_batch_gen.py` (script batch)
3. Criar `src/lib/avatar.ts` (resolver URLs)
4. Atualizar `soulStore.ts` (remover/ajustar campo avatar)
5. Atualizar componentes que usam avatar (soul-editor, preset-card, soul-preview)
6. Criar placeholder avatar
7. Rodar batch no Colab e commitar assets
8. Atualizar `.env.example` e `README.md`