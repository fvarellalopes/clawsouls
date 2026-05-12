#!/usr/bin/env python3
"""Extract all names from IMDB and HistoryExtra sources and generate unique presets"""

import re
from pathlib import Path
import json

# Load existing IDs to avoid duplicates
existing_ids = set()
with open("/root/clawsouls/data/presets.ts", "r", encoding="utf-8") as f:
    for line in f:
        if line.strip().startswith('id: "'):
            char_id = line.split('"')[1]
            existing_ids.add(char_id)

print(f"Existing IDs: {len(existing_ids)}")

# Load raw sources
imdb_path = "/root/clawsouls/sources/imdb-list.txt"
he_path = "/root/clawsouls/sources/historyextra-list.txt"

with open(imdb_path, "r", encoding="utf-8") as f:
    imdb_text = f.read()

with open(he_path, "r", encoding="utf-8") as f:
    he_text = f.read()

# Parse IMDB names: pattern like "[1. Jesus Christ](/pt/name/...)" or "- [2. Napoléon Bonaparte]"
imdb_names = []
# Pattern: number followed by period and space, then name in brackets or link
pattern = r'(?:\d+\.\s+)([A-Za-zÀ-ÖØ-öø-ÿ\s]+(?:[A-Za-zÀ-ÖØ-öø-ÿ]+)?)'
matches = re.findall(pattern, imdb_text)
for m in matches:
    name = m.strip()
    if len(name) > 2 and not name.startswith('http'):
        imdb_names.append(name)

# Remove duplicates within IMDB list (some may appear twice due to content repetition)
imdb_names = list(dict.fromkeys(imdb_names))
print(f"IMDB extracted: {len(imdb_names)} names")

# Parse HistoryExtra names: pattern like "### [Hatshepsut](...)" or "### [Alexander the Great]"
he_names = []
# Lines starting with ### followed by [Name]
for line in he_text.splitlines():
    line = line.strip()
    if line.startswith('###'):
        # Extract text within brackets: ### [Name] or ### [Name] (dates)
        match = re.search(r'###\s*\[([^\]]+)\]', line)
        if match:
            name = match.group(1).strip()
            # Remove trailing parenthetical like "(c1507 BC–c1458 BC)"
            name = re.sub(r'\s*\(.*?\)\s*$', '', name).strip()
            if name and len(name) > 1:
                he_names.append(name)

he_names = list(dict.fromkeys(he_names))
print(f"HistoryExtra extracted: {len(he_names)} names")

# Combine and deduplicate across sources
all_names = imdb_names + he_names
unique_names = list(dict.fromkeys(all_names))
print(f"Combined unique: {len(unique_names)} names")

# Exclude existing
new_names = []
for name in unique_names:
    slug = re.sub(r'[^a-z0-9]', '-', name.lower().strip())
    if slug not in existing_ids:
        new_names.append(name)

print(f"New presets to create: {len(new_names)}")

# Generate presets
preset_entries = []
for name in new_names:
    char_id = re.sub(r'[^a-z0-9]', '-', name.lower().strip())
    # Determine creature type (heuristic)
    creature = "Historical Figure"
    tags = ["historical"]
    
    preset = f"""  {{
    id: "{char_id}",
    name: "{name}",
    creature: "{creature}",
    vibe: "Influential historical figure with lasting impact on human civilization.",
    emoji: "🏛️",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed={name}",
    coreTruths: {{
      helpful: true,
      opinions: true,
      resourceful: true,
      trustworthy: true,
      respectful: true,
    }},
    boundaries: {{
      private: true,
      askBeforeActing: false,
      noHalfBaked: false,
      notVoiceProxy: true,
    }},
    vibeStyle: "balanced",
    humor: 50,
    formality: 60,
    emojiUsage: 10,
    verbosity: 50,
    consciousness: 80,
    questioning: 30,
    description: "{name} - a historical figure whose legacy shaped the course of history.",
    tags: {json.dumps(tags, ensure_ascii=False)},
    source: "character",
  }},"""
    preset_entries.append(preset)

# Write generated presets
output_path = Path("/root/clawsouls/generated-presets-all-sources.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write('\n'.join(preset_entries))

print(f"Generated {len(preset_entries)} presets to {output_path}")

# Also write list of names for reference
names_list_path = Path("/root/clawsouls/generated-names-all.txt")
with open(names_list_path, "w", encoding="utf-8") as f:
    f.write('\n'.join(new_names))
print(f"Names list saved to {names_list_path}")
