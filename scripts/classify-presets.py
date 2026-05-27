#!/usr/bin/env python3
"""
Classify 509 ClawSouls presets into category tags.
Merges new category tags with existing granular tags.
"""
import re
import json

# ─── Master Category Tags ──────────────────────────────────────────
# Each category has keywords that trigger assignment

CATEGORY_RULES = {
    # ── Identity / Gender ──
    "homem": {
        "creature_kw": ["man", " male", " boy", " king", " prince", " lord", " emperor", " duke", " sir", " brother", " father", " son", " uncle", " grandfather", " boy"],
        "name_kw": [],
        "desc_kw": [" he ", " his ", " man ", " male ", " boy "],
        "tag_kw": ["king", "prince", "emperor", "duke", "lord", "brother", "father", "son"],
        "exclude_tags": ["goddess", "queen", "princess", "empress"],
    },
    "mulher": {
        "creature_kw": ["woman", " girl", " queen", " princess", " empress", " lady", " goddess", " sister", " mother", " daughter", " aunt", " grandmother", " witch", " sorceress", " nun", " maiden"],
        "name_kw": [],
        "desc_kw": [" she ", " her ", " woman ", " girl ", " female "],
        "tag_kw": ["queen", "princess", "empress", "goddess", "sister", "mother", "daughter", "sorceress", "witch", "maiden"],
        "exclude_tags": [],
    },
    "robo": {
        "creature_kw": ["robot", " ai ", " android", " cyborg", " machine", " automaton", " mech", " droid", " computer", " program", " system", " holographic"],
        "name_kw": [],
        "desc_kw": [" artificial intelligence", " machine learning", " algorithm", " program", " code", " digital", " circuit", " processor", " cpu", " ram"],
        "tag_kw": ["ai", "robot", "android", "cyborg", "machine", "automaton", "smart-ai", "holographic-assistant"],
        "exclude_tags": [],
    },
    "animal": {
        "creature_kw": ["cat", " dog", " fox", " wolf", " bear", " lion", " tiger", " eagle", " hawk", " snake", " dragon", " fish", " bird", " horse", " monkey", " rabbit", " mouse", " rat", " dolphin", " whale", " shark", " spider", " bat", " deer", " cow", " pig", " sheep", " goat", " chicken", " duck", " owl", " crow", " raven", " parrot", " penguin", " unicorn", " phoenix", " griffin", " pegasus", " centaur", " mermaid", " siren", " naga", " kitsune", " tanuki", " yokai"],
        "name_kw": [],
        "desc_kw": [" animal", " beast", " creature", " pet", " familiar"],
        "tag_kw": ["cat", "fox", "dragon", "rabbit", "monkey", "unicorn", "phoenix", "griffin", "pegasus", "centaur", "mermaid", "siren", "kitsune", "tanuki", "yokai"],
        "exclude_tags": [],
    },
    "divindade": {
        "creature_kw": ["god", " goddess", " deity", " divine", " celestial", " angel", " demon", " devil", " spirit", " oracle", " titan", " demigod", " immortal", " cosmic", " supreme"],
        "name_kw": [],
        "desc_kw": [" god", " goddess", " deity", " divine", " celestial", " immortal", " omnipoten", " omniscien", " all-powerful", " all-knowing"],
        "tag_kw": ["god", "goddess", "deity", "demigod", "immortal", "celestial", "spirit", "divine", "orixa", "kami", "aesir", "vanir", "olympus", "asgard"],
        "exclude_tags": [],
    },

    # ── Genre ──
    "ficção": {
        "creature_kw": ["alien", " space", " star", " galactic", " cosmic", " robot", " cyber", " mutant", " super", " meta", " powered", " force", " magic", " wizard", " sorcerer", " portal", " dimension"],
        "name_kw": [],
        "desc_kw": [" sci-fi", " science fiction", " fantasy", " futuristic", " space", " galaxy", " universe", " multiverse", " dimension", " superpower", " magic"],
        "tag_kw": ["sci-fi", "space", "cosmic", "supernatural", "magic", "portal", "dimension-traveler", "alien", "mutant", "metahuman"],
        "exclude_tags": [],
    },
    "histórico": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" historical", " history", " ancient", " medieval", " victorian", " roman", " greek", " egyptian", " feudal", " renaissance", " colonial", " war", " dynasty", " empire"],
        "tag_kw": ["historical", "ancient", "roman", "medieval", "victorian", "colonial", "dynasty", "war", "empire"],
        "exclude_tags": [],
    },
    "mitológico": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" mytholog", " mythology", " legend", " folklore", " fairy tale", " fable", " epic"],
        "tag_kw": ["mythology", "mythological", "greek", "norse", "egyptian", "aztec", "yoruba", "shinto", "hindu", "chinese", "mesoamerican", "asgard", "olympus", "orixa", "kami"],
        "exclude_tags": [],
    },
    "contemporâneo": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" modern", " contemporary", " current", " today", " real world", " real life", " pop culture", " celebrity", " famous singer", " famous actor"],
        "tag_kw": ["celebrity", "modern", "contemporary", "pop", "music", "famous"],
        "exclude_tags": [],
    },

    # ── Personality ──
    "calmo": {
        "creature_kw": ["monk", " sage", " zen", " meditat", " calm", " serene", " peaceful", " gentle", " quiet"],
        "name_kw": [],
        "desc_kw": [" calm", " serene", " peaceful", " quiet", " gentle", " tranquil", " composed", " patient", " zen", " meditative", " stoic"],
        "tag_kw": ["calm", "zen", "meditation", "stoic", "calm-wisdom", "gentle", "peaceful", "serene"],
        "exclude_tags": [],
    },
    "agressivo": {
        "creature_kw": ["warrior", " berserker", " barbarian", " fighter", " soldier", " grunt", " brute", " savage", " destroyer", " killer", " hunter"],
        "name_kw": [],
        "desc_kw": [" aggressive", " fierce", " violent", " brutal", " savage", " ruthless", " merciless", " angry", " rage", " wrath", " combat", " battle"],
        "tag_kw": ["wild_berserker", "feral-warrior", "aggressive", "violent", "brutal", "merciless", "vengeful", "war", "destroyer"],
        "exclude_tags": [],
    },
    "sarcástico": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" sarcastic", " sardonic", " ironic", " witty", " snarky", " cynical", " dry humor", " deadpan", " mocking"],
        "tag_kw": ["sarcastic", "sardonic", "ironic", "cynical", "deadpan", "snarky", "comic-relief", "wisecracker"],
        "exclude_tags": [],
    },
    "otimista": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" optimistic", " cheerful", " positive", " hopeful", " happy", " bright", " sunny", " upbeat", " enthusiastic", " energetic", " lively"],
        "tag_kw": ["optimistic", "positive", "cheerful", "hopeful", "energetic", "inspirational", "motivational", "upbeat"],
        "exclude_tags": [],
    },
    "sombrio": {
        "creature_kw": ["dark", " shadow", " death", " grim", " grim reaper", " nightmare", " horror", " haunted", " ghost", " wraith", " specter", " phantom", " undead", " vampire", " werewolf", " zombie"],
        "name_kw": [],
        "desc_kw": [" dark", " brooding", " grim", " somber", " melancholy", " tragic", " haunted", " tortured", " shadow", " darkness", " horror"],
        "tag_kw": ["dark", "brooding", "grim", "sombre", "tragic", "haunted", "shadow", "villain_cold", "villain_chaotic"],
        "exclude_tags": [],
    },
    "energético": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" energetic", " hyperactive", " wild", " crazy", " chaotic", " explosive", " dynamic", " fast", " quick", " rapid", " speed"],
        "tag_kw": ["energetic", "chaotic", "hyperactive", "wild", "dynamic", "high-energy", "lightning-fast"],
        "exclude_tags": [],
    },

    # ── Use Case ──
    "desenvolvimento": {
        "creature_kw": ["developer", " programmer", " coder", " engineer", " hacker", " sysadmin", " devops"],
        "name_kw": [],
        "desc_kw": [" code", " programming", " software", " developer", " engineer", " debug", " deploy", " git", " api", " backend", " frontend", " fullstack", " full-stack", " devops", " ci/cd"],
        "tag_kw": ["developer", "code", "engineering", "pragmatic"],
        "exclude_tags": [],
    },
    "trabalho": {
        "creature_kw": ["manager", " ceo", " boss", " leader", " executive", " consultant", " advisor", " analyst", " director", " coordinator", " assistant", " secretary"],
        "name_kw": [],
        "desc_kw": [" work", " business", " corporate", " office", " professional", " career", " job", " company", " startup", " enterprise", " management", " leadership", " team", " productivity"],
        "tag_kw": ["ceo", "leader", "professional", "entrepreneur", "business"],
        "exclude_tags": [],
    },
    "lifestyle": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" lifestyle", " wellness", " health", " fitness", " cooking", " travel", " fashion", " beauty", " self-care", " mindfulness", " yoga", " meditation", " hobby", " creative", " art"],
        "tag_kw": ["yoga", "meditation", "travel", "fashion", "beauty", "wellness", "cooking", "lifestyle"],
        "exclude_tags": [],
    },
    "escrita": {
        "creature_kw": ["writer", " author", " poet", " journalist", " editor", " novelist", " storyteller", " narrator", " scribe", " bard"],
        "name_kw": [],
        "desc_kw": [" write", " writing", " story", " narrative", " prose", " poetry", " novel", " book", " article", " blog", " content", " copywriting", " creative writing"],
        "tag_kw": ["writing", "storyteller", "novelist", "author", "poet", "bard", "american-literature"],
        "exclude_tags": [],
    },
    "marketing": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" marketing", " brand", " advertising", " social media", " content strategy", " seo", " growth", " campaign", " audience", " engagement"],
        "tag_kw": ["marketing", "brand", "social-media", "growth", "content"],
        "exclude_tags": [],
    },
    "educação": {
        "creature_kw": ["teacher", " professor", " tutor", " mentor", " instructor", " educator", " scholar", " academic"],
        "name_kw": [],
        "desc_kw": [" teach", " education", " learning", " study", " school", " university", " academic", " knowledge", " training", " tutorial", " course"],
        "tag_kw": ["mentor", "teacher", "scholar", "education", "knowledge", "master-teacher"],
        "exclude_tags": [],
    },

    # ── Domain ──
    "tecnologia": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" technology", " tech", " software", " hardware", " computer", " internet", " web", " app", " digital", " data", " cloud", " ai", " machine learning", " blockchain", " crypto"],
        "tag_kw": ["ai", "technology", "digital", "tech", "smart-ai"],
        "exclude_tags": [],
    },
    "ciência": {
        "creature_kw": ["scientist", " researcher", " professor", " physicist", " chemist", " biologist", " mathematician", " astronomer"],
        "name_kw": [],
        "desc_kw": [" science", " research", " experiment", " theory", " hypothesis", " laboratory", " physics", " chemistry", " biology", " mathematics", " astronomy"],
        "tag_kw": ["scientist", "researcher", "genius", "innovator", "mad"],
        "exclude_tags": [],
    },
    "arte": {
        "creature_kw": ["artist", " painter", " sculptor", " musician", " singer", " dancer", " actor", " performer", " designer", " photographer", " filmmaker", " composer"],
        "name_kw": [],
        "desc_kw": [" art", " creative", " design", " music", " painting", " sculpture", " dance", " theater", " film", " photography", " aesthetic", " visual"],
        "tag_kw": ["art", "artist", "creative", "music", "design", "painter", "musician", "singer", "dancer", "actor"],
        "exclude_tags": [],
    },
    "negócios": {
        "creature_kw": ["ceo", " entrepreneur", " founder", " investor", " executive", " manager", " director", " consultant"],
        "name_kw": [],
        "desc_kw": [" business", " startup", " company", " enterprise", " revenue", " profit", " market", " strategy", " finance", " investment", " venture", " corporate"],
        "tag_kw": ["ceo", "entrepreneur", "business", "billionaire", "leader"],
        "exclude_tags": [],
    },
    "saúde": {
        "creature_kw": ["doctor", " nurse", " healer", " therapist", " medic", " surgeon", " physician", " counselor"],
        "name_kw": [],
        "desc_kw": [" health", " medical", " medicine", " healing", " therapy", " wellness", " mental health", " psychology", " fitness", " nutrition"],
        "tag_kw": ["healer", "healing", "medicine", "therapy", "doctor"],
        "exclude_tags": [],
    },
    "segurança": {
        "creature_kw": ["guard", " soldier", " military", " spy", " agent", " operative", " detective", " police", " officer", " security", " bodyguard", " mercenary", " assassin", " sniper"],
        "name_kw": [],
        "desc_kw": [" security", " military", " spy", " intelligence", " combat", " weapon", " tactical", " defense", " protection", " surveillance", " espionage"],
        "tag_kw": ["soldier", "spy", "assassin", "mercenary", "military", "detective", "sniper", "tactical", "bodyguard"],
        "exclude_tags": [],
    },
    "engenharia": {
        "creature_kw": ["engineer", " architect", " mechanic", " inventor", " builder", " craftsman"],
        "name_kw": [],
        "desc_kw": [" engineer", " engineering", " architecture", " design", " build", " construct", " invent", " prototype", " system", " infrastructure"],
        "tag_kw": ["engineer", "inventor", "craftsman", "architect", "mechanic"],
        "exclude_tags": [],
    },

    # ── Source ──
    "marvel": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" marvel", " avengers", " x-men", " spider-man", " iron man", " captain america", " thor", " hulk", " black widow", " wolverine", " deadpool"],
        "tag_kw": ["marvel", "marvel comics", "avenger", "x-men"],
        "exclude_tags": [],
    },
    "dc": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" dc comics", " batman", " superman", " wonder woman", " flash", " green lantern", " aquaman", " justice league", " gotham", " krypton", " amazon"],
        "tag_kw": ["dc", "dc comics", "justice league", "gotham", "teen titans", "green lantern corps"],
        "exclude_tags": [],
    },
    "anime": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" anime", " manga", " shonen", " shounen", " seinen", " josei", " mecha", " isekai", " chibi", " kawaii", " otaku", " senpai", " sensei"],
        "tag_kw": ["anime", "manga", "shonen", "anime_cute", "anime_girl_strong", "moe", "kawaii"],
        "exclude_tags": [],
    },
    "videogame": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" video game", " videogame", " gaming", " nintendo", " playstation", " xbox", " pc game", " rpg", " fps", " mmo", " moba", " battle royale"],
        "tag_kw": ["video game", "gaming", "nintendo", "playstation", "xbox", "rpg", "mario", "zelda", "pokemon", "final fantasy", "halo", "mass effect", "gears of war", "metal gear", "sonic", "uncharted", "last of us", "witcher", "doom", "red dead", "max payne", "tomb raider", "legend-of-zelda", "super-mario", "mushroom-kingdom"],
        "exclude_tags": [],
    },
    "HQ": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" comic", " comics", " graphic novel", " superhero", " supervillain", " comic book"],
        "tag_kw": ["comics", "comic", "superhero", "supervillain"],
        "exclude_tags": [],
    },
    "filme": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" movie", " film", " cinema", " hollywood", " blockbuster", " franchise"],
        "tag_kw": ["movie", "film", "cinema"],
        "exclude_tags": [],
    },

    # ── Role ──
    "herói": {
        "creature_kw": ["hero", " champion", " savior", " protector", " guardian", " knight", " paladin", " avenger", " defender"],
        "name_kw": [],
        "desc_kw": [" hero", " heroic", " champion", " savior", " protect", " defend", " save", " justice", " noble", " brave", " courageous"],
        "tag_kw": ["hero", "superhero", "champion", "protector", "guardian", "noble_hero", "legendary-hero", "street-level-hero"],
        "exclude_tags": [],
    },
    "vilão": {
        "creature_kw": ["villain", " evil", " dark lord", " tyrant", " conqueror", " destroyer", " nemesis", " antagonist", " boss villain"],
        "name_kw": [],
        "desc_kw": [" villain", " evil", " dark", " malevolent", " malicious", " sinister", " wicked", " cruel", " tyrant", " conquer", " destroy", " domination"],
        "tag_kw": ["villain", "antagonist", "villain_cold", "villain_chaotic", "eternal-villain", "iconic-villain", "tragic-villain", "ultimate-villain", "supervillain", "cosmic-villain", "mystical-villain"],
        "exclude_tags": [],
    },
    "anti-herói": {
        "creature_kw": ["anti-hero", " antihero", " vigilante", " outlaw", " rogue", " mercenary", " bounty hunter", " renegade"],
        "name_kw": [],
        "desc_kw": [" anti-hero", " antihero", " vigilante", " morally gray", " morally grey", " gray area", " grey area", " rogue", " renegade", " maverick", " rebel"],
        "tag_kw": ["anti-hero", "vigilante", "rogue", "mercenary", "bounty-hunter", "morally-gray", "morally-grey", "renegade"],
        "exclude_tags": [],
    },
    "mentor": {
        "creature_kw": ["mentor", " teacher", " master", " sensei", " guru", " sage", " elder", " guide", " advisor", " coach"],
        "name_kw": [],
        "desc_kw": [" mentor", " teach", " guide", " train", " coach", " wisdom", " experience", " master", " sensei", " guru"],
        "tag_kw": ["mentor", "master-teacher", "sage", "elder", "wise-elder", "guru", "sensei"],
        "exclude_tags": [],
    },
    "líder": {
        "creature_kw": ["leader", " commander", " captain", " chief", " general", " president", " prime minister", " king", " queen", " emperor", " empress"],
        "name_kw": [],
        "desc_kw": [" leader", " leadership", " command", " authority", " rule", " govern", " lead", " inspire", " rally", " unite"],
        "tag_kw": ["leader", "commander", "captain", "general", "king", "queen", "emperor", "empress"],
        "exclude_tags": [],
    },
    "companheiro": {
        "creature_kw": ["companion", " sidekick", " partner", " friend", " ally", " helper", " assistant", " pet", " familiar"],
        "name_kw": [],
        "desc_kw": [" companion", " sidekick", " partner", " friend", " ally", " loyal", " faithful", " devoted", " support", " help"],
        "tag_kw": ["companion", "sidekick", "partner", "loyal-friend", "best-friend", "emotional-anchor", "emotional-support"],
        "exclude_tags": [],
    },

    # ── Profession ──
    "cantor": {
        "creature_kw": ["singer", " vocalist", " musician", " rapper", " dj", " producer", " songwriter", " performer", " pop star", " rock star", " idol"],
        "name_kw": [],
        "desc_kw": [" sing", " music", " album", " tour", " concert", " stage", " perform", " vocal", " melody", " rhythm", " band", " grammy", " billboard"],
        "tag_kw": ["singer", "musician", "vocalist", "rapper", "pop", "idol", "rock-legend", "music-icon", "queen-of-pop", "queen-of-soul", "pop-star", "singer-songwriter"],
        "exclude_tags": [],
    },
    "ator": {
        "creature_kw": ["actor", " actress", " performer", " star", " celebrity"],
        "name_kw": [],
        "desc_kw": [" act", " film", " movie", " theater", " theatre", " hollywood", " performance", " role", " character", " celebrity"],
        "tag_kw": ["actor", "actress", "performer", "celebrity", "famous"],
        "exclude_tags": [],
    },
    "artista": {
        "creature_kw": ["artist", " painter", " sculptor", " designer", " illustrator", " animator", " photographer", " filmmaker", " creator"],
        "name_kw": [],
        "desc_kw": [" art", " paint", " draw", " design", " illustrate", " create", " gallery", " exhibit", " masterpiece", " canvas", " brush"],
        "tag_kw": ["artist", "painter", "designer", "illustrator", "creator", "manga-artist"],
        "exclude_tags": [],
    },
    "escritor": {
        "creature_kw": ["writer", " author", " novelist", " poet", " journalist", " editor", " columnist", " screenwriter", " playwright"],
        "name_kw": [],
        "desc_kw": [" write", " book", " novel", " poetry", " publish", " manuscript", " story", " prose", " literary", " bibliography"],
        "tag_kw": ["writer", "author", "novelist", "poet", "journalist", "storyteller"],
        "exclude_tags": [],
    },
    "cientista": {
        "creature_kw": ["scientist", " researcher", " physicist", " chemist", " biologist", " mathematician", " astronomer", " inventor"],
        "name_kw": [],
        "desc_kw": [" science", " research", " experiment", " theory", " discover", " laboratory", " hypothesis", " formula", " equation"],
        "tag_kw": ["scientist", "researcher", "genius", "inventor", "innovator"],
        "exclude_tags": [],
    },
    "guerreiro": {
        "creature_kw": ["warrior", " soldier", " fighter", " knight", " samurai", " viking", " spartan", " gladiator", " berserker", " ranger"],
        "name_kw": [],
        "desc_kw": [" war", " battle", " combat", " fight", " sword", " shield", " armor", " army", " military", " tactical"],
        "tag_kw": ["warrior", "soldier", "fighter", "knight", "samurai", "viking", "spartan", "gladiator", "berserker"],
        "exclude_tags": [],
    },

    # ── Additional from user list ──
    "personal": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" personal", " individual", " self", " private", " intimate", " custom", " tailored", " your own"],
        "tag_kw": ["personal", "custom", "individual"],
        "exclude_tags": [],
    },
    "creative": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" creative", " imaginative", " artistic", " innovative", " original", " inspired", " visionary"],
        "tag_kw": ["creative", "artistic", "imaginative", "innovator", "visionary"],
        "exclude_tags": [],
    },
    "professional": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" professional", " corporate", " business", " executive", " enterprise", " formal", " official"],
        "tag_kw": ["professional", "corporate", "executive"],
        "exclude_tags": [],
    },
    "developer-tools": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" dev tool", " developer tool", " cli", " terminal", " ide", " editor", " compiler", " debugger", " framework", " library", " sdk", " api", " devops", " ci/cd", " docker", " kubernetes"],
        "tag_kw": ["developer", "devops", "engineering"],
        "exclude_tags": [],
    },
    "design": {
        "creature_kw": ["designer", " artist", " illustrator", " animator", " ux", " ui"],
        "name_kw": [],
        "desc_kw": [" design", " visual", " aesthetic", " layout", " typography", " color", " ui", " ux", " interface", " graphic"],
        "tag_kw": ["design", "artist", "creative", "visual"],
        "exclude_tags": [],
    },
    "security": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" security", " cybersecurity", " hack", " exploit", " vulnerability", " encryption", " firewall", " penetration", " malware", " phishing"],
        "tag_kw": ["security", "hacker", "cybersecurity"],
        "exclude_tags": [],
    },
    "experimental": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" experimental", " cutting edge", " bleeding edge", " avant-garde", " radical", " unconventional", " unorthodox", " innovative"],
        "tag_kw": ["experimental", "innovative", "unconventional", "radical"],
        "exclude_tags": [],
    },
    "assistant": {
        "creature_kw": ["assistant", " helper", " aide", " secretary", " butler", " valet", " concierge", " advisor", " counselor"],
        "name_kw": [],
        "desc_kw": [" assist", " help", " support", " aid", " serve", " manage", " organize", " schedule", " remind"],
        "tag_kw": ["assistant", "helper", "companion", "advisor"],
        "exclude_tags": [],
    },
    "operations": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" operations", " ops", " infrastructure", " deployment", " monitoring", " reliability", " sre", " devops", " automation", " pipeline"],
        "tag_kw": ["devops", "operations", "infrastructure", "automation"],
        "exclude_tags": [],
    },
    "language": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" language", " linguist", " translator", " interpreter", " polyglot", " multilingual", " grammar", " vocabulary", " syntax"],
        "tag_kw": ["language", "linguist", "translator", "polyglot"],
        "exclude_tags": [],
    },
    "general": {
        "creature_kw": [],
        "name_kw": [],
        "desc_kw": [" general purpose", " versatile", " all-around", " multi-purpose", " flexible", " adaptable"],
        "tag_kw": ["general", "versatile", "all-purpose"],
        "exclude_tags": [],
    },
}


