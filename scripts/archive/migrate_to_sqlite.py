#!/usr/bin/env python3
"""Migrate presets from TypeScript file to SQLite database"""

import sqlite3
import re
import json
from pathlib import Path

DB_PATH = Path("/root/clawsouls/data/database.sqlite")
PRESETS_TS = Path("/root/clawsouls/data/presets.ts")

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def parse_presets_ts(filepath):
    """Parse the TypeScript presets.ts file and extract preset objects as dicts"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the array of presets between export const presets: ... = [ and ];
    match = re.search(r'export const presets:.*?=\s*\[(.*?)\];', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find presets array")

    array_content = match.group(1)

    # Split into individual objects - each starts with "  {"
    # This is a bit fragile but works for the current format
    objects = []
    current = []
    brace_count = 0
    for line in array_content.splitlines(keepends=True):
        stripped = line.strip()
        if stripped.startswith('{'):
            brace_count = 1
            current = [line]
        elif brace_count > 0:
            current.append(line)
            brace_count += line.count('{') - line.count('}')
            if brace_count == 0:
                objects.append(''.join(current))
        # else skip

    presets = []
    for obj_str in objects:
        # Parse key-value pairs
        preset = {}
        # Remove outer braces
        obj_str = obj_str.strip()[1:-1].strip()
        # Split by commas at top level (not inside nested objects)
        # Simple approach: use regex for each field
        patterns = [
            (r'id:\s*"([^"]+)"', 'id'),
            (r'name:\s*"([^"]+)"', 'name'),
            (r'creature:\s*"([^"]+)"', 'creature'),
            (r'vibe:\s*"([^"]+)"', 'vibe'),
            (r'emoji:\s*"([^"]+)"', 'emoji'),
            (r'avatar:\s*"([^"]+)"', 'avatar'),
            (r'description:\s*"([^"]+)"', 'description'),
            (r'source:\s*"([^"]+)"', 'source'),
            (r'vibeStyle:\s*"([^"]+)"', 'vibe_style'),
            (r'humor:\s*(\d+)', 'humor'),
            (r'formality:\s*(\d+)', 'formality'),
            (r'emojiUsage:\s*(\d+)', 'emoji_usage'),
            (r'verbosity:\s*(\d+)', 'verbosity'),
            (r'consciousness:\s*(\d+)', 'consciousness'),
            (r'questioning:\s*(\d+)', 'questioning'),
        ]
        for pattern, key in patterns:
            m = re.search(pattern, obj_str)
            if m:
                preset[key] = m.group(1)

        # coreTruths and boundaries are nested objects; convert to individual columns
        # coreTruths: helpful, opinions, resourceful, trustworthy, respectful
        ct_match = re.search(r'coreTruths:\s*\{(.*?)\}', obj_str, re.DOTALL)
        if ct_match:
            ct_str = ct_match.group(1)
            for ct_key in ['helpful', 'opinions', 'resourceful', 'trustworthy', 'respectful']:
                if f'{ct_key}: true' in ct_str:
                    preset[f'core_truths_{ct_key}'] = True
                elif f'{ct_key}: false' in ct_str:
                    preset[f'core_truths_{ct_key}'] = False

        # boundaries: private, askBeforeActing, noHalfBaked, notVoiceProxy
        b_match = re.search(r'boundaries:\s*\{(.*?)\}', obj_str, re.DOTALL)
        if b_match:
            b_str = b_match.group(1)
            mapping = {
                'private': 'boundaries_private',
                'askBeforeActing': 'boundaries_ask_before_acting',
                'noHalfBaked': 'boundaries_no_half_baked',
                'notVoiceProxy': 'boundaries_not_voice_proxy'
            }
            for b_key, db_key in mapping.items():
                if f'{b_key}: true' in b_str:
                    preset[db_key] = True
                elif f'{b_key}: false' in b_str:
                    preset[db_key] = False

        # tags: extract JSON array
        tags_match = re.search(r'tags:\s*(\[[^\]]*\])', obj_str)
        if tags_match:
            try:
                preset['tags'] = json.loads(tags_match.group(1))
            except json.JSONDecodeError:
                preset['tags'] = []
        else:
            preset['tags'] = []

        if 'id' in preset:
            presets.append(preset)

    print(f"Parsed {len(presets)} presets from TypeScript file")
    return presets

def create_database(presets):
    """Create SQLite DB and populate with presets"""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Create schema
    cur.executescript(Path("/root/clawsouls/data/migrations/001_initial_schema.sql").read_text())

    # Insert presets
    inserted = 0
    for p in presets:
        try:
            cur.execute("""
                INSERT INTO presets (
                    id, name, creature, vibe, emoji, avatar,
                    core_truths_helpful, core_truths_opinions, core_truths_resourceful,
                    core_truths_trustworthy, core_truths_respectful,
                    boundaries_private, boundaries_ask_before_acting,
                    boundaries_no_half_baked, boundaries_not_voice_proxy,
                    vibe_style, humor, formality, emoji_usage, verbosity,
                    consciousness, questioning, description, tags, source
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p.get('id'),
                p.get('name'),
                p.get('creature', 'Human'),
                p.get('vibe'),
                p.get('emoji', '😊'),
                p.get('avatar'),
                p.get('core_truths_helpful', True),
                p.get('core_truths_opinions', True),
                p.get('core_truths_resourceful', True),
                p.get('core_truths_trustworthy', True),
                p.get('core_truths_respectful', True),
                p.get('boundaries_private', True),
                p.get('boundaries_ask_before_acting', False),
                p.get('boundaries_no_half_baked', False),
                p.get('boundaries_not_voice_proxy', True),
                p.get('vibe_style', 'balanced'),
                int(p.get('humor', 50)),
                int(p.get('formality', 50)),
                int(p.get('emoji_usage', 10)),
                int(p.get('verbosity', 50)),
                int(p.get('consciousness', 50)),
                int(p.get('questioning', 30)),
                p.get('description'),
                json.dumps(p.get('tags', []), ensure_ascii=False),
                p.get('source', 'character')
            ))
            inserted += 1
        except sqlite3.IntegrityError as e:
            print(f"Skipping duplicate id {p.get('id')}: {e}")

    conn.commit()
    conn.close()
    print(f"✅ Database created at {DB_PATH} with {inserted} presets")

if __name__ == "__main__":
    presets = parse_presets_ts(PRESETS_TS)
    create_database(presets)
