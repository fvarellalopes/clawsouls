#!/usr/bin/env python3
"""
FastAPI server for Z-Image-Turbo with SDNQ quantization
"""

import os
import torch
import diffusers
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import BytesIO
import base64
from sdnq import SDNQConfig
from sdnq.loader import apply_sdnq_options_to_model
import warnings
warnings.filterwarnings("ignore")

# Configuração
SECRET_TOKEN = os.environ.get('SECRET_TOKEN')
if not SECRET_TOKEN:
    raise ValueError('SECRET_TOKEN env var is required')

# Inicializar FastAPI
app = FastAPI(title="ClawSouls Image API", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carregar modelo com SDNQ
print("Loading Z-Image-Turbo with SDNQ...")
pipe = diffusers.ZImagePipeline.from_pretrained(
    "Disty0/Z-Image-Turbo-SDNQ-uint4-svd-r32", 
    torch_dtype=torch.float32, 
    device_map="cuda"
)
pipe.transformer = apply_sdnq_options_to_model(pipe.transformer, use_quantized_matmul=True)
pipe.text_encoder = apply_sdnq_options_to_model(pipe.text_encoder, use_quantized_matmul=True)
print("✅ Model loaded!")

# Request/Response
class GenerateRequest(BaseModel):
    prompt: str
    width: int = 1024
    height: int = 1024
    steps: int = 9
    guidance: float = 0.0
    seed: int = None

class GenerateResponse(BaseModel):
    image: str
    success: bool

# Auth
from fastapi import Depends, HTTPHeader, Query

def verify_token(
    header: str = HTTPHeader(default=None),
    query: str = Query(default=None)
):
    token = header or query
    if token and token != SECRET_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")
    return token

@app.get("/health")
async def health():
    return {"status": "ok", "model": "Disty0/Z-Image-Turbo-SDNQ-uint4-svd-r32"}

@app.get("/models")
async def models():
    return {"models": ["Disty0/Z-Image-Turbo-SDNQ-uint4-svd-r32"], "default": "Disty0/Z-Image-Turbo-SDNQ-uint4-svd-r32"}

@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest, token=Depends(verify_token)):
    try:
        generator = torch.manual_seed(request.seed) if request.seed else None
        
        image = pipe(
            prompt=request.prompt,
            height=request.height,
            width=request.width,
            num_inference_steps=request.steps,
            guidance_scale=request.guidance,
            generator=generator,
        ).images[0]
        
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return GenerateResponse(image=img_str, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)