#!/usr/bin/env python3
"""
Batch ClawSouls Avatar Generator
Gera todos os 289 avatares via Z-Image-Turbo API (cloudflared tunnel).
- Um por vez, delay só após sucesso
- Commit + push individual de cada
- Retry com backoff (3 tentativas)
- Healthcheck pré-request
- Timeout 300s por request
"""

import json, subprocess, os, shutil, base64, time, sys, urllib.request

API_URL = "https://dc69-136-110-51-158.ngrok-free.app"
TOKEN = "cs-secret-2026"
STAGING_DIR = "/tmp/clawsouls_avatars"
REPO_AVATARS_DIR = "/home/ubuntu/clawsouls/public/avatars"
PROMPTS_FILE = "/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json"
REPO_DIR = "/home/ubuntu/clawsouls"
REQUEST_TIMEOUT = 300
DELAY_BETWEEN = 60
MAX_RETRIES = 3
HEALTHCHECK_INTERVAL = 5  # healthcheck a cada N imagens

os.makedirs(STAGING_DIR, exist_ok=True)

with open(PROMPTS_FILE) as f:
    prompts = json.load(f)

def norm(s):
    return s.lower().replace('-', '').replace('_', '').replace(' ', '')

def slug_match(file_base, prompt_id):
    """Match considerando slug simplificado e ID original"""
    file_norm = norm(file_base)
    pid_norm = norm(prompt_id)
    if file_norm == pid_norm:
        return True
    # Tentar slug simplificado do prompt (nome) vs filename
    return file_norm in pid_norm or pid_norm in file_norm

def get_existing_ids():
    """Retorna set de IDs normalizados ja gerados (repo ou staging)"""
    ids = set()
    for d in [REPO_AVATARS_DIR, STAGING_DIR]:
        if not os.path.exists(d):
            continue
        for f in os.listdir(d):
            if not f.endswith('.png'):
                continue
            base = os.path.splitext(f)[0]
            for p in prompts:
                if slug_match(base, p['id']):
                    ids.add(norm(p['id']))
                    break
    return ids

def healthcheck():
    """Verifica se o tunnel/API está respondendo"""
    try:
        url = f"{API_URL}/health"
        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status == 200:
                return True
    except Exception as e:
        print(f"  Healthcheck falhou: {e}")
    return False

generated = get_existing_ids()
total_done = sum(1 for p in prompts if norm(p['id']) in generated)
print(f"Progresso: {total_done}/{len(prompts)} ja gerados")

if total_done >= len(prompts):
    print("TODOS GERADOS!")
    sys.exit(0)

new_this_run = 0
healthcheck_counter = 0

for i, p in enumerate(prompts):
    pid_norm = norm(p['id'])
    if pid_norm in generated:
        continue

    total_done += 1
    new_this_run += 1
    print(f"\n{'='*60}")
    print(f"[{total_done}/{len(prompts)}] Gerando: {p['name']} (id={p['id']})")
    print(f"  Prompt: {p['prompt'][:120]}...")

    out_path = f"{STAGING_DIR}/{p['id']}.png"

    payload = json.dumps({
        "token": TOKEN,
        "prompt": p['prompt'],
        "cfg": 0,
        "steps": 8,
        "width": 1024,
        "height": 1024,
        "crop": [512, 768]
    })

    ok = False

    # Healthcheck pré-request
    healthcheck_counter += 1
    if healthcheck_counter >= HEALTHCHECK_INTERVAL:
        print("  Healthcheck...")
        if not healthcheck():
            print("  Tunnel fora! Tentando novamente em 30s...")
            time.sleep(30)
            if not healthcheck():
                print("  Tunnel ainda fora, pulando por agora")
                total_done -= 1
                new_this_run -= 1
                continue
        healthcheck_counter = 0

    # Retry com backoff
    for attempt in range(MAX_RETRIES):
        try:
            cmd = [
                'curl', '-s', '-X', 'POST',
                f'{API_URL}/generate',
                '-H', 'Content-Type: application/json',
                '-d', payload,
                '--max-time', str(REQUEST_TIMEOUT)
            ]
            sys.stdout.flush()
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=REQUEST_TIMEOUT + 10)

            if result.returncode == 0 and result.stdout.strip():
                try:
                    resp = json.loads(result.stdout)
                    if 'image' in resp:
                        img_data = base64.b64decode(resp['image'])
                        with open(out_path, 'wb') as f:
                            f.write(img_data)
                        print(f"  Salvo: {len(img_data)//1024} KB")

                        dest = f"{REPO_AVATARS_DIR}/{p['id']}.png"
                        shutil.copy2(out_path, dest)

                        subprocess.run(['git', '-C', REPO_DIR, 'add', f'public/avatars/{p["id"]}.png'], capture_output=True)
                        rc = subprocess.run(
                            ['git', '-C', REPO_DIR, 'commit', '-m',
                             f'Add avatar: {p["name"]} ({p["id"]}) [{total_done}/{len(prompts)}]'],
                            capture_output=True, text=True
                        )
                        print(f"  Commit: {(rc.stdout+rc.stderr).strip()[:80]}")

                        subprocess.run(['git', '-C', REPO_DIR, 'push'], capture_output=True, text=True, timeout=30)
                        print(f"  Push: OK")
                        generated.add(pid_norm)
                        ok = True
                        print(f"  >>> DONE")
                        break
                    else:
                        print(f"  API erro: {resp.get('detail', resp)}")
                        break  # erro de API, nao retry
                except json.JSONDecodeError:
                    print(f"  JSON erro (tentativa {attempt+1}/{MAX_RETRIES}): {result.stdout[:200]}")
            else:
                print(f"  curl erro (tentativa {attempt+1}/{MAX_RETRIES}): {result.stderr[:200]}")
        except subprocess.TimeoutExpired:
            print(f"  Timeout (tentativa {attempt+1}/{MAX_RETRIES}): {p['name']}")
        except Exception as e:
            print(f"  Erro (tentativa {attempt+1}/{MAX_RETRIES}): {e}")

        if not ok and attempt < MAX_RETRIES - 1:
            wait = 30 * (attempt + 1)
            print(f"  Retry em {wait}s...")
            time.sleep(wait)

    if not ok:
        total_done -= 1
        new_this_run -= 1

    remaining = len(prompts) - total_done
    if remaining > 0 and ok:
        print(f"  Esperando {DELAY_BETWEEN}s... ({remaining} restantes)")
        time.sleep(DELAY_BETWEEN)

print(f"\n{'='*60}")
print(f"Novos nesta execucao: {new_this_run}")
print(f"Total geral: {total_done}/{len(prompts)}")