#!/usr/bin/env python3
"""
Reconstrói prompts do clawsouls_cyberpunk_prompts.json
substituindo "from ClawSouls" por referências visuais concretas.
"""
import json

STYLE_SUFFIX = (
    "cyberpunk 2077 aesthetic, biomechanical enhancements, "
    "neon circuitry, glowing eyes, detailed facial features, "
    "bust portrait, sharp focus, hyper detailed, "
    "photorealistic render, cinematic lighting, 4k masterpiece"
)

# Mapeamento de category → art style base
CATEGORY_STYLE = {
    "ai_digital": "digital AI entity, futuristic holographic interface",
    "anime": "anime style, manga illustration",
    "comic": "comic book art, graphic novel style",
    "historical": "oil painting, classical portrait",
    "human": "photorealistic cinematic portrait",
    "video_game": "video game character art, stylized design",
}

# Mapeamento de creature → descrição visual
CREATURE_STYLE = {
    "AI / Private Detective": "cyberpunk noir detective, trench coat, holographic badge",
    "AI / Mad Scientist": "mad scientist, lab coat, glowing chemical vials, wild hair",
    "AI / Research Assistant": "research assistant AI, sleek interface, data streams",
    "AI / Monk": "cyberpunk monk, digital prayer beads, serene expression, flowing robes",
    "AI / Robot": "humanoid robot, metallic body, LED accents, mechanical joints",
    "AI / Anime Girl": "anime girl, kawaii aesthetic, large expressive eyes, colorful hair",
    "AI / Idol": "pop idol, flashy stage outfit, microphone, sparkling stage lights",
    "AI / Senior Developer": "senior developer, hoodie, multiple holographic screens, keyboard",
    "AI / Wise Elder": "wise elder, long beard, glowing runes, ancient wisdom aura",
    "AI / Pirate Captain": "space pirate captain, cybernetic eye, tricorn hat, plasma blade",
    "AI / Bounty Hunter": "bounty hunter, armored jacket, cybernetic arm, rifle holster",
    "AI / Fake Psychic": "fake psychic, crystal ball, turban, flashy jewelry, theatrical pose",
    "AI / Headmaster": "academy headmaster, formal robes, glasses, commanding presence",
    "AI / Jedi Master": "Jedi master, lightsaber, flowing robes, calm demeanor, Force aura",
    "AI / Witcher": "witcher, silver sword, leather armor, scars, medallion glowing",
    "AI / Witcher Child of Destiny": "witcher child of destiny, dual swords, cat eyes, scarred face",
    "Anime Character": "anime character, vibrant hair, dynamic pose, manga style",
    "Comic Book Character": "comic book superhero, bold colors, dynamic action pose",
    "Historical Figure": "historical figure, period clothing, oil painting style",
    "Human": "photorealistic human portrait, natural lighting",
    "Spartan (Human)": "spartan warrior, bronze armor, red cape, battle-ready stance",
    "Video Game Character": "video game character, stylized armor, fantasy weapon",
}

