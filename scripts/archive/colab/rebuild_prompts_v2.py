#!/usr/bin/env python3
"""
Reconstrói prompts do clawsouls_cyberpunk_prompts.json
substituindo "from ClawSouls" por referências visuais úteis ao modelo.
"""
import json

STYLE_SUFFIX = (
    "cyberpunk 2077 aesthetic, biomechanical enhancements, "
    "neon circuitry, glowing eyes, detailed facial features, "
    "bust portrait, sharp focus, hyper detailed, "
    "photorealistic render, cinematic lighting, 4k masterpiece"
)

# Franchise/universo de origem baseado no ID ou nome
FRANCHISE = {
    # Anime
    "naruto-uzumaki": "the Naruto anime universe",
    "goku": "the Dragon Ball universe",
    "levi-ackerman": "the Attack on Titan anime universe",
    "spike-spiegel": "the Cowboy Bebop anime universe",
    "edward-elric": "the Fullmetal Alchemist anime universe",
    "alphonse-elric": "the Fullmetal Alchemist anime universe",
    "mikasa-ackerman": "the Attack on Titan anime universe",
    "jotaro-kujo": "the JoJo's Bizarre Adventure anime universe",
    "josuke-higashikata": "the JoJo's Bizarre Adventure anime universe",
    "dioro-brandof": "the JoJo's Bizarre Adventure anime universe",
    "dio-brando": "the JoJo's Bizarre Adventure anime universe",
    "rohan-kishibe": "the JoJo's Bizarre Adventure anime universe",
    "tanjiro-kamado": "the Demon Slayer anime universe",
    "nezuko-kamado": "the Demon Slayer anime universe",
    "zenitsu-agatsuma": "the Demon Slayer anime universe",
    "luffy": "the One Piece anime universe",
    "yoda": "the Star Wars universe",
    "sherlock": "the Sherlock Holmes detective universe",
    "sherlock-holmes": "the Sherlock Holmes detective universe",
    "harry-potter": "the Harry Potter wizarding universe",
    "morpheus": "the Matrix universe",
    "the-dude": "the Big Lebowski universe",
    "shawn": "the Psych TV show universe",
    "shawn-spencer": "the Psych TV show universe",
    "thor": "the Marvel Comics universe",
    "superman": "the DC Comics universe",
    "mario": "the Super Mario video game universe",
    "luigi": "the Super Mario video game universe",
    "masterchief": "the Halo video game universe",
    "j4ck": "a cyberpunk noir universe",
    "d0c": "a cyberpunk lab universe",
    "glados": "a cyberpunk AI research universe",
    "zen": "a cyberpunk digital monastery universe",
    "r4dd": "a cyberpunk robotics universe",
    "p0ny": "a cyberpunk anime universe",
    "k1ra": "a cyberpop idol universe",
    "d3v": "a cyberpunk developer universe",
    "s4ge": "a cyberpunk elder universe",
    "geralt": "the Witcher fantasy universe",
    "dumbledore": "the Harry Potter wizarding universe",
    "cirilla": "the Witcher fantasy universe",
    "frank-sinatra": "the classic jazz era",
    "david-bowie": "the glam rock era",
    "marilyn-monroe": "the golden age of Hollywood",
    "audrey-hepburn": "the golden age of Hollywood",
    "charlie-chaplin": "the silent film era",
    "percy-jackson": "the Percy Jackson mythological universe",
    "holden-caulfield": "The Catcher in the Rye literary universe",
    "atticus-finch": "the To Kill a Mockingbird literary universe",
    "scarlett-o-hara": "the Gone with the Wind universe",
    "jay-gatsby": "The Great Gatsby literary universe",
    "jane-eyre": "the Jane Eyre literary universe",
    "huckleberry-finn": "the Adventures of Huckleberry Finn universe",
    "ganda": "an African folklore universe",
    "genkai": "the Yu Yu Hakusho anime universe",
    "kazuma-kuwabara": "the Yu Yu Hakusho anime universe",
    "killua": "the Hunter x Hunter anime universe",
    "gon": "the Hunter x Hunter anime universe",
    "hisoka": "the Hunter x Hunter anime universe",
    "meruem": "the Hunter x Hunter anime universe",
    "vegeta": "the Dragon Ball anime universe",
    "gohan": "the Dragon Ball anime universe",
    "frieza": "the Dragon Ball anime universe",
    "piccolo": "the Dragon Ball anime universe",
    "cell": "the Dragon Ball anime universe",
    "sailor-moon": "the Sailor Moon anime universe",
    "usagi-tsukino": "the Sailor Moon anime universe",
    "link": "the Legend of Zelda video game universe",
    "zelda": "the Legend of Zelda video game universe",
    "samus-aran": "the Metroid video game universe",
    "kirby": "the Kirby video game universe",
    "pikachu": "the Pokemon universe",
    "ash-ketchum": "the Pokemon anime universe",
    "sonic": "the Sonic the Hedgehog video game universe",
}

