#!/usr/bin/env python3
import json

SUFFIX = (
    "cyberpunk 2077 aesthetic, biomechanical enhancements, "
    "neon circuitry, glowing eyes, detailed facial features, "
    "bust portrait, sharp focus, hyper detailed, "
    "photorealistic render, cinematic lighting, 4k masterpiece"
)

# === MAPPINGS ===
# Anime characters
ANIME = {
    "naruto-uzumaki": "cyberpunk ninja, orange jumpsuit, whisker marks, headband",
    "goku": "cyberpunk martial artist, spiky black hair, orange gi",
    "levi-ackerman": "cyberpunk soldier captain, ODM gear, black uniform, short hair",
    "spike-spiegel": "cyberpunk bounty hunter, blue suit, martial arts stance",
    "edward-elric": "cyberpunk alchemist, red coat, automail arm",
    "alphonse-elric": "cyberpunk armored alchemist, full plate armor",
    "mikasa-ackerman": "cyberpunk elite soldier, red scarf, maneuvering gear",
    "jotaro-kujo": "cyberpunk delinquent, long dark coat, gold chain, hat",
    "josuke-higashikata": "cyberpunk stylish delinquent, purple pompadour, school uniform",
    "dioro-brandof": "cyberpunk vampire, gold hair, extravagant purple coat",
    "rohan-kishibe": "cyberpunk manga artist, purple hair, intense gaze",
    "tanjiro-kamado": "cyberpunk demon slayer, checkered haori, nichirin blade",
    "nezuko-kamado": "cyberpunk demon girl, bamboo muzzle, pink kimono",
    "zenitsu-agatsuma": "cyberpunk anxious swordsman, golden hair, lightning blade",
    "luffy": "cyberpunk pirate captain, straw hat, scar under eye, red vest",
    "sasuke-uchiha": "cyberpunk avenger, black outfit, sharingan eye",
    "kakashi-hatake": "cyberpunk ninja instructor, mask, headband over eye",
    "itachi-uchiha": "cyberpunk tragic hero, Akatsuki cloak, sharingan",
    "monkey-d--luffy": "cyberpunk pirate king, straw hat, red vest, scar",
    "roronoa-zoro": "cyberpunk swordsman, green headband, three swords",
    "sanji": "cyberpunk cook, black suit, cigarette, kick stance",
    "nami": "cyberpunk navigator, orange hair, tattoo, staff weapon",
    "usopp": "cyberpunk sniper, goggles, slingshot, cowardly pose",
    "chopper": "cyberpunk reindeer doctor, blue nose, medical kit",
    "ichigo-kurosaki": "cyberpunk soul reaper, orange spiky hair, zanpakuto",
    "rukia-kuchiki": "cyberpunk soul reaper, black kimono, short stature",
    "aizen-sosuke": "cyberpunk villain mastermind, glasses, captain robes",
    "gon-freecss": "cyberpunk young hunter, green vest, fishing hat",
    "killua-zoldyck": "cyberpunk assassin boy, silver hair, cat ears, electricity",
    "hisoka": "cyberpunk magician, face paint, playing cards, predatory grin",
    "kurapika": "cyberpunk scarlet-eye hunter, chain weapon, red eyes",
    "leorio": "cyberpunk medical student, suit, glasses, punch stance",
    "chrollo-lucilfer": "cyberpunk phantom troupe leader, silver hair, spider tattoo",
    "meruem": "cyberpunk chimera ant king, muscular, antennae, armor",
    "yusuke-urameshi": "cyberpunk spirit detective, spiky hair, school uniform",
    "hiei": "cyberpunk demon fighter, black hair with white streak, evil eye",
    "kurama": "cyberpunk fox demon, long red hair, elegant robes, plant whip",
    "genkai": "cyberpunk spirit medium, white hair, chanting pose, beads",
    "kazuma-kuwabara": "cyberpunk tough kid, bandana, wooden sword, tough stance",
    "sakura-haruno": "cyberpunk kunoichi, pink hair, red outfit, medical skills",
    "kakuzu": "cyberpunk bounty hunter, masks, threads, multiple hearts",
    "deidara": "cyberpunk explosives artist, clay mouths, hand gestures",
    "pain-nagato": "cyberpunk akatsuki leader, piercings, rinnegan eyes",
    "konan": "cyberpunk paper angel, blue hair, paper wings",
    "zabuza": "cyberpunk rogue ninja, giant sword, mask, mist",
    "haku": "cyberpunk ice user, androgynous, mirror crystals",
    "rock-lee": "cyberpunk taijutsu specialist, green jumpsuit, bandages",
    "guy": "cyberpunk eternal rival, green jumpsuit, thick eyebrows",
    "tsunade": "cyberpunk hokage, blonde hair, diamond forehead, strength",
    "jiraiya": "cyberpunk toad sage, white hair, robes, smoking pipe",
    "orochimaru": "cyberpunk snake sannin, pale skin, long tongue, lab coat",
    "minato": "cyberpunk fourth hokage, yellow hair, flying thunder god kunai",
    "kushina": "cyberpunk red hot-blooded habanero, red hair, chains sealing",
    "gaara": "cyberpunk sand ninja, dark rings around eyes, gourd on back",
    "neji-hyuga": "cyberpunk branch family member, byakugan, destiny tattoo",
    "hinata": "cyberpunk gentle ninja, byakugan, lavender outfit, shy pose",
    "shikamaru": "cyberpunk lazy genius, ponytail, hand shadow jutsu",
    "ino-yamanaka": "cyberpunk mind transfer ninja, purple outfit, flowers",
    "chouji": "cyberpunk gentle giant, red bodysuit, snack lover, expansion jutsu",
    "shino": "cyberpunk insect user, dark glasses, bugs swirling around",
    "kiba": "cyberpunk beast ninja, fang headband, loyal dog Akamaru",
    "tenten": "cyberpunk weapon specialist, twin buns, weapon scrolls",
    "yamato": "cyberpunk wood style user, mask, ANBU vest",
    "kakashi-hatake": "cyberpunk ninja instructor, mask, headband over eye",
}

