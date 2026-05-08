# Image Generation — Colab + Clawsouls Integration

**Author:** disconexo  
**Date:** 2026-05-08  
**Status:** Draft  
**Scope:** Avatar image generation pipeline using Colab GPU + Clawsouls frontend/backend

---

## 1. Contexto e Objetivo

O Clawsouls atualmente usa avatares SVG do DiceBear (URLs estáticas por seed). O objetivo é substituir/complementar isso com **avatares gerados por IA** baseados nos atributos de personalidade da soul (creature, vibe, Big Five, tone attributes), usando um modelo de difusão rodando em GPU no Google Colab.

### Problema
- Avatares atuais são genéricos e não refletem a personalidade única de cada soul
- Queremos imagens únicas, estilizadas e consistentes com o "vibe" do personagem

### Restrições
- Colab oferece GPU limitada (T4 ~15GB VRAM típico)
- Não temos backend próprio (Vercel serverless) — toda geração deve passar pelo proxy do Next.js
- A URL do Colab é dinâmica (túnel) — precisa de configuração via env var
- Precisa funcionar offline no Colab (sem depender de serviços externos)

---

## 2. Arquitetura Geral

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Clawsouls       │     │  Next.js Server   │     │  Google Colab     │
│  (Frontend)      │────▶│  (API Route)      │────▶│  (GPU + API)      │
│                  │     │  /api/gen-avatar  │     │  :5000            │
│  "Generate       │     │                   │     │                   │
│   Avatar" btn    │     │  - Proxy          │     │  - Stable Diff.   │
│                  │     │  - Auth header    │     │  - Flask/FastAPI  │
└─────────────────┘     └──────────────────┘     └──────────────────┘
```

**Fluxo:**
1. Usuário clica "Generate Avatar" no editor da soul
2. Frontend envia `POST /api/gen-avatar` com os dados da soul
3. Next.js (server-side) gera um prompt a partir dos atributos da soul
4. Next.js chama a API do Colab (env var `IMAGE_GEN_API_URL`)
5. Colab gera a imagem via Stable Diffusion e retorna base64
6. Next.js retorna a imagem para o frontend
7. Frontend exibe preview; usuário aceita ou re-gera

---

## 3. Colab Script (lado do usuário)

### Stack
- **Modelo:** Stable Diffusion XL (SDXL) via `diffusers`
- **Servidor:** FastAPI + Uvicorn
- **Túnel:** `cloudflared` (não requer conta)
- **Tamanho mínimo de modelo:** SDXL base (~6.5GB) — cabe em T4 16GB

### Endpoints

**`GET /health`** — health check básico

**`POST /generate`**
```json
Request:
{
  "prompt": "string (descrição do avatar)",
  "negative_prompt": "string (opcional, o que evitar)",
  "style": "string (opcional: 'portrait', 'bust', 'full_body')",
  "seed": "number (opcional, para consistência)",
  "steps": 30,
  "guidance_scale": 7.5
}

Response:
{
  "image_base64": "string (PNG em base64)",
  "seed": "number",
  "prompt": "string",
  "generation_time_ms": "number"
}
```

### Script principal (`collab_avatar_gen.py`)

```python
"""
ClawSouls Avatar Generator — Colab Edition
Run in Google Colab with GPU runtime (T4 recommended).
"""

import base64
import io
import os
import subprocess
import threading
import time
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from diffusers import StableDiffusionXLPipeline
import torch

# ─── Model Loading ───────────────────────────────────────────────
MODEL_ID = os.environ.get("SD_MODEL_ID", "stabilityai/stable-diffusion-xl-base-1.0")

print(f"[INIT] Loading model {MODEL_ID}...")
pipe = StableDiffusionXLPipeline.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.float16,
    variant="fp16",
    use_safetensors=True,
)
pipe = pipe.to("cuda")
print("[INIT] Model loaded. GPU:", torch.cuda.get_device_name(0))

# ─── FastAPI ─────────────────────────────────────────────────────
app = FastAPI(title="ClawSouls Avatar Generator")

