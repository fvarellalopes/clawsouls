#!/usr/bin/env python3
import json

SUFFIX = (
    "cyberpunk 2077 aesthetic, biomechanical enhancements, "
    "neon circuitry, glowing eyes, detailed facial features, "
    "bust portrait, sharp focus, hyper detailed, "
    "photorealistic render, cinematic lighting, 4k masterpiece"
)

M = {}

# === ORIGINAL AI/UNIQUE CHARACTERS ===
M["j4ck"] = "cyberpunk noir detective, trench coat, holographic badge"
M["d0c"] = "cyberpunk mad scientist, lab coat, glowing chemical vials, wild hair"
M["glados"] = "cyberpunk AI research assistant, sleek interface body, single eye core, data streams"
M["zen"] = "cyberpunk monk, digital prayer beads, serene expression, flowing robes"
M["r4dd"] = "cyberpunk robot, metallic body, LED accents, mechanical joints"
M["p0ny"] = "cyberpunk anime girl, kawaii aesthetic, colorful twin tails, energetic smile"
M["k1ra"] = "cyberpop idol, flashy stage outfit, microphone, sparkling stage lights"
M["d3v"] = "cyberpunk senior developer, hoodie, holographic screens, mechanical keyboard"
M["s4ge"] = "cyberpunk wise elder, long beard, glowing runes, wooden staff"
M["luffy"] = "cyberpunk pirate captain, straw hat, scar under eye, red vest"
M["spike"] = "cyberpunk bounty hunter, blue suit, disheveled hair, martial arts stance"
M["yoda"] = "cyberpunk Jedi master, small stature, green skin, lightsaber, calm presence"
M["geralt"] = "cyberpunk witcher, silver sword, cat eyes, scarred face, medallion"
M["dumbledore"] = "cyberpunk headmaster, long robes, half-moon glasses, glowing staff"
M["shawn"] = "cyberpunk fake psychic, crystal ball, turban, theatrical smirk"
M["cirilla"] = "cyberpunk witcher heiress, dual swords, white hair with black streak, scarred cheek"
M["sherlock"] = "cyberpunk detective, magnifying glass, deerstalker cap, pipe"
M["morpheus"] = "cyberpunk resistance leader, long black coat, sunglasses, red pill"
M["the-dude"] = "cyberpunk slacker, bathrobe, bowling pin, lazy grin"
M["levi"] = "cyberpunk captain, ODM gear, black uniform, intense gaze"
M["masterchief"] = "cyberpunk super-soldier, green MJOLNIR armor, energy sword, visor"
M["sherlock-holmes"] = "cyberpunk detective, pipe, magnifying glass, deerstalker hat"
M["harry-potter"] = "cyberpunk wizard, lightning scar, wand, round glasses, Gryffindor robes"
M["elizabeth-bennet"] = "cyberpunk regency lady, elegant dress, confident gaze, windswept hair"
M["james-bond"] = "cyberpunk secret agent, tuxedo, laser watch, Walther pistol"
M["percy-jackson"] = "cyberpunk demigod, camp shirt, celestial bronze sword, sea-green eyes"
M["holden-caulfield"] = "cyberpunk disillusioned teen, red hunting hat, sullen expression"
M["atticus-finch"] = "cyberpunk principled lawyer, suit, glasses, moral stance"
M["scarlett-o-hara"] = "cyberpunk southern belle, green dress, fierce determination"
M["jay-gatsby"] = "cyberpunk mysterious millionaire, gold suit, outstretched arms"
M["jane-eyre"] = "cyberpunk resilient governess, plain dress, quiet strength"
M["huckleberry-finn"] = "cyberpunk runaway adventurer, ragged clothes, wide-brim hat"
M["ganda"] = "cyberpunk African warrior, tribal markings, wooden staff, beads"

