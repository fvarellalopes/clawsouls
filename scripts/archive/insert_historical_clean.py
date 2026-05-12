#!/usr/bin/env python3
"""Insert 77 historical presets after the last existing preset, before the array closing."""

presets_path = "/root/clawsouls/data/presets.ts"
historical_path = "/root/clawsouls/generated-presets-historical.txt"

with open(presets_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find line that contains "},];" (the closing of last preset plus array close)
target_idx = None
for i, line in enumerate(lines):
    if "},];" in line:
        target_idx = i
        break

if target_idx is None:
    print("ERROR: Could not find line with '},];'")
    exit(1)

# Read historical presets
with open(historical_path, "r", encoding="utf-8") as f:
    historical_lines = f.readlines()

# Ensure each historical preset ends with a comma? They already end with ","
# We'll keep them as is.

# Replace the line "  },];" with:
#   "  },\n"  (the closing of last preset with comma)
# + historical_lines
# + "];\n"
new_lines = lines[:target_idx] + ["  },\n"] + historical_lines + ["];\n"] + lines[target_idx+1:]

# Write back
with open(presets_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"Inserted {len(historical_lines)} historical presets at line {target_idx+1}")
print(f"Total lines: {len(new_lines)}")
