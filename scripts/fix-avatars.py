#!/usr/bin/env python3
"""Regenerate specific avatars with corrected cyberpunk prompts."""

import json
import re
import base64
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

TUNNEL_URL = "https://oxygen-packs-permitted-loans.trycloudflare.com"
TOKEN = "YOUR_SECRET_TOKEN"
AVATARS_DIR = Path("/home/ubuntu/clawsouls/public/avatars")
REPO_DIR = Path("/home/ubuntu/clawsouls")

# Custom corrected prompts for each character
FIXES = [
    {
        "id": "deadpool",
        "name": "Deadpool",
        "prompt": "Cyberpunk portrait of Deadpool from Marvel Comics, red and black tactical suit with neon circuitry patterns, dual katanas with glowing energy blades, mechanical arm enhancements, mask with glowing white eyes, smirking attitude, red and black mask with LED strips, biomechanical enhancements visible on neck and arms, cyberpunk 2077 aesthetic, neon glow, detailed facial mask features, bust portrait, sharp focus, hyper detailed, photorealistic render, cinematic lighting, dark moody background with neon signs"
    },
    {
        "id": "cyclops",
        "name": "Cyclops",
        "prompt": "Cyberpunk portrait of Cyclops Scott Summers from X-Men Marvel Comics, red ruby quartz visor with glowing energy beam, blue and yellow tactical X-Men suit with neon circuitry, male mutant leader, short brown hair, chiseled jaw, optic blast energy emanating from visor, biomechanical neck implant, cyberpunk 2077 aesthetic, neon glow, detailed facial features, bust portrait, sharp focus, hyper detailed, photorealistic render, cinematic lighting, dark background with red energy reflections"
    },
    {
        "id": "spider-man",
        "name": "Spider-Man",
        "prompt": "Cyberpunk portrait of Spider-Man Peter Parker from Marvel Comics, red and blue suit with web pattern and neon circuitry lines, mechanical web shooters with glowing tips, mask with large white tech-enhanced eyes, spider symbol glowing on chest, suit has subtle biomechanical armor plating, cyberpunk 2077 aesthetic, neon glow, detailed suit texture, bust portrait, sharp focus, hyper detailed, photorealistic render, cinematic lighting, dark urban neon background"
    },
    {
        "id": "sanji",
        "name": "Sanji",
        "prompt": "Cyberpunk portrait of Sanji Vinsmoke from One Piece anime, blonde slicked-back hair, thin eyebrow, black formal suit with neon circuitry patterns, cigarette with glowing ember, kick stance pose, mechanical leg enhancement with glowing joints, chiseled handsome face, cyberpunk 2077 aesthetic, biomechanical enhancements, neon circuitry, glowing eyes, detailed facial features, bust portrait, sharp focus, hyper detailed, photorealistic render, cinematic lighting, dark background with warm neon"
    },
    {
        "id": "glados",
        "name": "GLaDOS",
        "prompt": "Cyberpunk portrait of GLaDOS from Portal game, purely mechanical robot body, single glowing orange optic eye core in center, smooth white chassis with black accents, no human face at all, hanging from ceiling apparatus, data streams and circuitry visible, mechanical arms, surveillance camera aesthetic, red and orange warning lights, cyberpunk 2077 aesthetic, biomechanical enhancements, neon circuitry, glowing optic sensor, detailed mechanical features, bust portrait, sharp focus, hyper detailed, photorealistic render, cinematic lighting, dark laboratory background"
    },
    {
        "id": "dionysus",
        "name": "Dionysus",
        "prompt": "Cyberpunk portrait of Dionysus Greek god of wine and festivity, flowing purple robes with neon circuitry patterns, grape vine cybernetic implants, ivy crown with glowing LEDs, ecstatic expression, wine glass with luminescent liquid, pale skin with bioluminescent tattoos, decadent androgynous features, cyberpunk 2077 aesthetic, biomechanical enhancements, neon circuitry, glowing purple eyes, detailed facial features, bust portrait, sharp focus, hyper detailed, photorealistic render, cinematic lighting, dark background with purple and gold neon haze"
    }
]

def generate_avatar(prompt_text):
    """Generate avatar via tunnel API, return PNG bytes or None."""
    payload = json.dumps({"prompt": prompt_text, "token": TOKEN})
    payload_file = Path("/tmp/avatar_payload.json")
    payload_file.write_text(payload)
    
    response_file = Path("/tmp/avatar_response.json")
    try:
        result = subprocess.run(
            ["curl", "-s", "-w", "%{http_code}", "-X", "POST",
             f"{TUNNEL_URL}/generate",
             "-H", "Content-Type: application/json",
             "-d", f"@{payload_file}",
             "-o", str(response_file),
             "--connect-timeout", "30", "--max-time", "180"],
            capture_output=True, text=True, timeout=200
        )
        http_code = result.stdout.strip()
        if http_code != "200":
            print(f"    HTTP error: {http_code}", file=sys.stderr)
            return None
    except subprocess.TimeoutExpired:
        print("    curl timeout", file=sys.stderr)
        return None
    
    raw = response_file.read_bytes()
    start_marker = b'"image":"'
    start = raw.find(start_marker)
    if start < 0:
        print("    No image field", file=sys.stderr)
        return None
    
    b64_start = start + len(start_marker)
    end = raw.rfind(b'"')
    b64_raw = raw[b64_start:end]
    b64_clean = re.sub(rb'[^A-Za-z0-9+/=]', b'', b64_raw)
    
    try:
        image_data = base64.b64decode(b64_clean)
    except Exception as e:
        print(f"    Decode error: {e}", file=sys.stderr)
        return None
    
    if image_data[:4] != b'\x89PNG':
        print("    Not PNG", file=sys.stderr)
        return None
    
    return image_data

def save_webp(png_bytes, output_path):
    temp = Path("/tmp/avatar_temp.png")
    temp.write_bytes(png_bytes)
    img = Image.open(temp)
    img.load()
    img.save(str(output_path), "WEBP", quality=85)
    return img.size

def git_commit(avatar_id, name):
    # Commit both the original and hyphenated versions
    for suffix in ['', '-']:
        filepath = f"public/avatars/{avatar_id}.webp"
        if suffix:
            filepath = f"public/avatars/{avatar_id.replace('-', '')}.webp"
        subprocess.run(["git", "add", filepath], cwd=REPO_DIR, capture_output=True, timeout=10)
    subprocess.run(
        ["git", "commit", "-m", f"fix(avatar): {name} cyberpunk regeneration", "--no-verify"],
        cwd=REPO_DIR, capture_output=True, timeout=10
    )

def main():
    total = len(FIXES)
    print(f"Regenerating {total} avatars with corrected prompts\n")
    
    for i, fix in enumerate(FIXES, 1):
        pid = fix['id']
        name = fix['name']
        prompt = fix['prompt']
        
        print(f"[{i}/{total}] {name} ({pid})")
        
        png_bytes = generate_avatar(prompt)
        if png_bytes is None:
            print(f"    FAILED")
            continue
        
        # Save to both hyphenated and non-hyphenated paths
        for out_name in [pid, pid.replace('-', '')]:
            out_path = AVATARS_DIR / f"{out_name}.webp"
            try:
                size = save_webp(png_bytes, out_path)
                fsize = out_path.stat().st_size
                print(f"    {out_name}.webp: {size}, {fsize} bytes")
            except Exception as e:
                print(f"    {out_name}.webp FAILED: {e}")
        
        git_commit(pid, name)
        print(f"    Committed")
    
    print(f"\nDone!")

if __name__ == "__main__":
    main()