class GenerateRequest(BaseModel):
    prompt: str
    negative_prompt: str = ""
    style: str = "portrait"
    seed: int | None = None
    steps: int = 30
    guidance_scale: float = 7.5
    width: int = 512
    height: int = 512

def _build_default_prompt(soul: dict) -> str:
    """
    Build an SDXL prompt from soul data.
    Called from Next.js proxy before hitting this endpoint,
    but also usable directly for testing.
    """
    creature = soul.get("creature", "mysterious AI entity")
    vibe = soul.get("vibe", "enigmatic")
    name = soul.get("name", "Unknown")
    emoji = soul.get("emoji", "✨")
    
    traits = []
    if soul.get("openness", 50) > 70:
        traits.append("creative, imaginative")
    if soul.get("conscientiousness", 50) > 70:
        traits.append("precise, structured")
    if soul.get("extraversion", 50) > 70:
        traits.append("bold, expressive")
    if soul.get("agreeableness", 50) > 70:
        traits.append("warm, friendly")
    if soul.get("formality", 50) > 70:
        traits.append("elegant, refined")
    if soul.get("humor", 50) > 70:
        traits.append("playful, whimsical")
    
    traits_str = ", ".join(traits) if traits else "enigmatic, unique"
    
    return (
        f"Digital portrait avatar of {name}, a {creature}, {vibe}, "
        f"{traits_str}, cyberpunk style illustration, detailed face, "
        f"dark atmospheric background with neon accents, "
        f"professional character art, high quality, 4k"
    )

@app.get("/health")
async def health():
    gpu_info = {
        "available": torch.cuda.is_available(),
        "device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "N/A",
        "memory_allocated_gb": round(torch.cuda.memory_allocated() / 1e9, 2) if torch.cuda.is_available() else 0,
    }
    return {"status": "ok", "gpu": gpu_info}