# Comic characters
COMIC = {
    "thor": "cyberpunk Asgardian god, hammer Mjolnir, flowing cape, armor",
    "superman": "cyberpunk Kryptonian hero, blue suit, red cape, S shield",
    "doctor-strange": "comic book superhero, bold colors, superhero costume, emblem, cape, mystic runes",
    "green-arrow": "cyberpunk archer, green hood, bow and arrows, goatee",
    "black-canary": "cyberpunk fighter, black leather outfit, martial arts pose",
    "shazam": "cyberpunk lightning hero, red suit, lightning bolt, cape",
    "black-adam": "cyberpunk dark hero, black lightning, Egyptian headdress",
    "martian-manhunter": "cyberpunk green alien, shapeshifter, cape, red crystal",
    "cyborg": "cyberpunk half-mechanical hero, robotic parts, red eye glow, tech armor",
    "beast-boy": "cyberpunk shapeshifter, green skin, casual outfit, animal forms",
    "harley-quinn": "cyberpunk chaotic jester, red and black outfit, mallet, pigtails",
    "poison-ivy": "cyberpunk plant villain, red dress, green vines, seductive pose",
    "catwoman": "cyberpunk burglar, black catsuit, whip, mask, agile pose",
    "lex-luthor": "cyberpunk evil genius, bald head, power suit, kryptonite ring",
    "brainiac": "cyberpunk cosmic collector, green skin, glowing skull ship, tentacles",
    "darkseid": "cyberpunk cosmic tyrant, grey skin, red eyes, omega beams",
    "loki": "cyberpunk trickster god, green and gold outfit, horned helmet, scepter",
    "thanos": "cyberpunk cosmic titan, purple skin, gold armor, infinity gauntlet",
}

# Video Game characters
VIDEO_GAME = {
    "mario": "cyberpunk plumber, red cap, mustache, overalls, star power glow",
    "luigi": "cyberpunk timid plumber, green cap, nervous look, tall stature",
    "link": "cyberpunk chosen hero, green tunic, Master Sword, shield",
    "zelda": "cyberpunk sage princess, royal dress, Triforce glow, crown",
    "samus-aran": "cyberpunk bounty huntress, power suit, arm cannon, blonde ponytail",
    "kirby": "cyberpunk pink hero, round shape, pink cheeks, copy ability glow",
    "pikachu": "cyberpunk electric pet, yellow fur, red cheeks, lightning sparks",
    "ash-ketchum": "cyberpunk Pokemon trainer, baseball cap, red and white outfit, backpack",
    "sonic": "cyberpunk speed hedgehog, blue quills, red sneakers, golden rings",
}

# Historical figures
HISTORICAL = {
    "jesus-christ": "cyberpunk spiritual figure, flowing white robes, glowing hands, long hair",
    "napoleon-bonaparte": "cyberpunk military emperor, bicorn hat, hand in coat, commanding stance",
    "frank-sinatra": "cyberpunk jazz legend, fedora, microphone, suit, cigarette",
    "david-bowie": "cyberpunk glam rock star, lightning bolt makeup, bold outfit, Ziggy Stardust",
    "marilyn-monroe": "cyberpunk Hollywood icon, white dress, platinum curls, red lips",
    "audrey-hepburn": "cyberpunk elegant actress, little black dress, updo hair, pearl necklace",
    "charlie-chaplin": "cyberpunk silent comedian, bowler hat, toothbrush mustache, cane",
}

