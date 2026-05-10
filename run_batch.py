#!/usr/bin/env python3
"""
Batch ClawSouls Avatar Generator
Gera todos os 289 avatares via Z-Image-Turbo API (cloudflared tunnel).
- Um por vez, 4 min entre requests
- Commit + push individual de cada
- Timeout 40s por request
"""

import json, subprocess, os, shutil, base64, time, sys

API_URL = "https://dc69-136-110-51-158.ngrok-free.app"
TOKEN = "cs-secret-2026"
STAGING_DIR = "/tmp/clawsouls_avatars"
REPO_AVATARS_DIR = "/home/ubuntu/clawsouls/public/avatars"
PROMPTS_FILE = "/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json"
REPO_DIR = "/home/ubuntu/clawsouls"
REQUEST_TIMEOUT = 40
DELAY_BETWEEN = 240

os.makedirs(STAGING_DIR, exist_ok=True)

with open(PROMPTS_FILE) as f:
    prompts = json.load(f)

def norm(s):
    return s.lower().replace('-', '').replace('_', '')

def get_existing_ids():
    repo_files = set()
    if os.path.exists(REPO_AVATARS_DIR):
        repo_files = set(os.listdir(REPO_AVATARS_DIR))
    staging_files = set()
    if os.path.exists(STAGING_DIR):
        staging_files = set(os.listdir(STAGING_DIR))
    all_existing = {f.replace('.png', '') for f in repo_files | staging_files if f.endswith('.png')}
    return {norm(f) for f in all_existing}

norm_existing = get_existing_ids()
total_generated = sum(1 for p in prompts if norm(p['id']) in norm_existing)
print(f"Progresso inicial: {total_generated}/{len(prompts)} gerados")

if total_generated >= len(prompts):
    print("TODOS GERADOS!")
    sys.exit(0)

generated_this_run = 0

for i, p in enumerate(prompts):
    if norm(p['id']) in norm_existing:
        continue

    total_generated += 1
    generated_this_run += 1
    print(f"\n{'='*60}")
    print(f"[{total_generated}/{len(prompts)}] Gerando: {p['name']} (id={p['id']})")
    print(f"   Prompt: {p['prompt'][:120]}...")

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

    cmd = [
        'curl', '-s', '-X', 'POST',
        f'{API_URL}/generate',
        '-H', 'Content-Type: application/json',
        '-d', payload,
        '--max-time', str(REQUEST_TIMEOUT)
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=REQUEST_TIMEOUT + 10)

        if result.returncode == 0 and result.stdout.strip():
            try:
                resp = json.loads(result.stdout)
                if 'image' in resp:
                    img_data = base64.b64decode(resp['image'])
                    with open(out_path, 'wb') as f:
                        f.write(img_data)
                    print(f"   Salvo: {len(img_data)//1024} KB em {out_path}")

                    dest = f"{REPO_AVATARS_DIR}/{p['id']}.png"
                    shutil.copy2(out_path, dest)

                    subprocess.run(
                        ['git', '-C', REPO_DIR, 'add', f'public/avatars/{p["id"]}.png'],
                        capture_output=True
                    )
                    r_commit = subprocess.run(
                        ['git', '-C', REPO_DIR, 'commit', '-m',
                         f'Add avatar: {p["name"]} ({p["id"]}) [{total_generated}/{len(prompts)}]'],
                        capture_output=True, text=True
                    )
                    commit_msg = (r_commit.stdout + r_commit.stderr).strip()
                    print(f"   Commit: {commit_msg[:80]}")

                    r_push = subprocess.run(
                        ['git', '-C', REPO_DIR, 'push'],
                        capture_output=True, text=True, timeout=30
                    )
                    print(f"   Push OK")

                    norm_existing.add(norm(p['id']))
                else:
                    print(f"   API erro: {resp.get('detail', resp)}")
                    total_generated -= 1
                    generated_this_run -= 1
            except json.JSONDecodeError:
                print(f"   Resposta nao JSON: {result.stdout[:200]}")
                total_generated -= 1
                generated_this_run -= 1
        else:
            print(f"   curl erro: {result.stderr[:200]}")
            total_generated -= 1
            generated_this_run -= 1
    except subprocess.TimeoutExpired:
        print(f"   Timeout para {p['name']}")
        total_generated -= 1
        generated_this_run -= 1
    except Exception as e:
        print(f"   Erro: {e}")
        total_generated -= 1
        generated_this_run -= 1

    remaining = len(prompts) - total_generated
    if remaining > 0:
        print(f"   Aguardando {DELAY_BETWEEN}s... ({remaining} restantes)")
        time.sleep(DELAY_BETWEEN)

print(f"\n{'='*60}")
print(f"BATCH COMPLETO: {generated_this_run} novos avatares")
print(f"Total geral: {total_generated}/{len(prompts)}")