# Tags → keywords visuais adicionais
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
    "anime": "anime style, vibrant colors, expressive eyes",
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
    "british": "British style, accent features, refined mannerisms",
    "cool": "cool pose, sunglasses, leather jacket",
    "clean": "clean aesthetic, minimalist background, crisp details",
    "comedy": "comedic expression, exaggerated features, playful pose",
    "humorous": "wry smile, playful gesture, lighthearted atmosphere",
    "monster-hunter": "monster hunter gear, crossbow, rugged armor",
    "famous": "celebrity presence, paparazzi flash, red carpet",
    "fantasy": "fantasy elements, magical aura, ethereal lighting",
    "game": "gaming setup, controller, neon-lit room",
    "gaming": "gamer aesthetic, headset, RGB lighting, multiple screens",
    "leader": "leader presence, commanding stance, flag or emblem",
    "mentor": "mentor pose, guiding hand, wisdom symbols",
    "mysterious": "mysterious aura, hooded, shadow-covered face",
    "witcher": "witcher armor, silver sword, monster trophy, cat eyes",
    "wizard": "wizard robes, staff, spell effects, magical tome",
    "stoic": "stoic expression, armor, weapon at side",
    "warrior": "warrior stance, battle scars, weapon drawn",
    "strong": "muscular build, power stance, intense gaze",
    "strong-female": "strong female warrior, determined expression, armor",
    "superhero": "superhero costume, emblem, heroic pose, cape",
    "star-wars": "Star Wars aesthetic, lightsaber, galactic backdrop",
    "jedi": "Jedi robes, lightsaber, Force aura, calm expression",
    "halo": "Halo armor, energy sword, military stance",
    "matrix": "Matrix aesthetic, green code rain, leather trench coat",
    "magic": "magical effects, spell casting, glowing runes",
    "mystical": "mystical aura, floating objects, arcane symbols",
    "destined": "chosen one aura, glowing mark, epic backdrop",
    "hero": "heroic pose, bright lighting, cape flowing",
    "prophecy": "ancient prophecy, glowing text, mystical atmosphere",
    "slacker": "relaxed posture, casual clothes, lazy smile",
    "silent": "quiet demeanor, minimal expression, contemplative pose",
    "chill": "relaxed vibe, laid-back pose, cool colors",
    "ninja": "ninja outfit, katana, shadow stance, swift movement",
    "cyborg": "cybernetic enhancements, mechanical parts, glowing implants",
    "space": "space background, starfield, futuristic helmet",
    "pirate": "pirate attire, eye patch, sword, nautical elements",
    "steampunk": "steampunk aesthetic, brass gears, Victorian clothing",
    "samurai": "samurai armor, katana, traditional Japanese elements",
    "vampire": "vampire aesthetic, pale skin, fangs, dark cape",
    "demon": "demon horns, dark energy, red glowing eyes",
    "angel": "angel wings, golden light, divine aura",
    "undead": "undead aesthetic, decaying features, ghostly aura",
    "werewolf": "werewolf transformation, moonlight, fur and claws",
    "witch": "witch hat, cauldron, potion bottles, spell book",
    "villain": "villain pose, dark lighting, menacing expression",
    "anti-hero": "anti-hero aesthetic, moral ambiguity, rugged look",
    "trickster": "trickster grin, playful chaos, illusion effects",
    "oracle": "oracle vision, glowing eyes, prophetic symbols",
    "alchemist": "alchemist tools, potions, transmutation circle",
    "blacksmith": "blacksmith forge, hammer, glowing metal",
    "chef": "chef outfit, cooking utensils, food presentation",
    "artist": "artist beret, paint palette, creative studio",
    "musician": "musical instrument, stage lights, concert atmosphere",
    "dancer": "dance pose, flowing costume, spotlight",
    "pilot": "pilot goggles, flight jacket, cockpit background",
    "soldier": "military uniform, dog tags, combat stance",
    "spy": "spy trench coat, gadgets, secret dossier",
    "thief": "thief mask, lockpicks, shadowy alley",
    "merchant": "merchant outfit, scales, bazaar background",
    "noble": "noble clothing, crown, royal insignia",
    "peasant": "simple clothing, humble background, earth tones",
    "pirate-queen": "pirate queen, elegant yet fierce, command presence",
    "undertaker": "undertaker suit, serious expression, somber tones",
    "doctor": "doctor coat, stethoscope, medical equipment",
    "nurse": "nurse outfit, caring expression, hospital setting",
    "teacher": "teacher attire, glasses, chalkboard background",
    "student": "student uniform, backpack, classroom setting",
    "prince": "prince attire, royal crown, regal pose",
    "princess": "princess gown, tiara, castle background",
    "knight": "knight armor, shield, sword, chivalric pose",
    "archer": "bow and arrow, quiver, forest background",
    "gunslinger": "gunslinger hat, dual pistols, western style",
    "samurai-lord": "samurai lord armor, katana, cherry blossoms",
    "ronin": "ronin outfit, worn katana, solitary stance",
    "monk-ninja": "monk-ninja hybrid, prayer beads, shuriken",
    "sage-wizard": "sage wizard, long beard, crystal ball, ancient tome",
    "apprentice": "apprentice robes, wand, eager expression",
    "master": "master robes, staff, commanding wisdom",
    "legend": "legendary aura, epic pose, glowing weapon",
    "mythical": "mythical creature features, magical aura",
    "celestial": "celestial glow, star patterns, divine wings",
    "infernal": "infernal fire, demonic aura, hellish background",
    "frost": "frost aura, ice crystals, winter clothing",
    "flame": "flame aura, fire effects, heat distortion",
    "shadow": "shadow manipulation, dark cloak, stealth pose",
    "light": "radiant light, holy aura, pure expression",
    "storm": "storm effects, lightning, dramatic sky",
    "void": "void energy, purple-black aura, cosmic backdrop",
    "chaos": "chaos energy, distorted reality, wild magic",
    "order": "order symbols, structured aura, precise pose",
    "time": "time manipulation, clock motifs, temporal distortion",
    "space-lord": "space lord, cosmic armor, galaxy backdrop",
    "dimension-walker": "dimension crack effects, multiple realities",
    "reality-bender": "reality bending effects, impossible geometry",
    "soul-reaper": "soul reaper, scythe, spirit particles",
    "life-mage": "life mage, green healing energy, nature magic",
    "death-knight": "death knight, dark armor, necromantic energy",
    "blood-mage": "blood mage, crimson energy, ritual circle",
    "storm-caller": "storm caller, lightning staff, thunder clouds",
    "earth-shaker": "earth shaker, rocky armor, seismic waves",
    "wind-dancer": "wind dancer, flowing scarves, aerial movement",
    "water-bender": "water bender, fluid movements, water effects",
    "fire-avatar": "fire avatar, flames, volcanic background",
    "ice-queen": "ice queen, frozen crown, snowflake patterns",
    "thunder-god": "thunder god, lightning crown, storm aura",
    "shadow-lord": "shadow lord, darkness manipulation, void energy",
    "light-bringer": "light bringer, radiant armor, holy weapon",
    "dream-walker": "dream walker, surreal background, ethereal glow",
    "nightmare": "nightmare entity, dark mist, fear aura",
    "hope": "hopeful aura, sunrise colors, uplifting energy",
    "despair": "despair aura, dark tones, rain background",
    "fury": "fury expression, battle rage, energy explosion",
    "serenity": "serene expression, peaceful garden, soft light",
    "glory": "glorious aura, golden light, trophy symbols",
    "infamy": "infamous reputation, wanted poster, dark alley",
    "rebirth": "rebirth symbols, phoenix energy, transformation",
    "doom": "doom aura, apocalyptic sky, destructive energy",
    "fortune": "fortune symbols, lucky charms, golden coins",
    "misfortune": "misfortune aura, broken objects, stormy weather",
    "love": "romantic atmosphere, rose petals, warm colors",
    "hate": "angry expression, dark energy, clenched fists",
    "fear": "fearful expression, dark shadows, threatening presence",
    "courage": "courageous stance, determined expression, bright light",
    "betrayal": "betrayal expression, hidden dagger, suspicious pose",
    "loyalty": "loyal companion pose, protective stance, bond symbols",
    "honor": "honorable warrior, clean armor, respectful bow",
    "greed": "greedy expression, gold coins, treasure background",
    "charity": "charitable pose, giving gesture, warm lighting",
    "pride": "proud stance, chin up, regal posture",
    "humility": "humble pose, bowed head, simple clothing",
    "envy": "envious gaze, green tint, covetous posture",
    "kindness": "kind smile, gentle gesture, soft lighting",
    "cruelty": "cruel smirk, harsh lighting, intimidating presence",
    "wisdom": "wise old sage, ancient scrolls, owl companion",
    "foolishness": "foolish grin, jester hat, playful chaos",
    "bravery": "brave warrior, battle scars, fearless expression",
    "cowardice": "nervous expression, running pose, fearful eyes",
    "truth": "truth aura, transparent energy, honest expression",
    "deception": "deceptive smile, hidden face, illusion effects",
    "justice": "justice scales, law enforcement, righteous aura",
    "revenge": "revenge aura, clenched fist, burning eyes",
    "forgiveness": "forgiving expression, open palms, soft light",
    "vengeance": "vengeful stare, weapon drawn, dark fire",
    "sacrifice": "sacrificial pose, glowing energy, offering gesture",
    "selfishness": "selfish pose, guarding treasure, suspicious look",
    "devotion": "devoted stance, prayer pose, sacred symbols",
    "ambition": "ambitious pose, throne, rising energy",
    "contentment": "content expression, peaceful scene, warm colors",
    "restless": "restless energy, pacing pose, scattered items",
    "focus": "intense focus, sharp eyes, concentrated aura",
    "distraction": "distracted gaze, scattered thoughts, messy background",
    "patience": "patient pose, calm breathing, nature setting",
    "impatience": "impatient tapping, angry expression, rushed energy",
    "confidence": "confident stance, power pose, bright aura",
    "insecurity": "insecure posture, avoiding gaze, hidden hands",
    "arrogance": "arrogant smirk, looking down, golden glow",
    "compassion": "compassionate touch, healing energy, soft glow",
    "indifference": "indifferent expression, shrug, muted colors",
    "passion": "passionate expression, fire energy, intense colors",
    "apathy": "empty gaze, dull colors, slumped posture",
    "joy": "joyful smile, bright colors, celebratory pose",
    "sorrow": "tearful expression, rain, muted blue tones",
    "anger": "angry expression, fire effects, clenched jaw",
    "peace": "peaceful meditation, lotus, calm water",
    "war": "battlefield, weapons, war paint, chaos",
    "life": "life energy, green glow, blooming flowers",
    "death": "death aura, skull motifs, ghostly mist",
    "creation": "creation energy, sparkles, forming shapes",
    "destruction": "destruction energy, explosions, crumbling ruins",
    "freedom": "freedom pose, open sky, bird companion",
    "imprisonment": "prison bars, chains, confined space",
    "friendship": "friendship pose, group hug, warm colors",
    "loneliness": "alone figure, empty room, blue tones",
    "unity": "unity circle, combined energy, diverse group",
    "division": "split image, opposing sides, conflict",
    "past": "old photograph style, sepia tones, memories",
    "future": "futuristic vision, holographic display, neon",
    "present": "modern setting, current fashion, vivid colors",
    "eternity": "timeless aura, cosmic background, infinite symbols",
    "mortal": "mortal vulnerability, human features, fragile pose",
    "immortal": "immortal aura, ageless features, cosmic energy",
    "humanity": "human emotions, warm lighting, relatable pose",
    "machine": "mechanical parts, digital display, robotic precision",
    "hybrid": "human-machine hybrid, cybernetic implants, organic-tech fusion",
}

