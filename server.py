#!/usr/bin/env python3
"""
FastAPI server for Z-Image-Turbo image generation
"""

import os
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import BytesIO
import base64
from diffusers import ZImagePipeline
import warnings
warnings.filterwarnings("ignore")

# Configuração
MODEL_ID = os.environ.get('MODEL_ID', 'T5B/Z-Image-Turbo-FP8')
SECRET_TOKEN = os.environ.get('SECRET_TOKEN', 'cs-secret-2026')

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

# Carregar modelo
print(f"Loading model: {MODEL_ID}")
pipe = ZImagePipeline.from_pretrained(MODEL_ID, torch_dtype=torch.bfloat16)
pipe.to("cuda")
print("✅ Model loaded!")

# Request/Response
class GenerateRequest(BaseModel):
    prompt: str
    width: int = 1024
    height: int = 1024
    steps: int = 8
    guidance: float = 0.0
    seed: int = None

class GenerateResponse(BaseModel):
    image: str  # base64
    success: bool

# Auth middleware
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
    return {"status": "ok", "model": MODEL_ID}

@app.get("/models")
async def models():
    return {"models": [MODEL_ID], "default": MODEL_ID}

@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest, token=Depends(verify_token)):
    try:
        # Gerar imagem
        generator = torch.manual_seed(request.seed) if request.seed else None
        
        image = pipe(
            prompt=request.prompt,
            height=request.height,
            width=request.width,
            num_inference_steps=request.steps,
            guidance_scale=request.guidance,
            generator=generator,
        ).images[0]
        
        # Converter para base64
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return GenerateResponse(image=img_str, success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)