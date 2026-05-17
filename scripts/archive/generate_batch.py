#!/usr/bin/env python3
"""
Generate all 289 ClawSouls avatars via Colab API
"""

import json
import base64
import os
import time
import urllib.request
import urllib.error
from pathlib import Path

# Config
API_URL = os.environ.get("CLAWSOUL_API_URL", "http://localhost:8000")
TOKEN = os.environ.get("CLAWSOUL_TOKEN")
if not TOKEN:
    raise ValueError("CLAWSOUL_TOKEN env var is required")
PROMPTS_FILE = Path(__file__).parent.parent / "clawsouls_cyberpunk_prompts.json"
OUTPUT_DIR = Path("/tmp/clawsouls_avatars")
LOG_FILE = OUTPUT_DIR / "_generation_log.json"

# Rate limiting
DELAY_BETWEEN_REQUESTS = 2.5  # seconds
MAX_RETRIES = 3

def load_prompts():
    with open(PROMPTS_FILE) as f:
        return json.load(f)

def generate_avatar(prompt_data):
    """Generate a single avatar via API"""
    url = f"{API_URL}/generate?token={TOKEN}"
    
    data = json.dumps({
        "name": prompt_data["name"],
        "custom_prompt": prompt_data["prompt"]
    }).encode()
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                result = json.loads(resp.read().decode())
                return result
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f"   ⚠️  Rate limited, waiting 5s...")
                time.sleep(5)
                continue
            raise
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                print(f"   ⚠️  Retry {attempt+1}/{MAX_RETRIES}: {e}")
                time.sleep(3)
                continue
            raise

def save_image(img_b64, name):
    """Save base64 image to file"""
    img_bytes = base64.b64decode(img_b64)
    safe_name = "".join(c if c.isalnum() or c in "._-" else "_" for c in name.lower().strip())
    path = OUTPUT_DIR / f"{safe_name}.png"
    path.write_bytes(img_bytes)
    return path

def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    prompts = load_prompts()
    total = len(prompts)
    
    print(f"🎨 Generating {total} avatars...")
    print(f"   API: {API_URL}")
    print(f"   Output: {OUTPUT_DIR}")
    print()
    
    results = []
    success = 0
    failed = 0
    
    for i, p in enumerate(prompts, 1):
        print(f"[{i}/{total}] {p['name']}...", end=" ")
        try:
            result = generate_avatar(p)
            path = save_image(result["image_base64"], p["name"])
            print(f"✅ {result['elapsed_s']}s")
            results.append({"id": p["id"], "name": p["name"], "path": str(path), "status": "ok"})
            success += 1
        except Exception as e:
            print(f"❌ {e}")
            results.append({"id": p["id"], "name": p["name"], "error": str(e), "status": "failed"})
            failed += 1
        
        time.sleep(DELAY_BETWEEN_REQUESTS)
    
    # Save log
    LOG_FILE.write_text(json.dumps({
        "total": total, "success": success, "failed": failed,
        "results": results
    }, indent=2))
    
    print()
    print(f"📊 Complete: {success} OK, {failed} failed")
    print(f"   Log: {LOG_FILE}")

if __name__ == "__main__":
    main()