# Human characters (literary, TV, etc.)
HUMAN = {
    "sherlock": "cyberpunk detective, magnifying glass, deerstalker cap, pipe",
    "sherlock-holmes": "cyberpunk detective, pipe, magnifying glass, deerstalker",
    "morpheus": "cyberpunk resistance leader, long black coat, sunglasses, red pill",
    "the-dude": "cyberpunk slacker, bathrobe, bowling pin, white shirt",
    "levi": "cyberpunk captain, ODM gear, black uniform, cappuccino mug",
    "masterchief": "cyberpunk super-soldier, green MJOLNIR armor, energy sword, visor",
    "harry-potter": "cyberpunk wizard, lightning scar, wand, round glasses, Gryffindor robes",
    "elizabeth-bennet": "cyberpunk regency lady, elegant dress, confident gaze, windswept hair",
    "james-bond": "cyberpunk secret agent, tuxedo, laser watch, Walther pistol",
    "percy-jackson": "cyberpunk demigod, camp half-blood shirt, celestial bronze sword, sea-green eyes",
    "holden-caulfield": "cyberpunk disillusioned teen, red hunting hat, sullen expression",
    "atticus-finch": "cyberpunk principled lawyer, suit, glasses, moral authority stance",
    "scarlett-o-hara": "cyberpunk southern belle, green dress, fierce gaze, determination",
    "jay-gatsby": "cyberpunk mysterious millionaire, gold suit, outstretched arms, yearning pose",
    "jane-eyre": "cyberpunk resilient governess, plain dress, quiet strength, steady gaze",
    "huckleberry-finn": "cyberpunk runaway adventurer, ragged clothes, wide-brim hat, river raft",
    "ganda": "cyberpunk African warrior, tribal markings, wooden staff, beads",
    "shawn": "cyberpunk fake psychic, crystal ball, turban, theatrical smirk",
    "shawn-spencer": "cyberpunk fake psychic, crystal ball, turban, theatrical smirk",
}

# Fictional (unique)
UNIQUE = {
    "d0c": "cyberpunk mad scientist, lab coat, glowing chemical vials, wild hair",
    "glados": "cyberpunk AI, sleek interface body, data streams, single eye core",
    "zen": "cyberpunk monk, digital prayer beads, serene expression, flowing robes",
    "r4dd": "cyberpunk robot, metallic body, LED accents, mechanical joints",
    "p0ny": "cyberpunk anime girl, kawaii aesthetic, colorful twin tails, energetic smile",
    "k1ra": "cyberpop idol, flashy stage outfit, microphone, sparkling stage lights",
    "d3v": "cyberpunk hacker, hoodie, multiple holographic screens, mechanical keyboard",
    "s4ge": "cyberpunk elder, long beard, glowing runes, wooden staff, nature robes",
    "luffy": "cyberpunk pirate captain, straw hat, scar under eye, red vest, rubber limbs",
    "spike": "cyberpunk bounty hunter, blue suit, disheveled hair, martial arts pose",
    "yoda": "cyberpunk Jedi master, small stature, green skin, lightsaber, flowing robes",
    "geralt": "cyberpunk witcher, silver sword, scars, cat eyes, medallion",
    "dumbledore": "cyberpunk headmaster, long robes, half-moon glasses, glowing staff",
    "cirilla": "cyberpunk witcher heir, dual swords, white hair with black streak, scarred cheek",
    "d7v": "cyberpunk hacker, hoodie, multiple holographic screens, code",
    "s4e": "cyberpunk elder, long beard, glowing runes, nature aura",
    "p0n": "cyberpunk anime girl, kawaii outfit, colorful hair, energetic",
    "k1a": "cyberpop idol, stage outfit, microphone, lights",
    "d3": "cyberpunk programmer, hoodie, monitors, code",
}

