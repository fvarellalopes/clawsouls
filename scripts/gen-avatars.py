#!/usr/bin/env python3
import json, base64, subprocess, re, os, time, sys

API = "https://fascinating-chorus-climbing-floors.trycloudflare.com/generate"
TOKEN = "YOUR_SECRET_TOKEN"
AVATAR_DIR = "/home/ubuntu/clawsouls/public/avatars"

with open("/home/ubuntu/clawsouls/data/presets.ts") as f:
    content = f.read()

presets = []
for m in re.finditer(r"id:\s*'([^']+)'[^}]*?name:\s*'([^']+)'[^}]*?creature:\s*'([^']+)'", content, re.DOTALL):
    presets.append({"id": m.group(1), "name": m.group(2), "creature": m.group(3)})

existing = set(f.replace('.webp','') for f in os.listdir(AVATAR_DIR))
missing = [p for p in presets if p['id'] not in existing]

print(f"Total: {len(presets)} | Have: {len(existing)} | Missing: {len(missing)}", flush=True)

count = 0
errors = 0
for p in missing:
    name = p['name']
    creature = p['creature']
    prompt = f"Portrait of {name}, {creature}, detailed digital art, dramatic lighting, dark background, cinematic quality, 4k"
    
    try:
        result = subprocess.run(
            ["curl", "-s", "--max-time", "60", "-X", "POST", API,
             "-H", "Content-Type: application/json",
             "-d", json.dumps({"prompt": prompt, "token": TOKEN})],
            capture_output=True, text=True, timeout=65
        )
        if not result.stdout:
            errors += 1
            print(f"[{count+1}] ✗ {p['id']}: empty response", flush=True)
            continue
        data = json.loads(result.stdout)
        if 'image' not in data:
            errors += 1
            print(f"[{count+1}] ✗ {p['id']}: {str(data)[:80]}", flush=True)
            continue
        img_bytes = base64.b64decode(data['image'])
        filepath = os.path.join(AVATAR_DIR, f"{p['id']}.webp")
        with open(filepath, 'wb') as f:
            f.write(img_bytes)
        count += 1
        print(f"[{count}] ✓ {p['id']} ({len(img_bytes)//1024}KB)", flush=True)
    except Exception as e:
        errors += 1
        print(f"[{count+1}] ✗ {p['id']}: {e}", flush=True)
    
    time.sleep(2)

print(f"\nDone! Generated: {count}, Errors: {errors}", flush=True)