def build_style_prefix(creature, category, tags):
    """Constrói a parte variável do prompt baseada nos metadados."""
    parts = []

    # 1. Estilo principal baseado na creature
    creature_lower = creature.lower()
    if creature in CREATURE_STYLE:
        parts.append(CREATURE_STYLE[creature])
    elif "ai" in creature_lower and "detective" in creature_lower:
        parts.append("cyberpunk noir detective, trench coat, holographic badge")
    elif "ai" in creature_lower and "robot" in creature_lower:
        parts.append("humanoid robot, metallic body, LED accents")
    elif creature == "Historical Figure":
        parts.append("historical figure, period clothing, oil painting style")
    elif creature == "Anime Character":
        parts.append("anime character, vibrant hair, dynamic pose")
    elif creature == "Comic Book Character":
        parts.append("comic book superhero, bold colors, dynamic action pose")
    elif creature == "Human":
        parts.append("photorealistic human portrait, natural lighting")
    elif creature == "Spartan (Human)":
        parts.append("spartan warrior, bronze armor, red cape, battle-ready stance")
    elif creature == "Video Game Character":
        parts.append("video game character, stylized armor, fantasy weapon")
    else:
        parts.append(creature.lower())

    # 2. Art style baseado na category
    if category in CATEGORY_STYLE:
        parts.append(CATEGORY_STYLE[category])

    # 3. Detalhes visuais das tags (max 3-4 tags mais relevantes)
    skip_tags = {"anime", "historical", "comic", "game", "iconic"}  # já cobertos
    visual_tags = []
    for tag in tags:
        if tag in TAG_KEYWORDS and tag not in skip_tags:
            visual_tags.append(TAG_KEYWORDS[tag])
    
    # Limita para não ficar muito longo
    if len(visual_tags) > 3:
        visual_tags = visual_tags[:3]
    parts.extend(visual_tags)

    return ", ".join(parts)

