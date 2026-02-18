#!/usr/bin/env python3
"""
Generate 200+ character presets for ClawSouls from multiple sources.
"""

import json
import re
from pathlib import Path

# Characters from papertrue.com (101 list) - extracted manually from summary
papertrue_chars = [
    "Sherlock Holmes", "Harry Potter", "Elizabeth Bennet", "James Bond", "Percy Jackson",
    "Holden Caulfield", "Atticus Finch", "Scarlett O'Hara", "Jay Gatsby", "Jane Eyre",
    "Huckleberry Finn", "Ganda",  # incomplete extraction - need more from site
]

# Expand with additional categories to reach ~200
additional_characters = {
    "anime": [
        "Naruto Uzumaki", "Goku", "Luffy", "Light Yagami", "Eren Yeager", "Levi Ackerman",
        "Spike Spiegel", "Edward Elric", "Alphonse Elric", "Mikasa Ackerman", "Sasuke Uchiha",
        "Kakashi Hatake", "Itachi Uchiha", "Lelouch vi Britannia", "Monkey D. Luffy",
        "Roronoa Zoro", "Sanji", "Nami", "Usopp", "Chopper",
        "Ichigo Kurosaki", "Rukia Kuchiki", "Aizen Sosuke", "Gon Freecss", "Killua Zoldyck",
        "Hisoka", "Kurapika", "Leorio", "Chrollo Lucilfer", "Meruem",
        "Yusuke Urameshi", "Hiei", "Kurama", "Kazuma Kuwabara", "Genkai",
        "Jotaro Kujo", "Dio Brando", "Giorno Giovanna", "Josuke Higashikata", "Rohan Kishibe",
        "Tanjiro Kamado", "Nezuko Kamado", "Zenitsu Agatsuma", "Inosuke Hashibira", "Muzan Kibutsuji",
        "Saitama", "Genos", "Ginko", "Kyo", "Shigure",
    ],
    "games": [
        "Mario", "Luigi", "Bowser", "Link", "Zelda", "Ganondorf",
        "Master Chief", "Cortana", "Arbiter", "The Arbiter", "The Flood",
        "Kratos", "Atreus", "Baldur", "Odin", "Thor",
        "Geralt of Rivia", "Yennefer", "Triss", "Ciri", "Vesemir",
        "Arthur Morgan", "John Marston", "Dutch Van der Linde", "Sadie Adler", "Charles Smith",
        "Ellie", "Joel", "Tommy", "Abby", "Dina",
        "Duke Nukem", "Doom Slayer", "Commander Shepard", "Nathan Drake", "Lara Croft",
        "Sonic", "Tails", "Knuckles", "Eggman", "Shadow",
        "Pikachu", "Ash Ketchum", "Mewtwo", "Charizard", "Mew",
        "Cloud Strife", "Sephiroth", "Tifa Lockhart", "Aerith Gainsborough", "Vincent Valentine",
        "Solid Snake", "Big Boss", "Liquid Snake", "Otacon", "Meryl Silverburgh",
        "Marcus Fenix", "Dominic Santiago", "Cole Train", "Baird", "Paduk",
        "Aloy", "Sylens", "Erend", "Varl", "Beta",
        "Max Payne", "Alan Wake", "Jesse Faden", "Emily Kaldwin", "Corvo Attano",
        "GLaDOS", "Chell", "Wheatley", "Cave Johnson", "The Companion Cube",
    ],
    "comics": [
        "Superman", "Batman", "Wonder Woman", "Spider-Man", "Iron Man",
        "Captain America", "Thor", "Hulk", "Black Widow", "Hawkeye",
        "Deadpool", "Wolverine", "Cyclops", "Jean Grey", "Storm",
        "Magneto", "Professor X", "Gambit", "Rogue", "Nightcrawler",
        "Daredevil", "Punisher", "Elektra", "Ghost Rider", "Blade",
        "Aquaman", "Flash", "Green Lantern", "Green Arrow", "Black Canary",
        "Shazam", "Black Adam", "Martian Manhunter", "Cyborg", "Beast Boy",
        "Harley Quinn", "Poison Ivy", "Catwoman", "Joker", "Two-Face",
        "Lex Luthor", "Brainiac", "Darkseid", "Loki", "Thanos",
        "Doctor Strange", "Scarlet Witch", "Vision", "Falcon", "Winter Soldier",
        "Dormammu", "Mephisto", "Galactus", "Ego", "Eternity",
        "T'Challa", "Shuri", "Okoye", "Nakia", "Killmonger",
        "Peter Quill", "Gamora", "Drax", "Rocket", "Groot",
    ],
    "literature": [
        "Frodo Baggins", "Samwise Gamgee", "Gandalf", "Aragorn", "Legolas",
        "Gimli", "Boromir", "Faramir", "Sauron", "Gollum",
        "Jon Snow", "Daenerys Targaryen", "Tyrion Lannister", "Jaime Lannister", "Cersei Lannister",
        "Arya Stark", "Sansa Stark", "Bran Stark", "Rickon Stark", "Theon Greyjoy",
        "Theoden", "Eowyn", "Faramir", "Denethor", "Boromir",
        "Hermione Granger", "Ron Weasley", "Albus Dumbledore", "Severus Snape", "Voldemort",
        "Draco Malfoy", "Luna Lovegood", "Neville Longbottom", "Minerva McGonagall", "Rubeus Hagrid",
        "Katniss Everdeen", "Peeta Mellark", "Finnick Odair", " Johanna Mason", "Effie Trinket",
        "Clary Fray", "Jace Wayland", "Alec Lightwood", "Isabelle Lightwood", "Magnus Bane",
        "Bella Swan", "Edward Cullen", "Jacob Black", "Alice Cullen", "Esme Cullen",
        "Matilda Wormwood", "Miss Honey", "Miss Trunchbull", "Mr. Wormwood", "Harry Wormwood",
        "Lyra Belacqua", "Will Parry", "Iorek Byrnison", "Serafina Pekkala", "Lee Scoresby",
        "Thomas Covenant", "Linden Avery", "Elena", "Covenant's companions", "The Ravers",
    ],
    "history_adapted": [
        "Alexander the Great", "Julius Caesar", "Cleopatra", "Napoleon Bonaparte", "Abraham Lincoln",
        "George Washington", "Winston Churchill", "Mahatma Gandhi", "Nelson Mandela", "Martin Luther King Jr.",
        "Albert Einstein", "Isaac Newton", "Nikola Tesla", "Marie Curie", "Charles Darwin",
        "Leonardo da Vinci", "Michelangelo", "Shakespeare", "Beethoven", "Mozart",
        "Picasso", "Van Gogh", "Claude Monet", "Rembrandt", "Frida Kahlo",
        "Genghis Khan", "Catherine the Great", "Queen Victoria", "Elizabeth I", "Henry VIII",
        "Joan of Arc", "William Wallace", "Robin Hood", "Miyamoto Musashi", "Sun Tzu",
        "Confucius", "Buddha", "Jesus Christ", "Muhammad", "Zoroaster",
    ],
    "tropes": [
        "The Hero", "The Mentor", "The Shadow", "The Trickster", "The Mother",
        "The Father", "The Child", "The Wise Old Man", "The Fool", "The Lover",
        "The Explorer", "The Rebel", "The creator", "The Caregiver", "The Jester",
    ]
}

