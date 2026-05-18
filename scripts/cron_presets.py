#!/usr/bin/env python3
"""List unchecked presets with avatar files for vision analysis."""
import re, os

with open('data/presets.ts', 'r') as f:
    content = f.read()

entries = content.split('\nrecord(')

# Get all avatar filenames (no extension)
avatars = set(f.replace('.webp', '') for f in os.listdir('public/avatars') if f.endswith('.webp'))
print(f"Total avatar files: {len(avatars)}")

# Get all preset IDs with name/creature/vibe
presets = []
for entry in entries[1:]:
    pid = None; pname = None; pcreature = None; pvibe = None
    id_m = re.search(r"id:\s*['\"]([^'\"]+)['\"]", entry)
    name_m = re.search(r"name:\s*['\"]([^'\"]+)['\"]", entry)
    creature_m = re.search(r"creature:\s*['\"]([^'\"]+)['\"]", entry)
    vibe_m = re.search(r"vibe:\s*['\"]((?:(?!['\"]).)+)['\"]", entry)
    if id_m: pid = id_m.group(1)
    if name_m: pname = name_m.group(1)
    if creature_m: pcreature = creature_m.group(1)
    if vibe_m: pvibe = vibe_m.group(1)[:60]
    if pid:
        presets.append((pid, pname or '?', pcreature or '?', pvibe or '?'))

exact_matches = [p for p in presets if p[0] in avatars]
print(f"Exact matches: {len(exact_matches)}")

# Previous session's checked presets
checked = {"glados", "the-dude", "hal9000", "wheatley", "j4ck", "spider-man", 
           "sherlock-holmes", "yoda", "zen", "catwoman", "unicorn", "djinngenie"}

unchecked = [p for p in exact_matches if p[0] not in checked]
print(f"Unchecked exact-match presets: {len(unchecked)}")
print("---")
for pid, name, creature, vibe in unchecked[:30]:
    print(f"{pid}|{name}|{creature}|{vibe}")