# === ANIME ===
M["naruto-uzumaki"] = "cyberpunk ninja, orange jumpsuit, whisker marks, headband"
M["goku"] = "cyberpunk martial artist, spiky black hair, orange gi, power aura"
M["levi-ackerman"] = "cyberpunk captain, ODM gear, black uniform, sharp blue eyes"
M["spike-spiegel"] = "cyberpunk bounty hunter, blue suit, messy hair, martial artist stance"
M["edward-elric"] = "cyberpunk alchemist, red coat, automail arm, blonde ponytail"
M["alphonse-elric"] = "cyberpunk armored alchemist, full plate armor, soul bound to metal"
M["mikasa-ackerman"] = "cyberpunk elite soldier, red scarf, vertical maneuvering gear, intense gaze"
M["jotaro-kujo"] = "cyberpunk delinquent, long dark coat, gold chain, hat, stoic expression"
M["josuke-higashikata"] = "cyberpunk stylish delinquent, purple pompadour, school uniform, confident"
M["dioro-brandof"] = "cyberpunk vampire, golden hair, extravagant purple coat, menacing smile"
M["rohan-kishibe"] = "cyberpunk manga artist, purple hair, fitted suit, intense stare"
M["tanjiro-kamado"] = "cyberpunk demon slayer, checkered haori, nichirin blade, kind eyes"
M["nezuko-kamado"] = "cyberpunk demon girl, bamboo muzzle, pink kimono, pink eyes"
M["zenitsu-agatsuma"] = "cyberpunk anxious swordsman, golden hair, lightning blade, terrified face"
M["sasuke-uchiha"] = "cyberpunk avenger, black outfit, sharingan eye, dark aura"
M["kakashi-hatake"] = "cyberpunk ninja instructor, mask, headband over one eye, silver hair"
M["itachi-uchiha"] = "cyberpunk tragic hero, Akatsuki cloak, sharingan eye, calm expression"
M["monkey-d--luffy"] = "cyberpunk pirate king, straw hat, red vest, rubber limbs, grin"
M["roronoa-zoro"] = "cyberpunk swordsman, green headband, three swords, scar on chest"
M["sanji"] = "cyberpunk cook, black suit, cigarette, long eyebrow, kick stance"
M["nami"] = "cyberpunk navigator, orange hair, tattoo, bo staff, confident pose"
M["usopp"] = "cyberpunk sniper, goggles, slingshot, long nose, cowardly grin"
M["chopper"] = "cyberpunk reindeer doctor, blue nose, medical kit, cute form"
M["ichigo-kurosaki"] = "cyberpunk soul reaper, orange spiky hair, zanpakuto sword"
M["rukia-kuchiki"] = "cyberpunk soul reaper, black kimono, short stature, cold gaze"
M["aizen-sosuke"] = "cyberpunk villain mastermind, glasses, captain robes, smug smile"
M["gon-freecss"] = "cyberpunk young hunter, green vest, fishing hat, determined eyes"
M["killua-zoldyck"] = "cyberpunk assassin boy, silver hair, cat eyes, electricity aura"
M["hisoka"] = "cyberpunk magician, face paint, playing cards, predatory grin"
M["kurapika"] = "cyberpunk scarlet-eye hunter, chain weapon, piercing red eyes"
M["leorio"] = "cyberpunk medical student, suit, glasses, fist raised"
M["chrollo-lucilfer"] = "cyberpunk phantom troupe leader, silver hair, spider tattoo"
M["meruem"] = "cyberpunk chimera ant king, muscular, antennae, dark armor plating"
M["yusuke-urameshi"] = "cyberpunk spirit detective, spiky hair, school uniform, ghostly aura"
M["hiei"] = "cyberpunk demon fighter, black hair with white streak, evil eye, katana"
M["kurama"] = "cyberpunk fox demon, long red hair, elegant robes, plant whip"
M["kazuma-kuwabara"] = "cyberpunk tough kid, bandana, wooden sword, tough stance"
M["genkai"] = "cyberpunk spirit medium, white hair, chanting pose, prayer beads"
M["inosuke-hashibira"] = "cyberpunk wild warrior, boar mask, dual blades, feral expression"
M["muzan-kibutsuji"] = "cyberpunk demon lord, pale skin, elegant kimono, red eyes"
M["saitama"] = "cyberpunk bald hero, plain yellow suit, blank expression, overwhelming power"
M["genos"] = "cyberpunk cyborg disciple, metal arms, core chest, intense eyes"
M["ginko"] = "cyberpunk mushi researcher, white hair, green eye, coat, calm demeanor"
M["kyo"] = "cyberpunk demon fighter, short hair, martial artist, fierce expression"
M["shigure"] = "cyberpunk writer, laid-back pose, pen, casual clothes"
M["sakura-haruno"] = "cyberpunk kunoichi, pink hair, red outfit, diamond forehead"

# === HUNTER x HUNTER ===
M["killua"] = "cyberpunk assassin boy, silver spiky hair, cat eyes, electricity"
M["gon"] = "cyberpunk young hunter, green vest, fishing hat, spiky hair"
M["hisoka"] = M["hisoka"]  # already defined

# === NARUTO ADDITIONAL ===
M["sakura-haruno"] = "cyberpunk kunoichi, pink hair, red outfit, diamond forehead"