@app.post("/generate")
async def generate(req: GenerateRequest):
    try:
        generator = torch.Generator(device="cuda")
        if req.seed is not None:
            generator.manual_seed(req.seed)
        else:
            generator.seed()
        
        # Adjust dimensions for style
        if req.style == "full_body":
            w, h = 512, 768
        elif req.style == "bust":
            w, h = 512, 640
        else:  # portrait (default)
            w, h = 512, 768
        
        image = pipe(
            prompt=req.prompt,
            negative_prompt=req.negative_prompt or None,
            num_inference_steps=req.steps,
            guidance_scale=req.guidance_scale,
            width=w,
            height=h,
            generator=generator,
        ).images[0]
        
        # Encode to base64
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        img_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
        
        return JSONResponse(content={
            "image_base64": img_base64,
            "seed": generator.initial_seed(),
            "prompt": req.prompt,
            "generation_time_ms": 0,  # TODO: measure
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Cloudflare Tunnel ───────────────────────────────────────────
def _start_cloudflared():
    """Start cloudflared tunnel in background."""
    port = int(os.environ.get("PORT", "5000"))
    print(f"[TUNNEL] Starting cloudflared on port {port}...")
    proc = subprocess.Popen(
        ["cloudflared", "tunnel", "--url", f"http://localhost:{port}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    time.sleep(3)
    # Read the URL from cloudflared output
    print("[TUNNEL] Tunnel started. Check output above for your public URL.")

if __name__ == "__main__":
    import uvicorn
    
    # Start cloudflared in background (optional — user can skip if they have another tunnel)
    tunnel_thread = threading.Thread(target=_start_cloudflared, daemon=True)
    tunnel_thread.start()
    
    print("[READY] Starting server on :5000")
    uvicorn.run(app, host="0.0.0.0", port=5000)
```

### Setup do Colab (células)

```python
# Célula 1: Instalação
!pip install diffusers transformers accelerate torch torchvision \
  fastapi uvicorn cloudflared pillow safetensors

# Célula 2: Rodar o script
# Upload do arquivo collab_avatar_gen.py e executar:
!python /content/collab_avatar_gen.py
```

### Segurança do Colab
- A API fica exposta via túnel cloudflared — **sem autenticação por padrão**
- Recomenda-se usar um header `X-API-Key` simples
- O túnel é temporário (morre quando o Colab desconecta)

---

## 4. Backend Clawsouls (Next.js API Route)

### Nova rota: `app/api/gen-avatar/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { buildAvatarPrompt } from "@/lib/avatarEngine";

const IMAGE_GEN_URL = process.env.IMAGE_GEN_URL; // e.g. https://xxxx-xxxx.trycloudflare.com
const IMAGE_GEN_API_KEY = process.env.IMAGE_GEN_API_KEY; // optional, for Colab side

// Rate limit: use Vercel Edge Config or simple in-memory
const rateLimit = new Map<string, number>();

export const runtime = "nodejs"; // need Node.js runtime for this

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const token = process.env.GEN_AVATAR_SECRET;
  
  if (token && auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Basic rate limiting
  const ip = request.ip || "unknown";
  const count = rateLimit.get(ip) || 0;
  if (count > 10) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }
  rateLimit.set(ip, count + 1);
  setTimeout(() => rateLimit.delete(ip), 60_000); // reset after 1 min

  try {
    const body = await request.json();
    const { soul } = body; // SoulState["soul"]

    if (!soul) {
      return NextResponse.json({ error: "Missing soul data" }, { status: 400 });
    }

    // Step 1: Generate prompt from soul attributes
    const { prompt, negativePrompt } = buildAvatarPrompt(soul);

    // Step 2: Call Colab API
    const genResponse = await fetch(`${IMAGE_GEN_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(IMAGE_GEN_API_KEY ? { "X-API-Key": IMAGE_GEN_API_KEY } : {}),
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: negativePrompt,
        style: "portrait",
        steps: 25,
        guidance_scale: 7.5,
      }),
      timeout: 120_000, // SDXL can take a minute on Colab
    });

    if (!genResponse.ok) {
      const err = await genResponse.text();
      throw new Error(`Image gen failed: ${genResponse.status} ${err}`);
    }

    const imageData = await genResponse.json();
    return NextResponse.json(imageData);
  } catch (err: any) {
    console.error("Avatar generation error:", err);
    return NextResponse.json(
      { error: err.message || "Generation failed" },
      { status: 500 }
    );
  }
}
```

### Prompt Engine: `lib/avatarEngine.ts`

```typescript
interface SoulAvatarInput {
  name: string;
  creature: string;
  vibe: string;
  emoji: string;
  humor?: number;
  formality?: number;
  emojiUsage?: number;
  verbosity?: number;
  openness?: number;
  conscientiousness?: number;
  extraversion?: number;
  agreeableness?: number;
  neuroticism?: number;
  communicationMode?: string;
  vibeStyle?: string;
  knowledgeDomains?: string[];
  emotionalRange?: number;
}

interface AvatarPromptOutput {
  prompt: string;
  negativePrompt: string;
}

/**
 * Converte atributos da soul em um prompt otimizado para SDXL.
 * Usa template determinístico + elementos aleatórios controlados por seed.
 */
export function buildAvatarPrompt(soul: SoulAvatarInput): AvatarPromptOutput {
  const {
    name = "",
    creature = "mysterious entity",
    vibe = "enigmatic",
    emoji,
    humor = 50,
    formality = 50,
    emojiUsage = 30,
    verbosity = 50,
    openness = 70,
    conscientiousness = 50,
    extraversion = 50,
    agreeableness = 50,
    neuroticism = 30,
    communicationMode = "direct",
    vibeStyle = "concise",
    knowledgeDomains = [],
    emotionalRange = 50,
  } = soul;

  // ── Visual Style Token ──
  const isHighFormality = formality > 65;
  const isPlayful = humor > 65;
  const isMinimal = vibeStyle === "minimal" || vibeStyle === "concise";
  const isDramatic = emotionalRange > 75 || vibeStyle === "dramatic";
  const isVeryExpressive = emojiUsage > 65;
  const isTech = knowledgeDomains?.includes("tech") || knowledgeDomains?.includes("science");

  // ── Art Style Selection ──
  let artStyle = "cyberpunk digital illustration";
  if (isHighFormality) artStyle = "elegant digital painting, Renaissance lighting";
  if (isPlayful) artStyle = "colorful anime-inspired digital art, vibrant";
  if (isMinimal) artStyle = "minimalist vector art, clean lines, geometric";
  if (isTech) artStyle = "sci-fi concept art, holographic elements";
  if (isDramatic) artStyle = "cinematic digital painting, dramatic chiaroscuro lighting";

  // ── Mood/Atmosphere ──
  let atmosphere = "dark atmospheric background with neon accents";
  if (agreeableness > 70) atmosphere = "warm, inviting background with soft golden light";
  if (neuroticism > 60) atmosphere = "unstable, glitching background with fractured light";
  if (extraversion > 70) atmosphere = "dynamic, energetic background with bold colors";
  if (openness > 75) atmosphere = "dreamy, surreal background with cosmic elements";

  // ── Expression ──
  let expression = "calm, confident expression";
  if (neuroticism > 60) expression = "tense, alert expression";
  if (extraversion > 70) expression = "bright, engaging smile";
  if (agreeableness > 70) expression = "gentle, warm expression";
  if (openness > 70) expression = "curious, contemplative gaze";
  if (humor > 70) expression = "sly, playful smirk";

  // ── Composition ──
  const composition = "close-up portrait, centered, detailed face, professional character art";

  // ── Negative Prompt (what to avoid) ──
  const negativePrompt = [
    "blurry, low quality, deformed, ugly, duplicate, disfigured",
    "bad anatomy, bad proportions, extra limbs, mutated hands",
    "text, watermark, signature, logo",
    "photorealistic, 3d render (keep illustration style)",
    "nude, NSFW, gore",
  ].join(", ");

  // ── Final Prompt Assembly ──
  const descriptors = [creature, vibe];

  if (expression !== "calm, confident expression") {
    descriptors.push(expression);
  }

  descriptors.push(artStyle);

  if (vibeStyle !== "concise" && vibeStyle !== "minimal") {
    descriptors.push(`vibe: ${vibeStyle}`);
  }

  if (emoji) {
    // Map emoji to visual cues instead of literal emoji
    const emojiHints: Record<string, string> = {
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
    };
    if (emojiHints[emoji]) {
      descriptors.push(emojiHints[emoji]);
    }
  }

  // Knowledge domain visual accents
  const domainAccents: Record<string, string> = {
    tech: "circuit patterns, holographic UI elements",
    philosophy: "ancient scrolls, ethereal glow",
    science: "molecular structures, lab equipment details",
    arts: "paint splashes, creative chaos",
    history: "ancient runes, time-worn textures",
    literature: "floating text, book pages",
    pop: "retro gaming elements, neon signs",
  };
  for (const domain of knowledgeDomains) {
    if (domainAccents[domain]) {
      descriptors.push(domainAccents[domain]);
    }
  }

  const prompt = `${composition} of ${descriptors.join(", ")}, ${atmosphere}, highly detailed, 4k, masterpiece`;

  return { prompt, negativePrompt };
}
```

---

## 5. Frontend Integration (Clawsouls)

### 5.1 Estado de avatar gerado

Adicionar ao `soulStore.ts`:

```typescript
// Novo campo no estado
generatedAvatar?: string; // base64 data URL
isGeneratingAvatar?: boolean;

// Nova action
generateAvatar: () => Promise<void>;
```

### 5.2 API client: `lib/avatarClient.ts`

```typescript
export async function generateAvatar(soul: SoulState["soul"]): Promise<string> {
  const res = await fetch("/api/gen-avatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.NEXT_PUBLIC_GEN_AVATAR_SECRET
        ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GEN_AVATAR_SECRET}` }
        : {}),
    },
    body: JSON.stringify({ soul }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Generation failed: ${res.status}`);
  }

  const data = await res.json();
  return `data:image/png;base64,${data.image_base64}`;
}
```

### 5.3 Botão de geração no editor

No `soul-editor.tsx`, adicionar na barra de ações:

```tsx
<button
  onClick={handleGenerateAvatar}
  disabled={isGenerating}
  className="cyber-btn"
  title="Generate avatar from soul personality"
>
  <Wand2 className="h-4 w-4" />
  <span>{isGenerating ? "Generating..." : "Generate Avatar"}</span>
</button>
```

### 5.4 Preview do avatar gerado

Mostrar o avatar gerado em `soul-preview.tsx` ao lado do preview do SOUL.md, com botão de aceitar/rejeitar.

---

## 6. Variáveis de Ambiente

```env
# Server-side only (não expor ao client)
IMAGE_GEN_URL=https://xxxx.trycloudflare.com
IMAGE_GEN_API_KEY=optional-secret-from-colab
GEN_AVATAR_SECRET=shared-secret-for-api-route

# Client-side (prefixed with NEXT_PUBLIC_)
# Nenhum necessário — o proxy é server-side
```

---

## 7. Fallback e Degradação

| Cenário | Comportamento |
|---------|--------------|
| Colab offline / API indisponível | Mostrar erro toast "Avatar generator offline", manter avatar atual |
| Rate limit excedido | Queue no Next.js ou debounce no botão (1 requisição por 10s) |
| Imagem gerada ruim | Botão "Retry" com nova seed aleatória |
| Sem GPU no Colab | Script falha no startup; usuário deve trocar runtime |
| Sem `IMAGE_GEN_URL` configurado | Botão de geração fica oculto/desabilitado |

---

## 8. Alternativas Consideradas

### Abordagem A: Gradio (descartada para integração)
- ✅ Mais fácil de configurar no Colab
- ✅ UI automática para testar
- ❌ URL muda a cada execução — difícil configurar em env var
- ❌ Payload de resposta diferente — mais parsing
- ❌ Menos controle sobre o endpoint

### Abordagem B: HuggingFace Inference API (descartada)
- ✅ Sem Colab necessário
- ❌ Rate limit de 30 req/min no free tier
- ❌ Sem controle de modelo/hiperparâmetros
- ❌ Dependência de serviço externo

### Abordagem C: Flask + cloudflared (**escolhida**)
- ✅ Controle total do API contract
- ✅ URL semi-permanente (ou reimprime a cada start)
- ✅ Leve e rápido
- ❌ Requer cloudflared instalado no Colab (pip install)
- ❌ Túnel temporário

### Abordagem D: modelo local na mesma máquina do frontend
- ❌ Não é possível — Vercel serverless não tem GPU

---

## 9. Prompt Design — Exemplos

### Soul: "Jack" (detective noir)
```
Prompt: close-up portrait of Jack, a 1940s private detective adapted for the digital world, sharp, ironic, piercing eyes, trench coat, detective hat, dark atmospheric background with neon accents, cyberpunk digital illustration, detailed face, masterpiece, 4k

Negative: blurry, low quality, deformed, anime style
```

### Soul: "Zen" (monge digital)
```
Prompt: close-up portrait of Zen, a digital monk who brought enlightenment to the internet, serene expression, lotus meditation beads, flowing robes with circuit patterns, nature elements and leaves, ethereal golden light, minimalist vector art, clean lines, professional character art, highly detailed, 4k

Negative: cluttered, dark, aggressive, low quality
```

### Soul: "Luffy" (pirate captain)
```
Prompt: close-up portrait of Luffy, a rubber pirate captain chasing the One Piece, bright smile, straw hat, dynamic energetic background with bold colors, adventurous look, sparkles, colorful anime-inspired digital art, vibrant, highly detailed, 4k

Negative: serious, dark, realistic, low quality
```

---

## 10. Próximos Passos

1. Criar `docs/superpowers/specs/2026-05-08-image-generation-design.md` (este doc)
2. Criar `collab_avatar_gen.py` (Colab script)
3. Criar `app/api/gen-avatar/route.ts` (proxy serverless)
4. Criar `lib/avatarEngine.ts` (prompt generation)
5. Integrar botão e preview no `soul-editor.tsx`
6. Atualizar `store/soulStore.ts` com novo estado
7. Atualizar `.env.example` com novas variáveis
8. Testar end-to-end