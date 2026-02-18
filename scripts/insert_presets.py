#!/usr/bin/env python3
"""Insert generated presets before the closing ]; of presets.ts"""

import sys

presets_path = "/root/clawsouls/data/presets.ts"
generated_path = "/root/clawsouls/generated-presets-200.txt"

with open(presets_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find closing bracket line
closing_idx = None
for i, line in enumerate(lines):
    if line.strip() == "];":
        closing_idx = i
        break

if closing_idx is None:
    print("Could not find closing ]; in presets.ts")
    sys.exit(1)

# Read generated presets
with open(generated_path, "r", encoding="utf-8") as f:
    generated_lines = f.readlines()

# Insert before closing bracket
lines = lines[:closing_idx] + generated_lines + [lines[closing_idx]]

# Write back
with open(presets_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"Inserted {len(generated_lines)} lines before line {closing_idx+1} (])")