# === VIDEO GAME ===
M["mario"] = "cyberpunk plumber, red cap, thick mustache, overalls, star power glow"
M["luigi"] = "cyberpunk timid plumber, green cap, tall stature, nervous look"
M["link"] = "cyberpunk chosen hero, green tunic, Master Sword, leather cap"
M["zelda"] = "cyberpunk sage princess, royal dress, Triforce glow, crown tiara"
M["samus-aran"] = "cyberpunk bounty huntress, power suit, arm cannon, blonde ponytail"
M["kirby"] = "cyberpunk pink hero, round shape, pink cheeks, star ability glow"
M["pikachu"] = "cyberpunk electric pet, yellow fur, red cheeks, lightning sparks"
M["ash-ketchum"] = "cyberpunk Pokemon trainer, baseball cap, red and white, backpack"
M["sonic"] = "cyberpunk speed hedgehog, blue quills, red sneakers, golden rings"
M["ganondorf"] = "cyberpunk dark warlock, dark armor, glowing triforce, menacing grin"
M["bowser"] = "cyberpunk king of koopas, spiked shell, fire breath, imposing stature"
M["duke-nukem"] = "cyberpunk action hero, muscle, sunglasses, weapons, confident grin"
M["doom-slayer"] = "cyberpunk demon slayer, green armor, shotgun, helmet visor, rage aura"
M["kratos"] = "cyberpunk god of war, white ash skin, Leviathan axe, battle scars"
M["atreus"] = "cyberpunk young warrior, bow and arrows, runic tattoos, fierce eyes"
M["baldur"] = "cyberpunk Norse god, golden skin, fighting stance, piercing eyes"
M["odin"] = "cyberpunk Allfather, eyepatch, dark robes, Gungnir spear, commanding"
M["arthur-morgan"] = "cyberpunk outlaw cowboy, hat, bandana, revolvers, rugged"
M["john-marston"] = "cyberpunk former outlaw, hat, mustache, rifle, weary stance"
M["dutch-van-der-linde"] = "cyberpunk gang leader, long coat, hat, charismatic rebel"
M["sadie-adler"] = "cyberpunk gunslinger woman, leather outfit, rifle, fierce expression"
M["charles-smith"] = "cyberpunk warrior, war paint, muscular, rifle, stoic"
M["ellie"] = "cyberpunk survivor, short hair, switchblade, tattoo, determined"
M["joel"] = "cyberpunk survivor, weathered face, rifle, rugged outfit"
M["tommy"] = "cyberpunk survivor, muscular, rifle, calm stance"
M["abby"] = "cyberpunk warrior, muscular, blond hair, swimsuit wrap, powerful arms"
M["dina"] = "cyberpunk survivor, curly hair, kind expression, farm clothes"
M["solid-snake"] = "cyberpunk stealth operative, bandana, cardboard box, tactical gear"
M["big-boss"] = "cyberpunk legendary soldier, eyepatch, military gear, cigar"
M["liquid-snake"] = "cyberpunk soldier, arm tattoo, slicked hair, aggressive stance"
M["otacon"] = "cyberpunk hacker, glasses, tech gear, nervous expression"
M["meryl-silverburgh"] = "cyberpunk soldier, blonde hair, military vest, gun"
M["marcus-fenix"] = "cyberpunk gear soldier, armor, chainsaw bayonet, scarred"
M["dominic-santiago"] = "cyberpunk gear soldier, bald, muscular, chainsaw, loyal"
M["cole-train"] = "cyberpunk gear soldier, heavy armor, Minigun, bald head"
M["baird"] = "cyberpunk mechanic soldier, wrench, goatee, impatient"
M["paduk"] = "cyberpunk nomad soldier, weathered face, Locust scars, rebel"
M["aloy"] = "cyberpunk machine hunter, braids, Focus device, bow, tribal outfit"
M["sylens"] = "cyberpunk mysterious wanderer, Focus device, hood, staff, enigmatic"
M["varl"] = "cyberpunk warrior, Nordic features, paint marks, axe, determined"
M["beta"] = "cyberpunk machine hunter, red Focus, armor, spear, fierce"
M["nathan-drake"] = "cyberpunk treasure hunter, half-shirt, cargo pants, confident grin"
M["lara-croft"] = "cyberpunk explorer, ponytail, tank top, dual pistols, adventurous"
M["max-payne"] = "cyberpunk noir detective, leather jacket, guns, pained expression"
M["alan-wake"] = "cyberpunk thriller writer, flashlight, raincoat, haunted gaze"
M["jesse-faden"] = "cyberpunk director, long coat, service weapon, determined stance"
M["emily-kaldwin"] = "cyberpunk heir, elegant outfit, sword, regal presence"
M["corvo-attano"] = "cyberpunk bodyguard, mask, blade, dark coat, stealth"
M["chell"] = "cyberpunk test subject, orange jumpsuit, portal gun, silent"
M["wheatley"] = "cyberpunk AI, blue eye core, personality sphere, confused"
M["cave-johnson"] = "cyberpunk CEO, suit, confident pose, aperture science"
M["the-companion-cube"] = "cyberpunk weighted cube, heart mark, pink glow"

