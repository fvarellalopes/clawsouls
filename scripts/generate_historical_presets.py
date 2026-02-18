#!/usr/bin/env python3
"""
Extract historical figures from IMDB and HistoryExtra sources and generate additional presets.
"""

import json
import re
from pathlib import Path

# 1. Load existing IDs to avoid duplicates
existing_ids = set()
with open("/root/clawsouls/data/presets.ts", "r", encoding="utf-8") as f:
    for line in f:
        if line.strip().startswith('id: "'):
            char_id = line.split('"')[1]
            existing_ids.add(char_id)

print(f"Existing IDs: {len(existing_ids)}")

# 2. New names from sources (manually curated from extraction)
new_historical_figures = [
    # IMDB list (influential people)
    "Jesus Christ",
    "Napoleon Bonaparte",
    "Muhammad",
    "William Shakespeare",
    "Abraham Lincoln",
    "George Washington",
    "Adolf Hitler",
    "Aristotle",
    "Alexander the Great",
    "Thomas Jefferson",
    "Henry VIII",
    "Charles Darwin",
    "Queen Elizabeth",
    "Elizabeth I",
    "Augustus Caesar",
    "Julius Caesar",
    "Cleopatra",
    "Boudica",
    "King Arthur",
    "Wu Zetian",
    "Alfred the Great",
    "Aethelflaed",
    "Hatshepsut",
    "Amenhotep III",
    "Ashoka",
    "Genghis Khan",
    "Miyamoto Musashi",
    "Sun Tzu",
    "Confucius",
    "Buddha",
    "Jesus",
    "Muhammad",
    "Martin Luther",
    "Martin Luther King Jr.",
    "Nelson Mandela",
    "Mahatma Gandhi",
    "Winston Churchill",
    "Queen Victoria",
    "Catherine the Great",
    "Joan of Arc",
    "William Wallace",
    "Robin Hood",
    "Isaac Newton",
    "Albert Einstein",
    "Nikola Tesla",
    "Marie Curie",
    "Galileo Galilei",
    "Charles Darwin",
    "Louis Pasteur",
    "Thomas Edison",
    "Alexander Graham Bell",
    "Leonardo da Vinci",
    "Michelangelo",
    "Raphael",
    "Donatello",
    "Botticelli",
    "Van Gogh",
    "Pablo Picasso",
    "Claude Monet",
    "Rembrandt",
    "Frida Kahlo",
    "Georgia O'Keeffe",
    "Jackson Pollock",
    "Mark Rothko",
    "Wolfgang Amadeus Mozart",
    "Ludwig van Beethoven",
    "Johann Sebastian Bach",
    "Frédéric Chopin",
    "Pyotr Ilyich Tchaikovsky",
    "Igor Stravinsky",
    "John Lennon",
    "Bob Dylan",
    "Michael Jackson",
    "Elvis Presley",
    "Frank Sinatra",
    "David Bowie",
    "Marilyn Monroe",
    "Audrey Hepburn",
    "Charlie Chaplin",
]

# Remove duplicates with existing
def slugify(name):
    return re.sub(r'[^a-z0-9]', '-', name.lower().strip())

new_unique = []
for name in new_historical_figures:
    slug = slugify(name)
    if slug not in existing_ids:
        new_unique.append(name)
        existing_ids.add(slug)  # avoid within new list duplicates

print(f"New unique figures to add: {len(new_unique)}")

# 3. Generate preset entries (similar to previous style)
preset_entries = []
for name in new_unique:
    char_id = slugify(name)
    creature = "Historical Figure"
    vibe = "Influential historical personality with lasting impact on human civilization."
    emoji = "🏛️"
    tags = ["historical", "influential"]
    
    preset = f"""  {{
    id: "{char_id}",
    name: "{name}",
    creature: "{creature}",
    vibe: "{vibe}",
    emoji: "{emoji}",
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
    source: "historical",
  }},"""
    preset_entries.append(preset)

print(f"Generated {len(preset_entries)} presets")

# Output
output_path = Path("/root/clawsouls/generated-presets-historical.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write('\n'.join(preset_entries))

print(f"Written to {output_path}")