# Mapeamento de category → art style base
CATEGORY_STYLE = {
    "ai_digital": "digital AI entity, futuristic holographic interface",
    "anime": "anime style, manga illustration",
    "comic": "comic book art, graphic novel style",
    "historical": "oil painting, classical portrait",
    "human": "photorealistic cinematic portrait",
    "video_game": "video game character art, stylized design",
}

# Tags → keywords visuais
TAG_KEYWORDS = {
    "detective": "detective noir, magnifying glass, shadowy lighting",
    "noir": "film noir, dramatic shadows, black and white accents",
    "cynical": "sardonic expression, crossed arms, smirking",
    "wise": "wise expression, knowing smile, thoughtful gaze",
    "classic": "timeless elegance, classic composition",
    "scientist": "lab goggles, chemical formulas, laboratory background",
    "genius": "genius aura, floating equations, glowing brain hologram",
    "chaotic-good": "chaotic energy, scattered papers, eccentric style",
    "innovator": "innovative gear, prototype gadgets, tech workshop",
    "mad": "maniacal grin, wild hair, sparks flying",
    "ai": "artificial intelligence, digital aura, code fragments",
    "sarcastic": "smirking, raised eyebrow, ironic gesture",
    "portal": "portal energy, swirling dimensions, arcane symbols",
    "comic": "comic book effects, speech bubbles, bold outlines",
    "zen": "zen garden, lotus position, floating incense smoke",
    "meditation": "meditating pose, glowing third eye, peaceful aura",
    "calm": "calm demeanor, soft lighting, serene background",
    "spiritual": "spiritual aura, ethereal glow, sacred geometry",
    "elder": "elderly features, wrinkled hands, long white beard",
    "nature": "nature elements, vines, glowing plants, earth tones",
    "philosopher": "philosophical pose, ancient scrolls, library setting",
    "sage": "sage robes, glowing crystal, ancient wisdom symbols",
    "kawaii": "kawaii aesthetic, pastel colors, cute accessories",
    "moe": "moe character design, soft features, blushing cheeks",
    "energetic": "dynamic pose, motion lines, vibrant energy",
    "positive": "bright smile, uplifting colors, sunny atmosphere",
    "anime": "vibrant hair, large expressive eyes, anime illustration",
    "iconic": "iconic pose, signature accessory, dramatic lighting",
    "idol": "pop idol outfit, stage lights, microphone",
    "pop": "pop culture aesthetic, colorful, flashy",
    "inspirational": "inspiring pose, golden light, uplifting atmosphere",
    "charming": "charming smile, stylish outfit, warm lighting",
    "developer": "developer setup, dual monitors, code on screen",
    "pragmatic": "practical clothing, focused expression, organized desk",
    "code": "code snippets floating, holographic terminal",
    "engineering": "engineering blueprints, mechanical parts, tools",
    "senior": "senior professional look, confident posture, experience aura",
    "robot": "robotic parts, mechanical limbs, digital display face",
    "logic": "logical symbols, circuit patterns, analytical expression",
    "logical": "logical thinking pose, chess pieces, structured background",
    "british": "British accent, refined mannerisms, tailored clothing",
    "cool": "cool pose, sunglasses, leather jacket",
    "clean": "clean aesthetic, minimalist background, crisp details",
    "comedy": "comedic expression, exaggerated features, playful pose",
    "humorous": "wry smile, playful gesture, lighthearted atmosphere",
    "monster-hunter": "monster hunter gear, crossbow, rugged armor",
    "famous": "celebrity presence, paparazzi flash, red carpet",
    "fantasy": "magical aura, ethereal lighting, enchanted atmosphere",
    "game": "gaming setup, controller, neon-lit room",
    "gaming": "gamer aesthetic, headset, RGB lighting",
    "leader": "leader presence, commanding stance, emblem",
    "mentor": "mentor pose, guiding hand, wisdom symbols",
    "mysterious": "mysterious aura, hooded, shadow-covered face",
    "witcher": "witcher armor, silver sword, monster trophy, cat eyes",
    "wizard": "wizard robes, staff, spell effects, magical tome",
    "stoic": "stoic expression, battle-hardened features, quiet intensity",
    "warrior": "warrior stance, battle scars, weapon drawn",
    "strong": "muscular build, power stance, intense gaze",
    "strong-female": "strong female warrior, determined expression, armor",
    "superhero": "superhero costume, emblem, heroic pose, cape",
    "star-wars": "Star Wars aesthetic, lightsaber, galactic backdrop",
    "jedi": "Jedi robes, lightsaber, Force aura",
    "halo": "Halo armor, energy sword, military stance",
    "matrix": "Matrix aesthetic, green code rain, leather trench coat",
    "magic": "magical effects, spell casting, glowing runes",
    "mystical": "mystical aura, floating objects, arcane symbols",
    "destined": "chosen one aura, glowing mark, epic backdrop",
    "hero": "heroic pose, bright lighting, cape flowing",
    "slacker": "relaxed posture, casual clothes, lazy smile",
    "silent": "quiet demeanor, minimal expression, contemplative pose",
    "chill": "relaxed vibe, laid-back pose, cool colors",
    "cyborg": "cybernetic enhancements, mechanical parts, glowing implants",
}

