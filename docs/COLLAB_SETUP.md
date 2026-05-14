# COLLAB Setup — ClawSouls Avatar Generator

Este guia descreve como configurar e executar o gerador de avatares em lote no Google Colab usando Z-Image-Turbo.

## Stack

- **Modelo:** Z-Image-Turbo (bfloat16, CFG=0, 8 steps)
- **API:** FastAPI standalone (`server.py`) com cloudflared tunnel
- **Auth:** Multi-canal (Authorization header, query param `?token=`, header `X-Token`)
- **Porta:** 8081

## Setup no Colab

### 1. Runtime

Configurar Runtime > Change runtime type > **T4 GPU** (ou superior).

### 2. Notebook

Usar o notebook `Z_Image_Turbo_4bit_jupyter.ipynb` que contém:

1. Instalação das deps (torch, diffusers, etc.)
2. Download do modelo Z-Image-Turbo (FP8 ou FP32)
3. Criação do `server.py` com FastAPI + cloudflared
4. Healthcheck e exibição da URL do tunnel

### 3. Tunnel

O cloudflared é baixado via wget do GitHub Releases (não pip). O tunnel expõe a porta 8081.

## Uso da API

```bash
# Healthcheck
curl https://<tunnel-url>/health

# Gerar avatar
curl -X POST https://<tunnel-url>/generate \
  -H "Authorization: Bearer cs-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "fantasy portrait, cyberpunk, ..."}'
```

### Parâmetros de geração

- **Modelo:** Z-Image-Turbo-SDNQ-uint4-svd-r32
- **Steps:** 8
- **CFG:** 0 (zero)
- **Resolução:** 1024×1024 → crop 512×768
- **Formato:** PNG

## Pipeline de Geração em Lote

```bash
# Gerar uma imagem por vez com delay de 4 min entre requests
# Commit e push individuais em public/avatars/
```

## Troubleshooting

| Problema | Solução |
|---|---|
| Tunnel cai | Restartar runtime + re-rodar célula do cloudflared |
| 500 Internal Error | Restartar runtime pra carregar server.py atualizado |
| Porta 8080 ocupada | Usar porta 8081 |
| GPU OOM | Tentar FP8 ou reduzir resolução |
