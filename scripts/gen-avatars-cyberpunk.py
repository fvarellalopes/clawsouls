#!/usr/bin/env python3
"""Generate avatars using proper cyberpunk prompts from data/prompts/"""
import json, base64, subprocess, os, time, sys

API = "https://fascinating-chorus-climbing-floors.trycloudflare.com/generate"
TOKEN = "YOUR_SECRET_TOKEN"
AVATAR_DIR = "/home/ubuntu/clawsouls/public/avatars"
PROGRESS_FILE = "/tmp/avatar_cyberpunk_progress.json"

# Load cyberpunk prompts
with open("/home/ubuntu/clawsouls/data/prompts/clawsouls_cyberpunk_prompts.json") as f:
    all_prompts = json.load(f)
prompt_map = {p.get('id', p.get('preset_id', '')): p.get('prompt', '') for p in all_prompts}

# Find missing
import re
with open("/home/ubuntu/clawsouls/data/presets.ts") as f:
    content = f.read()
preset_ids = set(m.group(1) for m in re.finditer(r"id:\s*'([^']+)'", content))
existing = set(f.replace('.webp','') for f in os.listdir(AVATAR_DIR))
missing = sorted(preset_ids - existing)

# Load progress (for resume)
if os.path.exists(PROGRESS_FILE):
    with open(PROGRESS_FILE) as f:
        progress = json.load(f)
else:
    progress = {}

print(f"Missing: {len(missing)} | Have prompts: {sum(1 for m in missing if m in prompt_map)}", flush=True)

count = 0
errors = 0
for pid in missing:
    if pid in progress and 'error' not in progress[pid]:
        continue  # already done
    
    prompt = prompt_map.get(pid)
    if not prompt:
        print(f"[SKIP] {pid}: no cyberpunk prompt", flush=True)
        continue
    
    try:
        result = subprocess.run(
            ["curl", "-s", "--max-time", "60", "-X", "POST", API,
             "-H", "Content-Type: application/json",
             "-d", json.dumps({"prompt": prompt, "token": TOKEN})],
            capture_output=True, text=True, timeout=65
        )
        if not result.stdout:
            errors += 1
            progress[pid] = {"error": "empty response"}
            print(f"[{count+1}] ✗ {pid}: empty response", flush=True)
            continue
        data = json.loads(result.stdout)
        if 'image' not in data:
            errors += 1
            progress[pid] = {"error": str(data)[:80]}
            print(f"[{count+1}] ✗ {pid}: {str(data)[:80]}", flush=True)
            continue
        img_bytes = base64.b64decode(data['image'])
        filepath = os.path.join(AVATAR_DIR, f"{pid}.webp")
        with open(filepath, 'wb') as f:
            f.write(img_bytes)
        count += 1
        progress[pid] = {"ok": True, "size": len(img_bytes)}
        print(f"[{count}] ✓ {pid} ({len(img_bytes)//1024}KB)", flush=True)
    except Exception as e:
        errors += 1
        progress[pid] = {"error": str(e)[:80]}
        print(f"[{count+1}] ✗ {pid}: {e}", flush=True)
    
    # Save progress
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f)
    
    time.sleep(2)

print(f"\nDone! Generated: {count}, Errors: {errors}", flush=True)
