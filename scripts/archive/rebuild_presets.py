#!/usr/bin/env python3
"""Rebuild presets.ts with proper formatting: combine existing + new presets, ensure correct commas and closing."""

import re

presets_path = "/root/clawsouls/data/presets.ts"
combined_path = "/root/clawsouls/generated-presets-combined.txt"
backup_path = "/root/clawsouls/data/presets.ts.backup"

# Read combined new presets (already in file after insertion? Actually we inserted them, so we could just fix commas.
# Simpler approach: Load everything, parse objects, rebuild.

# Read current file
with open(presets_path, "r", encoding="utf-8") as f:
    content = f.read()

# Split into lines
lines = content.splitlines(keepends=True)

# Find start of presets array
start_idx = None
for i, line in enumerate(lines):
    if "export const presets: SoulPreset[] = [" in line:
        start_idx = i
        break
if start_idx is None:
    print("ERROR: Could not find presets declaration")
    exit(1)

# Find the closing bracket of the array: line containing "];"
end_idx = None
for i in range(start_idx+1, len(lines)):
    stripped = lines[i].strip()
    if stripped == "];" or stripped.endswith("];"):
        end_idx = i
        break
if end_idx is None:
    print("ERROR: Could not find array closing ]")
    exit(1)

# Extract the objects between start_idx+1 and end_idx (inclusive of lines)
object_lines = lines[start_idx+1:end_idx]

# Now parse each object. They start with "  {" (indented) and end with a line containing "}," or "}" (maybe with commas)
# We'll group lines into objects.
objects = []
current_obj = []
for line in object_lines:
    stripped = line.strip()
    if stripped.startswith("{") or stripped.startswith("}") or current_obj:
        current_obj.append(line)
    if stripped == "}," or stripped == "}" or stripped.endswith("},") or stripped == "  },":
        # End of object
        objects.append(current_obj)
        current_obj = []
if current_obj:
    objects.append(current_obj)

print(f"Found {len(objects)} preset objects in file")

# Now we also need to add the combined new presets? Actually the insertion already placed them, but they are part of the extracted objects. To avoid duplication, we could just rebuild with all objects.

# Rebuild array: each object should end with "}," except last which ends with "}"
new_lines = [lines[0]]  # export line
for i, obj in enumerate(objects):
    # Ensure each object ends with a comma except last
    obj_lines = obj.copy()
    # The last line of obj should be something like "  }," or "  }". Make it consistent:
    last_idx = len(obj_lines) - 1
    last_line = obj_lines[last_idx].rstrip()
    # If last_line is "  }," and it's not last object, keep it. If it's "  }" without comma, add if not last.
    if i < len(objects) - 1:
        # Not last: ensure trailing comma
        if last_line.endswith(","):
            pass  # already has comma
        else:
            # Add comma after }
            if last_line == "  }":
                obj_lines[last_idx] = "  },\n"
            else:
                # maybe it's something like "  },"? we handle
                pass
    else:
        # Last object: ensure no trailing comma (except we might want to keep as is? Better no comma)
        if last_line.endswith(","):
            obj_lines[last_idx] = last_line.rstrip(',\n') + "\n"
        # else keep
    new_lines.extend(obj_lines)

# Add closing line "];"
new_lines.append("];\n")

# Append tail: everything after the original closing line
tail_lines = lines[end_idx+1:]
new_lines.extend(tail_lines)

# Write back
with open(presets_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"Rebuilt presets.ts with {len(objects)} presets")
print(f"Total lines: {len(new_lines)}")
