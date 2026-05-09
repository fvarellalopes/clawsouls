from urllib.parse import parse_qs
import io, base64, time, os, re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Request
import torch
from diffusers import AutoPipelineForText2Image

# ── Config (injetadas pelo notebook via env vars) ──────────
MODELO = os.environ.get('CLAWSOULS_MODELO', 'sdxl')
SECRET_TOKEN = os.environ.get('CLAWSOULS_SECRET', 'cs-secret-2026')
TOTAL_STEPS = int(os.environ.get('CLAWSOULS_STEPS', '15'))
TOTAL_GUIDANCE = float(os.environ.get('CLAWSOULS_GUIDANCE', '7.5'))
MODEL_ID = os.environ.get('CLAWSOULS_MODEL_ID', 'stabilityai/stable-diffusion-xl-base-1.0')
MODEL_WIDTH = int(os.environ.get('CLAWSOULS_WIDTH', '512'))
MODEL_HEIGHT = int(os.environ.get('CLAWSOULS_HEIGHT', '768'))
MODEL_VARIANT = os.environ.get('CLAWSOULS_VARIANT', 'fp16')

DEFAULT_NEGATIVE = (
    'blurry, low quality, deformed, ugly, duplicate, disfigured, '
    'bad anatomy, bad proportions, extra limbs, mutated hands, '
    'text, watermark, signature, logo, '
    'photorealistic, 3d render, '
    'nude, NSFW, gore'
)

# ── FastAPI App ────────────────────────────────────────
class GenerateRequest(BaseModel):
    name: Optional[str] = 'unnamed'
    custom_prompt: str
    steps: Optional[int] = None
    guidance: Optional[float] = None
    custom_negative_prompt: Optional[str] = None

app = FastAPI(title='ClawSouls Avatar API', version='2.0')

def _check_token(request: Request) -> bool:
    auth = request.headers.get('Authorization', '')
    if auth == 'Bearer ' + SECRET_TOKEN:
        return True
    qs = parse_qs(request.url.query)
    if qs.get('token', [''])[0] == SECRET_TOKEN:
        return True
    if request.headers.get('X-Token') == SECRET_TOKEN:
        return True
    return False

@app.get('/health')
def health():
    return {'status': 'ok', 'model': MODELO, 'model_id': MODEL_ID}

@app.get('/models')
def list_models():
    return {'available': {}, 'current': MODELO}

@app.post('/generate')
async def generate(request: Request, req: GenerateRequest):
    if not _check_token(request):
        raise HTTPException(status_code=401, detail='Unauthorized')
    prompt = req.custom_prompt
    negative = req.custom_negative_prompt or DEFAULT_NEGATIVE
    steps = req.steps if req.steps else TOTAL_STEPS
    guidance = req.guidance if req.guidance else TOTAL_GUIDANCE
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Generating: {req.name} ({steps} steps)")
    start = time.time()
    generator = torch.Generator(device='cuda').manual_seed(int(time.time() * 1000) % (2**32))
    image = pipe(
        prompt=prompt, negative_prompt=negative,
        num_inference_steps=steps, guidance_scale=guidance,
        width=MODEL_WIDTH, height=MODEL_HEIGHT, generator=generator,
    ).images[0]
    elapsed = time.time() - start
    buf = io.BytesIO()
    image.save(buf, format='PNG')
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode('utf-8')
    safe_name = ''.join(c if c.isalnum() or c in '._-' else '_' for c in req.name.lower().strip())
    print(f"   ✅ {req.name} → {elapsed:.1f}s")
    return {
        'name': req.name, 'slug': safe_name,
        'prompt': prompt, 'negative_prompt': negative,
        'seed': int(generator.initial_seed()),
        'steps': steps, 'guidance': guidance, 'model': MODELO,
        'elapsed_s': round(elapsed, 1), 'image_base64': img_b64,
    }

# ── Lifespan (model loading) ─────────────────────────────
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    global pipe
    
    # Tenta ler HF_TOKEN de vários lugares
    hf_token = os.environ.get('HF_TOKEN', '')
    if not hf_token:
        token_path = os.path.expanduser('~/.cache/huggingface/token')
        if os.path.exists(token_path):
            with open(token_path) as f:
                hf_token = f.read().strip()
    
    print(f"Loading model: {MODEL_ID}")
    print(f"  variant={MODEL_VARIANT}, token={'set' if hf_token else 'NONE'}")

    # Lista de tentativas: primeiro com variante, depois sem
    attempt_variants = [MODEL_VARIANT, None]
    pipe = None
    
    for attempt_variant in attempt_variants:
        try:
            print(f"  Trying variant={attempt_variant}...")
            pipe = AutoPipelineForText2Image.from_pretrained(
                MODEL_ID,
                torch_dtype=torch.float16 if MODEL_VARIANT == 'fp16' else torch.float32,
                variant=attempt_variant,
                use_safetensors=True,
                token=hf_token if hf_token else None,
            )
            pipe.enable_attention_slicing()
            if hasattr(pipe, 'enable_vae_tiling'):
                pipe.enable_vae_tiling()
            pipe.to('cuda')
            # VAE dtype fix para evitar mixed precision
            if hasattr(pipe, 'vae') and MODEL_VARIANT == 'fp16':
                pipe.vae.to('cuda', torch.float16)
            print(f"  ✅ Modelo carregado! (variant={attempt_variant})")
            break
        except Exception as e:
            print(f"  ⚠️  Falhou com variant={attempt_variant}: {e}")
            if attempt_variant is None:
                print("  ❌ Todas as tentativas falharam!")
                raise
            continue

    if pipe is None:
        raise RuntimeError('Não foi possível carregar o modelo!')

    yield
    del pipe
    torch.cuda.empty_cache()
    print('🛑 Servidor encerrado')

app.router.lifespan_context = lifespan