# === COMIC / DC ===
M["superman"] = "cyberpunk Kryptonian hero, blue suit, red cape, S shield, confident"
M["batman"] = "cyberpunk dark knight, black armor, bat cowl, cape, utility belt"
M["wonder-woman"] = "cyberpunk Amazon warrior, tiara, armor, lasso, powerful stance"
M["spider-man"] = "cyberpunk web-slinger, red and blue suit, mask, web shooters"
M["iron-man"] = "cyberpunk armored hero, red and gold suit, arc reactor, helmet"
M["captain-america"] = "cyberpunk super soldier, star shield, blue and red suit, shield pose"
M["hulk"] = "cyberpunk green titan, massive muscles, purple pants, rage aura"
M["black-widow"] = "cyberpunk spy, black bodysuit, red hair, guns, acrobatic pose"
M["hawkeye"] = "cyberpunk archer, purple outfit, bow, quiver, confident aim"
M["deadpool"] = "cyberpunk mercenary, red and black suit, katanas, twin pistols, smirking"
M["wolverine"] = "cyberpunk mutant, adamantium claws, yellow suit, mask, intense stare"
M["cyclops"] = "cyberpunk mutant leader, visor, blue suit, optic blast"
M["jean-grey"] = "cyberpunk telepath, red hair, green outfit, Phoenix energy glow"
M["storm"] = "cyberpunk weather goddess, white hair, lightning, dark clouds"
M["magneto"] = "cyberpunk master of magnetism, purple helmet, red cape, metal floating"
M["professor-x"] = "cyberpunk telepath leader, wheelchair, bald, Cerebro headset"
M["gambit"] = "cyberpunk mutant gambler, trench coat, staff cards, charged energy"
M["rogue"] = "cyberpunk mutant, black and white outfit, gloves, absorbing power"
M["nightcrawler"] = "cyberpunk teleporter, blue skin, yellow suit, tail, swords"
M["daredevil"] = "cyberpunk blind vigilante, red suit, billy clubs, radar sense"
M["punisher"] = "cyberpunk antihero, skull shirt, assault rifle, war vest"
M["elektra"] = "cyberpunk assassin, red outfit, sai blades, athletic pose"
M["ghost-rider"] = "cyberpunk flaming skeleton, leather jacket, skull fire, motorcycle"
M["blade"] = "cyberpunk vampire hunter, sunglasses, sword, leather coat"

# === MARVEL COSMIC ===
M["aquaman"] = "cyberpunk ocean king, trident, armor, underwater glow, powerful"
M["flash"] = "cyberpunk speedster, red suit, lightning bolt, speed trail, helmet"
M["green-lantern"] = "cyberpunk ring wielder, green energy constructs, black suit, mask"
M["green-arrow"] = "cyberpunk archer, green hood, bow and arrows, goatee"
M["black-canary"] = "cyberpunk sonic fighter, black leather outfit, martial arts pose"
M["shazam"] = "cyberpunk lightning hero, red suit, lightning bolt, cape"
M["black-adam"] = "cyberpunk dark hero, black lightning, Egyptian headdress, staff"
M["martian-manhunter"] = "cyberpunk green alien shapeshifter, red crystal, cape"
M["cyborg"] = "cyberpunk half-mechanical hero, robotic parts, red eye glow, tech armor"
M["beast-boy"] = "cyberpunk shapeshifter, green skin, animal ears, casual outfit"
M["harley-quinn"] = "cyberpunk chaotic jester, red and black, mallet, pigtails"
M["poison-ivy"] = "cyberpunk plant villain, red dress, green vines, seductive pose"
M["catwoman"] = "cyberpunk burglar, black catsuit, whip, mask, agile stance"
M["lex-luthor"] = "cyberpunk evil genius, bald, power suit, kryptonite ring"
M["brainiac"] = "cyberpunk cosmic collector, green skin, glowing skull, tentacles"
M["darkseid"] = "cyberpunk cosmic tyrant, grey skin, red eyes, omega beams"

