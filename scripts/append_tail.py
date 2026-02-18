#!/usr/bin/env python3
# Append tail definitions from original (attributeOptions etc) after the array closing

original_tail_start = 634  # line after ] in original (1-indexed)
original_tail_end = 699    # inclusive

original_path = "/tmp/original-presets.ts"
new_path = "/root/clawsouls/data/presets.ts"

with open(original_path, "r", encoding="utf-8") as f:
    original_lines = f.readlines()

tail_lines = original_lines[original_tail_start-1:original_tail_end]  # 0-index

with open(new_path, "r", encoding="utf-8") as f:
    new_lines = f.readlines()

# Find the line with the closing bracket (should be near the end)
closing_idx = None
for i in range(len(new_lines)-1, -1, -1):
    if new_lines[i].strip() == "],":  # might be "],;"? Actually our closing line is "  },];"
        closing_idx = i
        break
    if new_lines[i].strip() == "];":
        closing_idx = i
        break

if closing_idx is None:
    # try find "},];"
    for i in range(len(new_lines)-1, -1, -1):
        if "};" in new_lines[i] or "];" in new_lines[i]:
            closing_idx = i
            break

if closing_idx is None:
    print("Could not locate closing bracket line")
    sys.exit(1)

# Insert tail after closing bracket line
new_lines = new_lines[:closing_idx+1] + tail_lines + new_lines[closing_idx+1:]

with open(new_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"Appended {len(tail_lines)} tail lines after line {closing_idx+1}")
