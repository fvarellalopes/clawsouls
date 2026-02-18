#!/usr/bin/env python3
"""Insert combined generated presets into presets.ts cleanly"""

presets_path = "/root/clawsouls/data/presets.ts"
combined_path = "/root/clawsouls/generated-presets-combined.txt"

with open(presets_path, "r", encoding="utf-8") as f:
    original_lines = f.readlines()

# Find the closing bracket line containing "];"
closing_idx = None
for i, line in enumerate(original_lines):
    if "];" in line and line.strip().startswith("}"):
        # This is likely the line with "},];"
        closing_idx = i
        break

if closing_idx is None:
    print("ERROR: Could not find closing '];' line")
    exit(1)

# Read combined presets
with open(combined_path, "r", encoding="utf-8") as f:
    combined_lines = f.readlines()

# Insert combined presets before closing bracket line
new_lines = original_lines[:closing_idx] + combined_lines + original_lines[closing_idx:]

# Write new file
with open(presets_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"Inserted {len(combined_lines)} new presets before line {closing_idx+1}")
print(f"Total lines now: {len(new_lines)}")