# === DC GODS / NEW GODS ===
M["loki"] = "cyberpunk trickster god, green and gold outfit, horned helmet, staff"
M["thanos"] = "cyberpunk cosmic titan, purple skin, gold armor, infinity gauntlet"
M["doctor-strange"] = "cyberpunk sorcerer, red cloak, Eye of Agamotto, mystic runes"
M["scarlet-witch"] = "cyberpunk chaos witch, red outfit, hex energy, glowing hands"
M["vision"] = "cyberpunk synthetic hero, gold skin, Mind Stone, phasing power"
M["falcon"] = "cyberpunk aerial hero, red wings, EXO suit, confident stance"
M["winter-soldier"] = "cyberpunk enhanced soldier, metal arm, rifle, cold stare"
M["dormammu"] = "cyberpunk dark dimension lord, flaming head, cosmic power"
M["mephisto"] = "cyberpunk devil figure, dark fire, red skin, menacing grin"
M["galactus"] = "cyberpunk cosmic entity, purple armor, planet size, cosmic energy"
M["ego"] = "cyberpunk living planet, face projection, cosmic form"
M["eternity"] = "cyberpunk cosmic entity, star body, all-knowing gaze"

# === BLACK PANTHER / WAKANDA ===
M["t-challa"] = "cyberpunk king, vibranium suit, panther habit, mask"
M["shuri"] = "cyberpunk tech genius, purple outfit, Kimoyo beads, lab"
M["okoye"] = "cyberpunk warrior leader, bald, Dora uniform, spear"
M["nakia"] = "cyberpunk spy, tribal markings, stealth outfit, determined"
M["killmonger"] = "cyberpunk rival king, black suit, scarification, militant stance"

#=== GUARDIANS ===
M["peter-quill"] = "cyberpunk starlord, red leather jacket, helmet blasters, confident swagger"
M["gamora"] = "cyberpunk deadliest woman, green skin, sword, assassin pose"
M["drax"] = "cyberpunk warrior, red tattooed skin, muscular, dual knives, stoic"

# === HISTORICAL ===
M["jesus-christ"] = "cyberpunk spiritual figure, flowing robes, glowing hands, beard"
M["napoleon-bonaparte"] = "cyberpunk military emperor, bicorn hat, hand in coat, commanding"
M["frank-sinatra"] = "cyberpunk jazz legend, fedora, microphone, suit, cigarette"
M["david-bowie"] = "cyberpunk glam rock star, lightning bolt makeup, bold outfit"
M["marilyn-monroe"] = "cyberpunk Hollywood icon, white dress, platinum curls, red lips"
M["audrey-hepburn"] = "cyberpunk elegant actress, little black dress, updo, pearls"
M["charlie-chaplin"] = "cyberpunk silent comedian, bowler hat, toothbrush mustache, cane"

# === LITERARY ===
M["percy-jackson"] = "cyberpunk demigod, camp shirt, celestial bronze sword, determined"
M["holden-caulfield"] = "cyberpunk disillusioned teen, red hunting hat, sullen expression"
M["atticus-finch"] = "cyberpunk principled lawyer, suit, glasses, calm authority"
M["scarlett-o-hara"] = "cyberpunk southern belle, green dress, fierce determination"
M["jay-gatsby"] = "cyberpunk mysterious millionaire, gold suit, outstretched arms"
M["jane-eyre"] = "cyberpunk governess, plain dress, quiet resolve, steady gaze"
M["huckleberry-finn"] = "cyberpunk runaway, ragged clothes, wide-brim hat, free spirit"
M["ganda"] = "cyberpunk African warrior, tribal marks, staff, beads, proud stance"

