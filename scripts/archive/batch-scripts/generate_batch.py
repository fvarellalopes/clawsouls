#!/usr/bin/env python3
"""Batch avatar generator for ClawSouls via Colab tunnel."""
import requests, json, base64, os, sys, time
from pathlib import Path

API = "https://ellis-honest-olympus-immune.trycloudflare.com"
TOKEN = "YOUR_SECRET_TOKEN"
gen_dir = '/home/ubuntu/clawsouls/public/avatars/generated/'
PROMPTS_FILE = '/home/ubuntu/clawsouls/data/prompts/clawsouls_cyberpunk_prompts.json'

os.makedirs(gen_dir, exist_ok=True)

with open(PROMPTS_FILE) as f:
    prompts = json.load(f)

# Already generated
existing = set()
for f in os.listdir(gen_dir):
    if f.endswith('.png') or f.endswith('.webp'):
        existing.add(f.rsplit('.', 1)[0])

# Filter remaining
remaining = []
for p in prompts:
    safe = ''.join(c for c in p['name'].lower() if c.isalnum() or c in '._-')
    if safe not in existing:
        remaining.append(p)

total = len(remaining)
print(f"Starting batch: {total} avatars to generate (already have {len(existing)})", flush=True)

success = 0
fail = 0
consecutive_fails = 0

for i, p in enumerate(remaining):
    safe = ''.join(c for c in p['name'].lower() if c.isalnum() or c in '._-')
    path = Path(gen_dir) / f"{safe}.png"
    
    try:
        r = requests.post(f"{API}/generate", json={"prompt": p["prompt"], "token": TOKEN}, timeout=300)
        result = r.json()
        if 'image' in result:
            img_data = base64.b64decode(result['image'])
            path.write_bytes(img_data)
            success += 1
            consecutive_fails = 0
            print(f"[{i+1}/{total}] ✅ {p['name']} ({len(img_data)//1024}KB)", flush=True)
        else:
            fail += 1
            consecutive_fails += 1
            print(f"[{i+1}/{total}] ❌ {p['name']}: {result}", flush=True)
    except requests.exceptions.ConnectionError:
        fail += 1
        consecutive_fails += 1
        print(f"[{i+1}/{total}] ❌ {p['name']}: Connection error (tunnel down?)", flush=True)
        if consecutive_fails >= 5:
            print(f"5 consecutive failures — tunnel likely down. Stopping.", flush=True)
            break
        time.sleep(10)
        continue
    except Exception as e:
        fail += 1
        consecutive_fails += 1
        print(f"[{i+1}/{total}] ❌ {p['name']}: {e}", flush=True)
    
    # Small delay between requests
    if i < total - 1:
        time.sleep(2)

print(f"\n=== DONE ===", flush=True)
print(f"Success: {success}, Failed: {fail}, Total existing: {len(existing) + success}", flush=True)
