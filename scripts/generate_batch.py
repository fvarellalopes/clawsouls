#!/usr/bin/env python3
"""
ClawSouls Avatar Batch Generator
Gera avatares via API do Colab (Z-Image-Turbo) em lotes com retry.
"""

import json
import urllib.request
import urllib.parse
import ssl
import os
import time
import hashlib
import sys
from datetime import datetime

# ── Config ────────────────────────────────────────────────
SERVER_URL = os.environ.get("CLAWSOULS_SERVER", "http://localhost:8000")
SECRET_TOKEN = os.environ.get("CLAWSOULS_SECRET", "cs-secret-2026")
OUTPUT_DIR = os.environ.get("CLAWSOULS_OUTPUT", "/tmp/clawsouls_avatars")
BATCH_SIZE = int(os.environ.get("CLAWSOULS_BATCH_SIZE", "50"))
MAX_RETRIES = 3
RETRY_DELAY = 5  # segundos

# SSL context (sem verificação para localhost/cloudflare)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Carregar prompts ──────────────────────────────────────
PROMPTS_FILE = "/tmp/clawsouls_all_prompts.json"
LOG_FILE = os.path.join(OUTPUT_DIR, "_generation_log.json")

def load_prompts():
    with open(PROMPTS_FILE) as f:
        return json.load(f)

def load_log():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            return json.load(f)
    return {"generated": [], "failed": [], "skipped": []}

def save_log(log_data):
    with open(LOG_FILE, 'w') as f:
        json.dump(log_data, f, indent=2, ensure_ascii=False)

# ── Gerar uma imagem ───────────────────────────────────────
def generate_avatar(avatar_data, attempt=1):
    name = avatar_data['name']
    prompt = avatar_data['prompt']
    slug = avatar_data.get('slug', name.lower().replace(' ', '_'))
    
    # Montar payload
    payload = json.dumps({
        "name": name,
        "custom_prompt": prompt,
        "steps": 8,
    }).encode('utf-8')
    
    url = f"{SERVER_URL}/generate?token={SECRET_TOKEN}"
    
    headers = {
        'User-Agent': 'ClawSouls/3.0',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Token': SECRET_TOKEN,
    }
    
    req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=120) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            
        if 'image_base64' in data:
            # Salvar imagem
            img_bytes = __import__('base64').b64decode(data['image_base64'])
            img_path = os.path.join(OUTPUT_DIR, f"{slug}.png")
            with open(img_path, 'wb') as f:
                f.write(img_bytes)
            
            return {
                'success': True,
                'name': name,
                'slug': slug,
                'path': img_path,
                'size': len(img_bytes),
                'elapsed': data.get('elapsed_s', 0),
                'seed': data.get('seed', 0),
                'attempt': attempt,
            }
        else:
            return {
                'success': False,
                'name': name,
                'error': f"Sem image_base64 na resposta: {data.get('detail', 'unknown')}",
                'attempt': attempt,
            }
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='replace')
        if e.code == 429:
            # Rate limited — esperar e tentar de novo
            wait = RETRY_DELAY * attempt
            print(f"  ⏳ 429 Rate Limited — esperando {wait}s...")
            time.sleep(wait)
            return generate_avatar(avatar_data, attempt + 1)
        elif e.code == 401:
            return {'success': False, 'name': name, 'error': 'Auth falhou (401)', 'attempt': attempt}
        else:
            return {'success': False, 'name': name, 'error': f"HTTP {e.code}: {error_body[:200]}", 'attempt': attempt}
            
    except Exception as e:
        if attempt < MAX_RETRIES:
            print(f"  ⏳ Retry {attempt+1}/{MAX_RETRIES} em {RETRY_DELAY}s...")
            time.sleep(RETRY_DELAY)
            return generate_avatar(avatar_data, attempt + 1)
        return {'success': False, 'name': name, 'error': str(e), 'attempt': attempt}

# ── Health Check ───────────────────────────────────────────
def check_server():
    try:
        url = f"{SERVER_URL}/health"
        with urllib.request.urlopen(url, context=ctx, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"✅ Servidor ativo: {data}")
            return True
    except Exception as e:
        print(f"❌ Servidor não responde: {e}")
        return False

# ── MAIN ──────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("🖼️  ClawSouls Avatar Batch Generator")
    print(f"   Server: {SERVER_URL}")
    print(f"   Output: {OUTPUT_DIR}")
    print(f"   Batch size: {BATCH_SIZE}")
    print("=" * 60)
    
    if not check_server():
        print("\n❌ Servidor indisponível. Abortando.")
        sys.exit(1)
        return
    
    prompts = load_prompts()
    log = load_log()
    generated_set = set(g['name'] for g in log.get('generated', []))
    
    remaining = [p for p in prompts if p['name'] not in generated_set]
    total = len(prompts)
    already_done = total - len(remaining)
    
    print(f"\n📊 Total: {total} | ✅ Feitos: {already_done} | ⏳ Restantes: {len(remaining)}")
    
    if not remaining:
        print("🎉 Todos os avatares já foram gerados!")
        return
    
    print(f"\n🔄 Gerando {len(remaining)} avatares em lotes de {BATCH_SIZE}...\n")
    
    batch_num = 1
    for i, avatar in enumerate(remaining):
        batch_idx = i % BATCH_SIZE
        
        if batch_idx == 0:
            batch_start = i
            remaining_count = len(remaining) - i
            print(f"\n--- Lote {batch_num} ({min(BATCH_SIZE, remaining_count)} avatares) ---")
            batch_num += 1
        
        print(f"  [{i+1}/{len(remaining)}] Gerando {avatar['name']}...", end=" ")
        
        result = generate_avatar(avatar)
        
        if result['success']:
            print(f"✅ ({result['elapsed']}s, seed={result['seed']})")
            log['generated'].append(result)
        else:
            print(f"❌ {result.get('error', 'unknown')}")
            log['failed'].append(result)
        
        # Salvar log a cada imagem (para não perder progresso)
        save_log(log)
        
        # Pequeno delay entre gerações para não sobrecarregar
        if i < len(remaining) - 1:
            time.sleep(0.5)
    
    # Resumo final
    print("\n" + "=" * 60)
    print("📊 RESUMO FINAL")
    print(f"   ✅ Gerados com sucesso: {len(log['generated'])}")
    print(f"   ❌ Falhas: {len(log['failed'])}")
    print(f"   📁 Imagens salvas em: {OUTPUT_DIR}")
    print("=" * 60)
    
    if log['failed']:
        print("\n❌ Falhas:")
        for f in log['failed']:
            print(f"   - {f['name']}: {f.get('error', '?')}")

if __name__ == '__main__':
    main()