# === MUSIC / CULTURE ===
M["muhammad"] = "cyberpunk boxing legend, robe, fist raised, determined eyes"
M["william-shakespeare"] = "cyberpunk bard, ruff collar, quill, velvet outfit"
M["abraham-lincoln"] = "cyberpunk president, top hat, beard, dignified pose"
M["george-washington"] = "cyberpunk founding father, military uniform, powdered wig"
M["aristotle"] = "cyberpunk philosopher, toga, scroll, beard, meditative pose"
M["alexander-the-great"] = "cyberpunk conqueror, golden armor, cape, commanding presence"
M["thomas-jefferson"] = "cyberpunk statesman, colonial outfit, quill, powdered wig"
M["henry-viii"] = "cyberpunk king, royal regalia, beard, commanding throne pose"
M["charles-darwin"] = "cyberpunk naturalist, Victorian coat, beard, specimen notebook"
M["queen-elizabeth"] = "cyberpunk queen crown, ornate gown, regal pose, pale complexion"
M["elizabeth-i"] = "cyberpunk Tudor queen, white makeup, ornate gown, commanding presence"
M["augustus-caesar"] = "cyberpunk Roman emperor, purple toga, laurel crown, commanding"
M["julius-caesar"] = "cyberpunk Roman dictator, toga, laurel crown, commanding stance"
M["cleopatra"] = "cyberpunk Egyptian queen, golden headdress, regal attire, dark kohl eyes"
M["boudica"] = "cyberpunk warrior queen, wild red hair, war paint, spear, fierce stance"
M["king-arthur"] = "cyberpunk legendary king, armor, Excalibur, shield, noble bearing"
M["wu-zetian"] = "cyberpunk empress, imperial robes, commanding gaze, ornate headdress"
M["alfred-the-great"] = "cyberpunk king, crown, medieval armor, scroll, wise expression"
M["aethelflaed"] = "cyberpunk war leader, Anglo-Saxon armor, sword, determined gaze"
M["hatshepsut"] = "cyberpunk female pharaoh, pharaonic headdress, royal regalia"
M["amenhotep-iii"] = "cyberpunk Egyptian pharaoh, nemes headdress, gold collar"
M["ashoka"] = "cyberpunk emperor, Mauryan armor, lion symbol, peaceful authority"
M["genghis-khan"] = "cyberpunk Mongol conqueror, fur-lined armor, horsehair helmet"
M["miyamoto-musashi"] = "cyberpunk samurai swordsman, dual blades, headband, focused"
M["sun-tzu"] = "cyberpunk military strategist, ancient armor, scroll, wise eyes"
M["confucius"] = "cyberpunk ancient philosopher, robes, long beard, scroll, peaceful aura"
M["buddha"] = "cyberpunk enlightened one, golden robes, lotus position, serene glow"
M["jesus"] = "cyberpunk spiritual figure, simple robes, gentle expression, glowing aura"
M["martin-luther"] = "cyberpunk reformer, dark robes, defiant posture, document in hand"
M["martin-luther-king-jr-"] = "cyberpunk civil rights leader, suit, microphone, determined gaze"
M["nelson-mandela"] = "cyberpunk liberation leader, patterned shirt, raised fist, dignified"
M["mahatma-gandhi"] = "cyberpunk peaceful leader, simple white clothes, glasses, spinning wheel"
M["winston-churchill"] = "cyberpunk wartime leader, cigar, suit, V-sign, resolute gaze"
M["queen-victoria"] = "cyberpunk Victorian queen, crown, black mourning dress, regal"
M["catherine-the-great"] = "cyberpunk empress, ornate gown, crown jewels, commanding presence"
M["joan-of-arc"] = "cyberpunk warrior saint, armor, banner, sword, divine fire aura"
M["william-wallace"] = "cyberpunk Scottish rebel, war paint, claymore, wild hair, fierce"
M["robin-hood"] = "cyberpunk outlaw archer, green hood, bow, quiver, forest stealth"
M["isaac-newton"] = "cyberpunk scientist, wig, prism, apple, scholarly robes"
M["albert-einstein"] = "cyberpunk genius physicist, wild hair, lab coat, chalkboard equations"
M["nikola-tesla"] = "cyberpunk inventor, lightning coils, lab coat, blueprints, intense gaze"
M["marie-curie"] = "cyberpunk scientist, Victorian lab coat, vials, focused concentration"
M["galileo-galilei"] = "cyberpunk astronomer, telescope, Renaissance coat, defiant stance"
M["louis-pasteur"] = "cyberpunk microbiologist, lab coat, flask, beard, intense eyes"
M["thomas-edison"] = "cyberpunk inventor, lab coat, lightbulb, goggles, workshop"
M["alexander-graham-bell"] = "cyberpunk inventor, telephone prototype, Victorian suit, beard"
M["leonardo-da-vinci"] = "cyberpunk polymath, Renaissance attire, sketchbook, flying machine"
M["michelangelo"] = "cyberpunk sculptor, beret, brush, palette, chisel, intense focus"
M["raphael"] = "cyberpunk painter, Renaissance robes, brush, easel, calm smile"
M["donatello"] = "cyberpunk sculptor, Renaissance outfit, chisel, stone block, focused"
M["botticelli"] = "cyberpunk painter, flowing robes, brush, canvas, serene expression"
M["van-gogh"] = "cyberpunk post-impressionist, bandaged ear, paintbrush, textured outfit"
M["pablo-picasso"] = "cyberpunk cubist artist, beret, paintbrush, abstract canvas"
M["claude-monet"] = "cyberpunk impressionist, beret, palette, soft lighting, garden backdrop"
M["rembrandt"] = "cyberpunk old master, dark coat, beret, dramatic chiaroscuro"
M["frida-kahlo"] = "cyberpunk surrealist, floral crown, unibrow, traditional dress, bold"
M["georgia-o-keeffe"] = "cyberpunk modernist painter, desert tones, bold flowers, calm pose"
M["jackson-pollock"] = "cyberpunk abstract expressionist, paint splatter, intense focus"
M["mark-rothko"] = "cyberpunk color field painter, contemplative, bold color blocks"
M["wolfgang-amadeus-mozart"] = "cyberpunk composer, powdered wig, harpsichord, ornate coat"
M["ludwig-van-beethoven"] = "cyberpunk composer, wild hair, piano, intense expression, baton"
M["johann-sebastian-bach"] = "cyberpunk baroque composer, wig, organ, sheet music, focused"
M["fr-d-ric-chopin"] = "cyberpunk romantic composer, piano, elegant coat, delicate hands"
M["pyotr-ilyich-tchaikovsky"] = "cyberpunk classical composer, conductor baton, formal attire"
M["igor-stravinsky"] = "cyberpunk modern composer, bold stance, baton, avant-garde coat"
M["john-lennon"] = "cyberpunk rock icon, round glasses, guitar, peace sign, round haircut"
M["bob-dylan"] = "cyberpunk folk legend, harmonica, acoustic guitar, hat, poetic gaze"
M["michael-jackson"] = "cyberpop icon, sparkly glove, fedora, moonwalk pose, sequined jacket"
M["elvis-presley"] = "cyberpunk rock legend, pompadour, leather jacket, microphone, confident grin"

