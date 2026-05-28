#!/usr/bin/env python3
"""
Classify existing presets as NSFW based on their content.

Criteria for NSFW:
- Characters with sexually suggestive or explicit vibes
- Demons/succubi/incubi
- Anime/manga characters known for fan service
- Gods/goddesses associated with fertility, pleasure, seduction
- Characters with tags like "sedutora", "sensual", "femme fatale"

NOT NSFW:
- Real living people (Adele, Beyoncé, Taylor Swift, etc.)
- Action/adventure characters without sexual content
- Children's characters (Harry Potter, young Naruto, etc.)
"""

import re
from pathlib import Path

# NSFW keywords to search for in name, creature, vibe, description, tags
NSFW_KEYWORDS = [
    # Portuguese
    "sedutor", "sedutora", "sensual", "sexy", "fogo", "paixão", "desejo",
    "femme fatale", "súcubo", "sucubus", "incubo", "incubus",
    "deusa do amor", "deusa da beleza", "fertilidade", "prazer",
    "nua", "nu", "pelada", "pelado", "erótico", "erótica", "erotismo",
    "prostituta", "cortesã", "cortesão", "devassa", "devasso",
    # English
    "seductress", "seductive", "sensual", "sexy", "passion", "desire",
    "femme fatale", "succubus", "incubus",
    "goddess of love", "goddess of beauty", "fertility", "pleasure",
    "nude", "naked", "erotic", "erotica",
    "prostitute", "courtesan", "harlot", "mistress",
    # Specific characters known to be NSFW
    "lilith", "lilit", "lilithu",
    "aphrodite", "venus", "freya", "freyja",
    "cleopatra", "cleópatra",
    "mata hari",
    "lady dimitrescu",
    "bayonetta",
    "2b", "a2", "nier",
    "tifa", "aerith",
    "widowmaker", "viúva negra",
    "morrigan", "darkstalker",
    "chun-li", "chunli",
    "poison", "final fight",
    "quiet", "metal gear",
    "triss", "yennefer", "witcher",
    "lara croft",
    "samus aran",
    "jessica rabbit",
    # Anime/manga NSFW characters
    "asuka", "evangelion",
    "rei ayanami",
    "zero two", "darling",
    "raphtalia",
    "albedo", "overlord",
    "darkness", "konosuba",
    "aqua", "konosuba",
    "megumin", "konosuba",
    "rias", "highschool dxd",
    "akeno", "highschool dxd",
    # Real people who should NOT be NSFW (exclusion list)
    # These will be checked separately
]

# Real living people - EXCLUDE from NSFW
REAL_PEOPLE = [
    "adele", "beyonce", "beyoncé", "taylor swift", "taylor",
    "ed sheeran", "drake", "rihanna", "katy perry",
    "lady gaga", "gaga", "bruno mars", "justin bieber",
    "ariana grande", "dua lipa", "billie eilish",
    "the weeknd", "weeknd", "post malone", "travis scott",
    "kanye", "kanye west", "ye", "jay-z", "jay z",
    "eminem", "marshall", "mathers",
    "nicki minaj", "cardi b", "megan thee stallion",
    "doja cat", "sza", "lizzo",
    "harry styles", "niall horan", "zayn malik", "liam payne", "louis tomlinson",
    "shawn mendes", "camila cabello",
    "olivia rodrigo", "sabrina carpenter",
    "bad bunny", "j balvin", "ozuna",
    "maluma", "j balvin", "bad bunny",
    # Actors
    "tom cruise", "brad pitt", "leonardo dicaprio",
    "angelina jolie", "scarlett johansson",
    "dwayne johnson", "the rock", "keanu reeves",
    "ryan reynolds", "chris hemsworth", "chris evans",
    "margot robbie", "emma stone", "jennifer lawrence",
    # Tech/business
    "elon musk", "musk", "jeff bezos", "bezos",
    "mark zuckerberg", "zuckerberg", "bill gates", "gates",
    "steve jobs", "jobs",
    # Historical figures (not NSFW unless explicitly sexual)
    "einstein", "newton", "tesla", "edison",
    "napoleon", "caesar", "cleopatra",  # cleopatra IS NSFW
    "shakespeare", "mozart", "beethoven",
    "gandhi", "mandela", "churchill",
    # Fictional children's characters
    "harry potter", "hermione", "ron weasley",
    "pikachu", "ash ketchum", "pokemon",
    "naruto", "sasuke", "sakura",  # when young
    "goku", "vegeta", "dragon ball",
    "mickey mouse", "donald duck",
    "spongebob", "spongebob squarepants",
    "scooby-doo", "scooby doo",
    "tom", "jerry",
    # Superheroes (usually not NSFW)
    "superman", "clark kent",
    "batman", "bruce wayne",
    "wonder woman", "diana prince",
    "spider-man", "peter parker",
    "iron man", "tony stark",
    "captain america", "steve rogers",
    "thor", "loki",
    "black widow", "natasha romanoff",
    "hulk", "bruce banner",
    # More non-NSFW characters
    "sherlock holmes", "watson",
    "james bond", "007",
    "indiana jones",
    "jack sparrow",
    "neo", "matrix",
    "terminator", "t-800",
    "robocop",
    "alien", "xenomorph",
    "predator",
]

def is_real_person(name: str, creature: str) -> bool:
    """Check if this is a real living person."""
    name_lower = name.lower()
    creature_lower = creature.lower()
    
    for person in REAL_PEOPLE:
        if person in name_lower or person in creature_lower:
            return True
    return False

def classify_nsfw(preset: dict) -> bool:
    """Classify if a preset should be NSFW."""
    name = preset.get("name", "").lower()
    creature = preset.get("creature", "").lower()
    vibe = preset.get("vibe", "").lower()
    description = preset.get("description", "").lower()
    tags = " ".join(preset.get("tags", [])).lower()
    
    # Combine all text for searching
    all_text = f"{name} {creature} {vibe} {description} {tags}"
    
    # Skip real people
    if is_real_person(name, creature):
        return False
    
    # Check for NSFW keywords
    for keyword in NSFW_KEYWORDS:
        if keyword in all_text:
            return True
    
    return False

def main():
    presets_file = Path("/home/ubuntu/clawsouls/.worktrees/nsfw-mode/data/presets.ts")
    
    # Read the file
    content = presets_file.read_text()
    
    # Extract presets array using regex
    # This is a simplified approach - for production, use a proper TS parser
    presets_match = re.search(r'export const presets: SoulPreset\[\] = \[(.*?)\];', content, re.DOTALL)
    if not presets_match:
        print("Could not find presets array")
        return
    
    presets_text = presets_match.group(1)
    
    # Count presets
    preset_count = presets_text.count("{id:")
    print(f"Found {preset_count} presets")
    
    # For now, let's just identify which presets would be NSFW
    # In a real implementation, we'd parse the TS properly
    
    # Let's manually check some examples
    sample_presets = [
        {"name": "Lilith", "creature": "Demon", "vibe": "Queen of demons", "tags": ["demon", "seductive"]},
        {"name": "Aphrodite", "creature": "Goddess", "vibe": "Goddess of love", "tags": ["greek", "love"]},
        {"name": "Adele", "creature": "Human", "vibe": "Singer", "tags": ["music", "real"]},
        {"name": "Jack", "creature": "AI", "vibe": "Detective", "tags": ["detective", "noir"]},
    ]
    
    print("\nSample classifications:")
    for preset in sample_presets:
        result = classify_nsfw(preset)
        print(f"  {preset['name']}: {'NSFW' if result else 'SFW'}")

if __name__ == "__main__":
    main()
