import json, os, time, requests, subprocess, sys, base64, shutil, tempfile

API_URL = "https://trip-vinyl-pet-examining.trycloudflare.com"
TOKEN = "cs-secret-2026"
AVATARS_DIR = "public/avatars"

os.makedirs(AVATARS_DIR, exist_ok=True)

with open("clawsouls_cyberpunk_prompts.json") as f:
    data = json.load(f)

existing = set(os.listdir(AVATARS_DIR))

def get_filename(name):
    return name.lower().replace(" ", "-").replace("/", "-").replace(".", "").replace(";", "").replace("'", "") + ".png"

def is_generated(name):
    fname = get_filename(name)
    for f in existing:
        if f.replace(".png", "") == fname.replace(".png", ""):
            return True
    return False

def generate_one(prompt_text):
    resp = requests.post(
        f"{API_URL}/generate",
        json={"prompt": prompt_text, "steps": 8, "cfg_scale": 0, "width": 1024, "height": 1024, "token": TOKEN},
        timeout=300
    )
    resp.raise_for_status()
    result = resp.json()
    # Decode base64 image
    img_b64 = result.get("image", "")
    return base64.b64decode(img_b64)

def git_commit_push(filename, name):
    subprocess.run(["git", "add", f"{AVATARS_DIR}/{filename}"], check=True)
    r = subprocess.run(["git", "commit", "-m", f"feat: add {name} avatar"], capture_output=True, text=True)
    if r.returncode == 0:
        subprocess.run(["git", "push"], check=True)
        return True
    return False

# Find next to generate
next_idx = None
for i, p in enumerate(data):
    if not is_generated(p["name"]):
        next_idx = i
        break

if next_idx is None:
    print("ALL DONE!")
    sys.exit(0)

total = sum(1 for p in data if not is_generated(p["name"]))
print(f"Starting from [{next_idx}] {data[next_idx]['name']} — {total} remaining", flush=True)

count = 0
for i in range(next_idx, len(data)):
    p = data[i]
    name = p["name"]

    if is_generated(name):
        continue

    fname = get_filename(name)
    prompt = p["prompt"]

    print(f"\n[{i:3d}/{len(data)}] Generating {name}...", flush=True)

    retries = 3
    img_bytes = None
    for attempt in range(retries):
        try:
            img_bytes = generate_one(prompt)
            break
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}", flush=True)
            if attempt < retries - 1:
                time.sleep(30)
            else:
                print(f"  SKIPPING {name} after {retries} attempts", flush=True)

    if img_bytes is None:
        continue

    # Save image
    dest = os.path.join(AVATARS_DIR, fname)
    with open(dest, "wb") as f:
        f.write(img_bytes)

    # Git commit + push
    try:
        committed = git_commit_push(fname, name)
        status = "pushed" if committed else "committed (no remote change)"
    except Exception as e:
        status = f"commit failed: {e}"

    existing.add(fname)
    count += 1
    print(f"  {status} ({count} done this run)", flush=True)

    # Delay between requests (skip on last)
    remaining = sum(1 for j in range(i+1, len(data)) if not is_generated(data[j]["name"]))
    if remaining > 0:
        print(f"  Waiting 1 min... ({remaining} left)", flush=True)
        time.sleep(60)

print(f"\n=== DONE: {count} avatars generated this run ===", flush=True)