# Collect all names
all_names = []
all_names.extend(papertrue_chars)
for category, names in additional_characters.items():
    all_names.extend(names)

# Remove duplicates while preserving order
seen = set()
unique_names = []
for name in all_names:
    if name not in seen:
        seen.add(name)
        unique_names.append(name)

print(f"Total unique characters collected: {len(unique_names)}")

# Generate preset template
def generate_preset(id, name, creature="Human", vibe="", emoji="", avatar_seed="", tags=None, source="character"):
    # Build tags
    if tags is None:
        tags = ["famous", "iconic"]
    # Create a simple description based on vibe and name
    tags_str = json.dumps(tags, ensure_ascii=False)
    description = f"{name} - iconic fictional character with a distinctive personality and memorable presence."
    return f"""  {{
    id: "{id}",
    name: "{name}",
    creature: "{creature}",
    vibe: "{vibe}",
    emoji: "{emoji}",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed={avatar_seed if avatar_seed else name}",
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
    formality: 50,
    emojiUsage: 20,
    verbosity: 50,
    consciousness: 70,
    questioning: 30,
    description: "{description}",
    tags: {tags_str},
    source: "{source}",
  }},"""

# Convert name to id
def name_to_id(name):
    return re.sub(r'[^a-z0-9]', '-', name.lower().strip())

# Generate all presets
preset_lines = []
for i, name in enumerate(unique_names[:200], 1):
    char_id = name_to_id(name)
    # Customize some specific presets (opti)

    # Default
    creature = "Human"
    vibe = "Iconic fictional character with memorable traits."
    emoji = "⭐"
    tags = ["famous", "iconic"]

    # Animes
    if name in additional_characters["anime"]:
        creature = "Anime Character"
        vibe = "Anime character with distinctive personality and dramatic style."
        emoji = "⚡"
        tags = ["anime", "iconic"]

    # Games
    if name in additional_characters["games"]:
        if any(x in name for x in ["Master Chief", "Kratos", " Geralt", "Arthur Morgan", "Ellie", "Joel", "Aloy", "Samus", "Mario", "Luigi", "Bowser", "Link", "Zelda", "Sonic", "Pikachu", "Cloud", "Snake", "Marcus Fenix"]):
            creature = "Video Game Character"
        vibe = "Video game protagonist with heroic determination."
        emoji = "🎮"
        tags = ["game", "iconic"]

    # Comics
    if name in additional_characters["comics"]:
        creature = "Comic Book Character"
        vibe = "Superhero or villain with extraordinary powers and strong personality."
        emoji = "🦸"
        tags = ["comics", "superhero"]

    # Literature
    if name in additional_characters["literature"]:
        creature = "Literary Character"
        vibe = "Classic literature character with depth and complexity."
        emoji = "📚"
        tags = ["literature", "classic"]

    # History adapted
    if name in additional_characters["history_adapted"]:
        creature = "Historical Figure (Adapted)"
        vibe = "Historical personality with legendary status."
        emoji = "🏛️"
        tags = ["historical", "iconic"]

    preset = generate_preset(
        id=char_id,
        name=name,
        creature=creature,
        vibe=vibe,
        emoji=emoji,
        avatar_seed=name,
        tags=tags
    )
    preset_lines.append(preset)

print(f"Generated {len(preset_lines)} preset entries")

# Output to file
output_path = Path("/root/clawsouls/generated-presets-200.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write('\n'.join(preset_lines))

print(f"Written to {output_path}")