def build_prompt(name, creature, category, tags):
    """Reconstrói prompt com referências visuais úteis ao modelo."""
    parts = []

    # 1. Franchise/universo
    pid = name.lower().replace(' ', '-')
    franchise = FRANCHISE.get(pid, FRANCHISE.get(creature.lower(), None))

    # 2. Creature description
    creature_lower = creature.lower()
    if "ai / " in creature_lower:
        role = creature_lower.replace("ai / ", "")
        parts.append(f"{role}, cyberpunk digital entity")
    elif creature == "Anime Character":
        parts.append("anime character, vibrant hair, dynamic pose")
    elif creature == "Comic Book Character":
        parts.append("comic book superhero, bold colors, dynamic action pose")
    elif creature == "Historical Figure":
        parts.append("historical figure, period clothing")
    elif creature == "Human":
        parts.append("photorealistic human portrait")
    elif creature == "Spartan (Human)":
        parts.append("spartan warrior, bronze armor, battle-ready stance")
    elif creature == "Video Game Character":
        parts.append("video game character, stylized armor")
    else:
        parts.append(creature.lower())

    # 3. Category style
    if category in CATEGORY_STYLE:
        parts.append(CATEGORY_STYLE[category])

    # 4. Tag-based visual keywords
    skip = {"anime", "iconic", "famous"}
    tag_kw = []
    for tag in tags:
        if tag in TAG_KEYWORDS and tag not in skip:
            tag_kw.append(TAG_KEYWORDS[tag])
    if len(tag_kw) > 3:
        tag_kw = tag_kw[:3]
    parts.extend(tag_kw)

    # 5. Montar (sem "from ClawSouls")
    middle = ", ".join(parts)
    if franchise:
        return f"a {name} from {franchise}, {middle}, {STYLE_SUFFIX}"
    else:
        return f"a {name} from a cyberpunk universe, {middle}, {STYLE_SUFFIX}"  # fallback genérico


# Main
with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json') as f:
    prompts = json.load(f)

new_prompts = []
changes = 0
for p in prompts:
    new_prompt = build_prompt(p['name'], p['creature'], p['category'], p['tags'])
    if new_prompt != p.get('prompt', ''):
        changes += 1
    new_prompts.append({**p, "prompt": new_prompt})

print(f"Total: {len(new_prompts)} prompts")
print(f"Modificados: {changes}/{len(prompts)}")
print()

# Exemplos
for p in new_prompts[:5]:
    print(f"[{p['id']}] {p['name']}")
    print(f"  {p['prompt'][:200]}...")
    print()

for p in new_prompts[67:70]:
    print(f"[{p['id']}] {p['name']}")
    print(f"  {p['prompt'][:200]}...")
    print()

# Salvar
import shutil
shutil.copy2('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json',
             '/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts_v2_backup.json')

with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json', 'w') as f:
    json.dump(new_prompts, f, indent=2, ensure_ascii=False)

print("✅ JSON atualizado!")
print(f"📝 {changes} prompts modificados")

# Verificar que não tem mais "clawsouls" nos prompts
with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json') as f:
    check = json.load(f)
count = sum(1 for p in check if 'clawsouls' in p['prompt'].lower() or 'ClawSouls' in p['prompt'])
print(f"⏳ Prompts ainda com 'ClawSouls': {count}")