#!/usr/bin/env python3
import json

SUFFIX = (
    "cyberpunk 2077 aesthetic, biomechanical enhancements, "
    "neon circuitry, glowing eyes, detailed facial features, "
    "bust portrait, sharp focus, hyper detailed, "
    "photorealistic render, cinematic lighting, 4k masterpiece"
)

# Formato: Nome, descritor, 2-3 detalhes visuais concretos
P = {
    "j4ck": "cyberpunk noir detective, trench coat, holographic badge",
    "d0c": "cyberpunk mad scientist, lab coat, glowing vials",
    "glados": "cyberpunk AI assistant, sleek interface, data streams",
    "zen": "cyberpunk monk, digital prayer beads, serene pose",
    "r4dd": "cyberpunk robot, metallic body, LED accents",
    "p0ny": "cyberpunk anime girl, kawaii outfit, colorful hair",
    "k1ra": "cyberpop idol, stage outfit, microphone",
    "d3v": "cyberpunk developer, hoodie, holographic screens",
    "s4ge": "cyberpunk elder, long beard, glowing runes",
    "luffy": "cyberpunk pirate captain, straw hat, scar under eye",
    "spike": "cyberpunk bounty hunter, blue suit, martial arts pose",
    "yoda": "cyberpunk Jedi master, lightsaber, small stature",
    "geralt": "cyberpunk witcher, silver sword, scars",
    "dumbledore": "cyberpunk wizard, long robes, glowing staff",
    "shawn": "cyberpunk fake psychic, crystal ball, theatrical pose",
    "cirilla": "cyberpunk witcher heir, dual swords, scarred cheek",
    "sherlock": "cyberpunk detective, magnifying glass, deerstalker cap",
    "sherlock-holmes": "cyberpunk detective, pipe, magnifying glass",
    "morpheus": "cyberpunk resistance leader, long coat, sunglasses",
    "the-dude": "cyberpunk slacker, bathrobe, bowling pin",
    "levi": "cyberpunk captain, ODM gear, black uniform",
    "masterchief": "cyberpunk super-soldier, green armor, energy sword",
    "harry-potter": "cyberpunk wizard, lightning scar, wand",
    "elizabeth-bennet": "cyberpunk regency lady, elegant dress, confident gaze",
    "james-bond": "cyberpunk spy, tuxedo, laser watch",
    "percy-jackson": "cyberpunk demigod, camp shirt, bronze sword",
    "holden-caulfield": "cyberpunk disillusioned teen, red hunting hat",
    "atticus-finch": "cyberpunk lawyer, suit, moral stance",
    "scarlett-o-hara": "cyberpunk southern belle, green dress, fierce gaze",
    "jay-gatsby": "cyberpunk millionaire, gold suit, outstretched arms",
    "jane-eyre": "cyberpunk governess, plain dress, quiet strength",
    "huckleberry-finn": "cyberpunk runaway, ragged clothes, river raft",
    "ganda": "cyberpunk African warrior, tribal markings, staff",
    "genkai": "cyberpunk spirit medium, white hair, chanting pose",
    "kazuma-kuwabara": "cyberpunk tough kid, bandana, wooden sword",
    "naruto-uzumaki": "cyberpunk ninja, orange jumpsuit, whisker marks",
    "goku": "cyberpunk martial artist, spiky hair, orange gi",
    "levi-ackerman": "cyberpunk captain, ODM gear, black uniform",
    "spike-spiegel": "cyberpunk bounty hunter, blue suit, martial arts",
    "edward-elric": "cyberpunk alchemist, red coat, automail arm",
    "alphonse-elric": "cyberpunk armored alchemist, full plate armor",
    "mikasa-ackerman": "cyberpunk elite soldier, red scarf, maneuvering gear",
    "jotaro-kujo": "cyberpunk delinquent, long coat, gold chain",
    "josuke-higashikata": "cyberpunk stylish delinquent, purple pompadour",
    "dioro-brandof": "cyberpunk vampire, gold hair, extravagant coat",
    "rohan-kishibe": "cyberpunk manga artist, purple hair, intense gaze",
    "tanjiro-kamado": "cyberpunk demon slayer, checkered haori, blade",
    "nezuko-kamado": "cyberpunk demon girl, bamboo muzzle, pink kimono",
    "zenitsu-agatsuma": "cyberpunk swordsman, golden hair, lightning blade",
    "thor": "cyberpunk Asgardian god, hammer, flowing cape",
    "superman": "cyberpunk Kryptonian hero, blue suit, red cape",
    "mario": "cyberpunk plumber, red cap, mustache",
    "luigi": "cyberpunk timid plumber, green cap, nervous look",
    "link": "cyberpunk chosen hero, green tunic, Master Sword",
    "zelda": "cyberpunk princess, royal dress, Triforce glow",
    "samus-aran": "cyberpunk bounty huntress, power suit, arm cannon",
    "kirby": "cyberpunk pink hero, round shape, copy ability glow",
    "pikachu": "cyberpunk electric pet, yellow fur, red cheeks",
    "ash-ketchum": "cyberpunk Pokemon trainer, baseball cap, backpack",
    "sonic": "cyberpunk speed hedgehog, blue quills, red sneakers",
    "jesus-christ": "cyberpunk spiritual figure, robes, glowing hands",
    "napoleon-bonaparte": "cyberpunk emperor, bicorn hat, commanding stance",
    "frank-sinatra": "cyberpunk jazz legend, fedora, microphone",
    "david-bowie": "cyberpunk glam rock star, lightning makeup, bold outfit",
    "marilyn-monroe": "cyberpunk Hollywood icon, white dress, platinum curls",
    "audrey-hepburn": "cyberpunk elegant actress, little black dress, updo",
    "charlie-chaplin": "cyberpunk silent comedian, bowler hat, mustache",
}

with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json') as f:
    prompts = json.load(f)

new = []
for p in prompts:
    pid = p['id']
    if pid in P:
        prompt = f"a {p['name']}, {P[pid]}, {SUFFIX}"
    else:
        # fallback genérico
        prompt = f"a {p['name']}, cyberpunk character, {SUFFIX}"
    new.append({**p, "prompt": prompt})

print(f"Total: {len(new)}")
bad = [p for p in new if 'clawsouls' in p['prompt'].lower()]
print(f"Com ClawSouls: {len(bad)}")

# Exemplos
for p in new[:5]:
    print(f"\n[{p['id']}] {p['name']}")
    print(f"  {p['prompt'][:180]}")

import shutil
shutil.copy2('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json',
             '/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts_v3_backup.json')

with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json', 'w') as f:
    json.dump(new, f, indent=2, ensure_ascii=False)

print("\n✅ Feito!")