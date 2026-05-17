#!/usr/bin/env python3
"""
Servidor Z-Image-Turbo API
"""

import os
import torch
import diffusers
from sdnq.loader import apply_sdnq_options_to_model
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import BytesIO
import base64
import warnings
warnings.filterwarnings("ignore")

# Config
SECRET_TOKEN = os.environ.get('SECRET_TOKEN')
if not SECRET_TOKEN:
    raise ValueError('SECRET_TOKEN env var is required')

# FastAPI
app = FastAPI(title="ClawSouls API")
app.add_middleware(CORSMiddleware, allow_origins=["*"])

# Carregar modelo
print("Loading Z-Image-Turbo with SDNQ...")
pipe = diffusers.ZImagePipeline.from_pretrained(
    "Disty0/Z-Image-Turbo-SDNQ-uint4-svd-r32", 
    torch_dtype=torch.float32, device_map="cuda"
)
pipe.transformer = apply_sdnq_options_to_model(pipe.transformer, use_quantized_matmul=True)
pipe.text_encoder = apply_sdnq_options_to_model(pipe.text_encoder, use_quantized_matmul=True)
print("✅ Model loaded!")

# Endpoints
class Req(BaseModel):
    prompt: str
    width: int = 1024
    height: int = 1024
    steps: int = 9
    guidance: float = 0.0
    seed: int = None

@app.get("/health")
async def health():
    return {"status": "ok", "model": "Z-Image-Turbo-SDNQ"}

@app.post("/generate")
async def generate(req: Req, token: str = None):
    if token and token != SECRET_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")
    generator = torch.manual_seed(req.seed) if req.seed else None
    image = pipe(prompt=req.prompt, height=req.height, width=req.width, 
                 num_inference_steps=req.steps, guidance_scale=req.guidance, 
                 generator=generator).images[0]
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return {"image": base64.b64encode(buffer.getvalue()).decode(), "success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)