# Fallback description by creature type
CREATURE_MAP = {
    "AI / Private Detective": "cyberpunk noir detective, trench coat, holographic badge",
    "AI / Mad Scientist": "cyberpunk mad scientist, lab coat, glowing vials",
    "AI / Research Assistant": "cyberpunk AI assistant, sleek interface, data streams",
    "AI / Monk": "cyberpunk monk, digital prayer beads, serene pose",
    "AI / Robot": "cyberpunk robot, metallic body, LED accents",
    "AI / Anime Girl": "cyberpunk anime girl, colorful hair, expressive eyes",
    "AI / Idol": "cyberpop idol, stage outfit, microphone",
    "AI / Senior Developer": "cyberpunk developer, hoodie, holographic screens",
    "AI / Wise Elder": "cyberpunk elder, long beard, glowing runes",
    "AI / Pirate Captain": "cyberpunk pirate captain, tricorn hat, plasma blade",
    "AI / Bounty Hunter": "cyberpunk bounty hunter, armored jacket, cybernetic arm",
    "AI / Fake Psychic": "cyberpunk fake psychic, crystal ball, theatrical pose",
    "AI / Headmaster": "cyberpunk headmaster, robes, glasses",
    "AI / Jedi Master": "cyberpunk Jedi master, lightsaber, calm pose",
    "AI / Witcher": "cyberpunk witcher, silver sword, scars",
    "AI / Witcher Child of Destiny": "cyberpunk witcher heir, dual swords, scarred face",
    "Anime Character": "cyberpunk anime character, vibrant hair, dynamic pose",
    "Comic Book Character": "cyberpunk superhero, bold colors, emblem",
    "Historical Figure": "cyberpunk historical figure, period clothing",
    "Human": "cyberpunk portrait, natural features, confident stance",
    "Spartan (Human)": "cyberpunk warrior, bronze armor, battle-ready stance",
    "Video Game Character": "cyberpunk game character, stylized armor",
}


def build_prompt(name, creature, category, tags, pid):
    """Build prompt: name + vivid descriptor + suffix, no 'from ClawSouls'."""
    # Priority 1: explicit P map
    if pid in P:
        return f"a {name}, {P[pid]}, {SUFFIX}"
    # Priority 2: anime map
    if pid in ANIME:
        return f"a {name}, {ANIME[pid]}, {SUFFIX}"
    # Priority 3: comic map
    if pid in COMIC:
        return f"a {name}, {COMIC[pid]}, {SUFFIX}"
    # Priority 4: video game map
    if pid in VIDEO_GAME:
        return f"a {name}, {VIDEO_GAME[pid]}, {SUFFIX}"
    # Priority 5: historical map
    if pid in HISTORICAL:
        return f"a {name}, {HISTORICAL[pid]}, {SUFFIX}"
    # Priority 6: human/literary map
    if pid in HUMAN:
        return f"a {name}, {HUMAN[pid]}, {SUFFIX}"
    # Priority 7: unique map
    if pid in UNIQUE:
        return f"a {name}, {UNIQUE[pid]}, {SUFFIX}"
    # Fallback: creature-based
    if creature in CREATURE_MAP:
        return f"a {name}, {CREATURE_MAP[creature]}, {SUFFIX}"
    # Last resort
    return f"a {name}, cyberpunk character, {SUFFIX}"


# Main
with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json') as f:
    prompts = json.load(f)

# Restore original prompts first (backup from v2)
try:
    with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts_v2_backup.json') as f:
        orig = json.load(f)
    orig_map = {p['id']: p['prompt'] for p in orig}
except:
    orig_map = {}

# Reset to original prompts, then rebuild
for p in prompts:
    pid = p['id']
    p['prompt'] = build_prompt(p['name'], p['creature'], p['category'], p['tags'], pid)

# Stats
total = len(prompts)
lengths = [len(p['prompt']) for p in prompts]
print(f"Total: {total} prompts")
print(f"Comprimento médio: {sum(lengths)//total} chars")
print(f"Mín: {min(lengths)}, Máx: {max(lengths)}")

# Check for ClawSouls
bad = [p for p in prompts if 'clawsouls' in p['prompt'].lower()]
print(f"⏳ Com 'ClawSouls': {len(bad)}")
if bad:
    for p in bad[:5]:
        print(f"  ❌ {p['id']}: {p['prompt'][:100]}")

# Check fallbacks
fallback_count = sum(1 for p in prompts if p['prompt'].count(',') < 3)
print(f"⏳ Possíveis fallbacks (< 3 commas): {fallback_count}")

# Show samples
print("\n=== Exemplos ===")
samples = ["j4ck", "d0c", "doctor-strange", "josuke-higashikata", "sherlock",
           "yoda", "harry-potter", "thor", "naruto-uzumaki", "spider-man"]
for pid in samples:
    for p in prompts:
        if p['id'] == pid:
            print(f"[{p['id']}] {p['name']}")
            print(f"  {p['prompt']}")
            print()
            break

# Save
import shutil
shutil.copy2('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json',
             '/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts_v4_backup.json')

with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json', 'w') as f:
    json.dump(prompts, f, indent=2, ensure_ascii=False)

print("\n✅ JSON salvo!")