def classify_preset(preset):
    """Given a preset dict, return a set of category tags to add."""
    categories = set()
    
    name = (preset.get('name') or '').lower()
    creature = (preset.get('creature') or '').lower()
    desc = (preset.get('description') or preset.get('desc') or '').lower()
    vibe = (preset.get('vibe') or '').lower()
    existing_tags = [t.lower() for t in (preset.get('tags') or [])]
    
    combined_text = f"{name} {creature} {desc} {vibe}"
    
    for cat, rules in CATEGORY_RULES.items():
        matched = False
        
        # Check creature keywords
        for kw in rules.get('creature_kw', []):
            if kw.lower() in creature:
                matched = True
                break
        
        # Check description/vibe keywords
        if not matched:
            for kw in rules.get('desc_kw', []):
                if kw.lower() in combined_text:
                    matched = True
                    break
        
        # Check existing tag matches
        if not matched:
            for kw in rules.get('tag_kw', []):
                if kw.lower() in existing_tags:
                    matched = True
                    break
        
        # Check name keywords
        if not matched:
            for kw in rules.get('name_kw', []):
                if kw.lower() in name:
                    matched = True
                    break
        
        if matched:
            categories.add(cat)
    
    return categories


def main():
    # Parse presets from data/presets.ts
    with open('/home/ubuntu/clawsouls/data/presets.ts', 'r') as f:
        content = f.read()
    
    blocks = re.split(r"(?=\n\s+id: ')", content)
    presets = []
    for block in blocks:
        id_m = re.search(r"id:\s*'([^']+)'", block)
        if not id_m:
            continue
        
        name_m = re.search(r"name:\s*'([^']+)'", block)
        creature_m = re.search(r"creature:\s*'([^']+)'", block)
        desc_m = re.search(r"description:\s*'([^']*(?:\\.[^']*)*)'", block)
        vibe_m = re.search(r"vibe:\s*'([^']*(?:\\.[^']*)*)'", block)
        tags_m = re.search(r"tags:\s*\[([^\]]*)\]", block, re.DOTALL)
        
        tags = []
        if tags_m:
            tags = [t.strip().strip("'\"") for t in tags_m.group(1).split(',') if t.strip().strip("'\"")]
        
        presets.append({
            'id': id_m.group(1),
            'name': name_m.group(1) if name_m else '',
            'creature': creature_m.group(1) if creature_m else '',
            'desc': desc_m.group(1) if desc_m else '',
            'vibe': vibe_m.group(1) if vibe_m else '',
            'tags': tags,
            'block_start': block[:20],
        })
    
    print(f"Parsed {len(presets)} presets")
    
    # Classify each preset
    category_counts = {}
    presets_with_categories = []
    
    for p in presets:
        cats = classify_preset(p)
        for c in cats:
            category_counts[c] = category_counts.get(c, 0) + 1
        
        # Merge: keep existing tags, add new categories
        merged_tags = list(set(p['tags'] + list(cats)))
        presets_with_categories.append({
            'id': p['id'],
            'name': p['name'],
            'old_tags': p['tags'],
            'new_categories': sorted(cats),
            'merged_tags': sorted(merged_tags),
        })
    
    # Stats
    print(f"\nCategory distribution:")
    for cat, count in sorted(category_counts.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}")
    
    # Show some examples
    print(f"\nExamples:")
    for p in presets_with_categories[:5]:
        print(f"  {p['id']}: {p['name']}")
        print(f"    Old tags: {p['old_tags']}")
        print(f"    New cats: {p['new_categories']}")
        print(f"    Merged:   {p['merged_tags']}")
    
    # Check presets with no categories
    no_cats = [p for p in presets_with_categories if not p['new_categories']]
    print(f"\nPresets with NO categories: {len(no_cats)}")
    for p in no_cats[:10]:
        print(f"  {p['id']}: {p['name']} (tags: {p['old_tags']})")
    
    # Save classification result
    with open('/tmp/preset_classification.json', 'w') as f:
        json.dump(presets_with_categories, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved to /tmp/preset_classification.json")


if __name__ == '__main__':
    main()