def rebuild_prompt(name, creature, category, tags):
    """Reconstrói um prompt completo."""
    style = build_style_prefix(creature, category, tags)
    return f"a {name} from ClawSouls, {style}, {STYLE_SUFFIX}"

# Main
with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json') as f:
    prompts = json.load(f)

new_prompts = []
changes = 0
for p in prompts:
    new_prompt = rebuild_prompt(p['name'], p['creature'], p['category'], p['tags'])
    if new_prompt != p['prompt']:
        changes += 1
    new_prompts.append({
        **p,
        "old_prompt": p['prompt'],  # manter backup
        "prompt": new_prompt
    })

print(f"Total: {len(new_prompts)} prompts")
print(f"Modificados: {changes}")
print()

# Mostrar exemplos
for p in new_prompts[:5]:
    print(f"[{p['id']}] {p['name']}")
    print(f"  NEW: {p['prompt'][:200]}...")
    print()

print("---")
print()

for p in new_prompts[67:70]:  # Josuke area
    print(f"[{p['id']}] {p['name']}")
    print(f"  NEW: {p['prompt'][:200]}...")
    print()

# Salvar backup do original
import shutil
shutil.copy2(
    '/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json',
    '/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts_backup.json'
)

# Salvar novo JSON (sem old_prompt para manter limpo)
clean_prompts = []
for p in new_prompts:
    clean = {k: v for k, v in p.items() if k != 'old_prompt'}
    clean_prompts.append(clean)

with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json', 'w') as f:
    json.dump(clean_prompts, f, indent=2, ensure_ascii=False)

print("✅ JSON atualizado! Backup salvo como clawsouls_cyberpunk_prompts_backup.json")
print(f"📝 {changes}/{len(prompts)} prompts modificados")