# === FANTASY RPG / D&D ===
M["wizard"] = "cyberpunk archmage, flowing robes, glowing staff, spell tome, arcane runes"
M["sorcerer"] = "cyberpunk blood mage, crimson energy, ritual scars, glowing eyes"
M["warlock"] = "cyberpunk pact mage, dark patron sigil, eldritch energy, brooding gaze"
M["cleric"] = "cyberpunk divine caster, holy symbol, radiant energy, armor, prayer beads"
M["rogue"] = "cyberpunk shadow thief, daggers, leather armor, mask, stealth pose"
M["paladin"] = "cyberpunk holy knight, shining armor, divine sword, holy aura"
M["ranger"] = "cyberpunk beast tamer, bow, animal companion, forest cloak, quiver"
M["barbarian"] = "cyberpunk berserker, massive axe, tribal tattoos, furs, battle rage"
M["druid"] = "cyberpunk nature shaper, vines, animal form, wooden staff, leaves"
M["monk"] = "cyberpunk martial artist, prayer beads, serene stance, flowing robes"
M["berserker"] = "cyberpunk rage warrior, dual axes, war paint, fur cloak, furious"

# === MYTHOLOGY ===
M["vampire"] = "cyberpunk vampire, pale skin, fangs, dark cape, crimson eyes, Gothic"
M["demon"] = "cyberpunk demon horns, dark energy, red glowing eyes, hellfire aura"
M["angel"] = "cyberpunk divine wings, golden light, white robes, serene radiant"
M["undead"] = "cyberpunk decaying features, ghostly mist, pale skin, empty eyes"
M["werewolf"] = "cyberpunk lycanthrope transformation, moonlight, claws, fur"
M["witch"] = "cyberpunk sorceress, pointed hat, cauldron, potion bottles, spell book"

