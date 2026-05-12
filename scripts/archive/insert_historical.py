#!/usr/bin/env python3
"""Insert generated historical presets before closing ];"""

import sys

presets_path = "/root/clawsouls/data/presets.ts"
generated_path = "/root/clawsouls/generated-presets-historical.txt"

with open(presets_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find closing bracket line (may be "];" or "  },];")
closing_idx = None
for i in range(len(lines)-1, -1, -1):
    stripped = lines[i].strip()
    if stripped == "];" or stripped == "},":
        # If it's }, maybe we need to find the array close
        if stripped == "},":
            # check if this is within array context (has semicolon after)
            continue
        if stripped == "]":
            closing_idx = i
            break
    if "];" in stripped:
        closing_idx = i
        break

if closing_idx is None:
    print("Could not find closing ]; in presets.ts")
    sys.exit(1)

# Read generated presets
with open(generated_path, "r", encoding="utf-8") as f:
    generated_lines = f.readlines()

# Insert before closing bracket
lines = lines[:closing_idx] + generated_lines + lines[closing_idx:]

# Write back
with open(presets_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"Inserted {len(generated_lines)} historical presets before line {closing_idx+1}")