# === OTHER ===
M["ninja"] = "cyberpunk shadow assassin, black outfit, katana, shuriken, stealth"
M["samurai"] = "cyberpunk warrior, katana, traditional armor, cherry blossoms"
M["pirate"] = "cyberpunk buccaneer, eye patch, cutlass, nautical gear"
M["spy"] = "cyberpunk secret agent, trench coat, gadgets, dossier, sunglasses"
M["thief"] = "cyberpunk burglar, black mask, lockpicks, shadowy stance"
M["detective"] = "cyberpunk gumshoe, trench coat, magnifying glass, noir lighting"
M["soldier"] = "cyberpunk trooper, military armor, rifle, combat stance"
M["queen"] = "cyberpunk monarch, crown, royal gown, commanding throne pose"
M["knight"] = "cyberpunk armored knight, sword, shield, chivalric stance"
M["archer"] = "cyberpunk marksman, bow, quiver, forest camouflage, precise aim"
M["gunslinger"] = "cyberpunk western shooter, dual pistols, hat, quick draw pose"
M["priest"] = "cyberpunk holy servant, robes, staff, glowing sacred symbol"
M["alchemist"] = "cyberpunk potion master, bubbling flask, transmutation circle"
M["chef"] = "cyberpunk master chef, white coat, knives, plated dish, precision"
M["artist"] = "cyberpunk painter, beret, palette, brushstrokes, creative studio"
M["musician"] = "cyberpunk rock star, guitar, stage lights, concert energy"
M["dancer"] = "cyberpunk performer, flowing costume, spotlight, dynamic pose"
M["pilot"] = "cyberpunk ace pilot, aviator goggles, flight jacket, cockpit"
M["engineer"] = "cyberpunk builder, blueprints, welding mask, mechanical parts"
M["farmer"] = "cyberpunk rural worker, straw hat, overalls, rustic tech"
M["teacher"] = "cyberpunk educator, glasses, chalkboard, scholarly robes"
M["student"] = "cyberpunk learner, uniform, backpack, classroom background"
M["prince"] = "cyberpunk royal heir, crown, regal attire, confident pose"
M["princess"] = "cyberpunk royal lady, tiara, elegant gown, castle backdrop"
M["slave"] = "cyberpunk chained captive, broken chains, defiant stance"
M["pirate-queen"] = "cyberpunk buccaneer queen, tricorn, elegant yet fierce, command"
M["undertaker"] = "cyberpunk funeral director, black suit, somber, serious gaze"
M["doctor"] = "cyberpunk physician, white coat, stethoscope, medical tech"
M["nurse"] = "cyberpunk medical nurse, caring expression, hospital tech"


def build_prompt(name, creature, category, tags, pid):
    if pid in M:
        return f"a {name}, {M[pid]}, {SUFFIX}"

    # Fallback por creature type
    creature_lower = creature.lower()
    if "ai / " in creature_lower:
        role = creature_lower.replace("ai / ", "cyberpunk ")
    elif creature == "Anime Character":
        role = "cyberpunk anime character, vibrant hair"
    elif creature == "Comic Book Character":
        role = "cyberpunk comic book hero, bold colors"
    elif creature == "Historical Figure":
        role = "cyberpunk historical figure, period attire"
    elif creature == "Human":
        role = "cyberpunk human portrait"
    elif creature == "Spartan (Human)":
        role = "cyberpunk spartan warrior, bronze armor"
    elif creature == "Video Game Character":
        role = "cyberpunk video game character, stylized design"
    else:
        role = f"cyberpunk {creature.lower()}"

    return f"a {name}, {role}, {SUFFIX}"


with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts_backup.json') as f:
    prompts = json.load(f)

for p in prompts:
    pid = p['id']
    p['prompt'] = build_prompt(p['name'], p['creature'], p['category'], p['tags'], pid)

print(f"Total: {len(prompts)}")
lengths = [len(p['prompt']) for p in prompts]
print(f"Comprimento médio: {sum(lengths)//len(prompts)} chars")
print(f"Mín: {min(lengths)}, Máx: {max(lengths)}")

bad = [p for p in prompts if 'clawsouls' in p['prompt'].lower()]
print(f"Com 'ClawSouls': {len(bad)}")

covered = sum(1 for p in prompts if p['id'] in M)
print(f"Cobertos por mapa: {covered}/{len(prompts)}")
uncovered = [p['id'] for p in prompts if p['id'] not in M]
if uncovered:
    print(f"Não cobertos: {uncovered}")

# Samples
print("\n=== Amostras ===")
for pid in ["j4ck", "d0c", "glados", "zen", "doctor-strange", "sherlock", "thor",
            "spider-man", "superman", "naruto-uzumaki", "saitama", "harry-potter"]:
    for p in prompts:
        if p['id'] == pid:
            print(f"\n[{p['id']}] {p['name']}")
            print(f"  {p['prompt'][:200]}")
            break

import shutil
shutil.copy2('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json',
             '/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts_v5_backup.json')

with open('/home/ubuntu/clawsouls/clawsouls_cyberpunk_prompts.json', 'w') as f:
    json.dump(prompts, f, indent=2, ensure_ascii=False)

print("\n\n✅ Arquivo salvo!")