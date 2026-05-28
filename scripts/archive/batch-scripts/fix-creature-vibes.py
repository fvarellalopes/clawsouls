#!/usr/bin/env python3
"""Update creature vibes in presets.ts with rich narrative descriptions."""

import re
import os

PRESETS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'presets.ts')

# Map of creature name (as used in the file) -> new vibe
# Names with "(X)" suffix are disambiguated; the actual file uses just the base name.
NEW_VIBES = {
    "Goblin": "A mischievous creature of European folklore \u2014 small, green-skinned, with pointed ears and an insatiable greed for gold. Goblins lurk in dark places, forge cursed weapons, and cause trouble for anyone foolish enough to cross their path. Cunning, greedy, and endlessly resourceful.",
    "Troll": "A brutish giant of Norse mythology \u2014 rocky skin, long nose, and a dim wit that is matched only by their immense strength. Trolls lurk under bridges and in mountain caves, turning to stone in sunlight. Dangerous, territorial, and not terribly bright.",
    "Fairy": "A tiny winged humanoid of European folklore \u2014 gossamer wings, magical dust, and a mischievous sparkle in their eye. Fairies grant wishes, steal children, and dance in moonlit circles. Beautiful and dangerous in equal measure. Never trust a fairy gift.",
    "Pixie": "A small winged trickster of Celtic folklore \u2014 pointed ears, playful grin, and a love of leading travelers astray. Pixies dance in circles, tangle horse manes, and hide your keys for fun. Mischievous but rarely malicious. Dartmoor\\'s tiny anarchists.",
    "Gnome": "A small bearded guardian of European folklore \u2014 pointed red hat, earth-stained clothes, and a deep connection to the soil. Gnomes protect gardens, tend to animals, and hoard underground treasures. Silent, wise, and older than the hills they inhabit.",
    "Centaur": "A half-human, half-horse warrior of Greek mythology \u2014 muscular torso atop a powerful equine body. Centaurs are wild, untamed, and torn between civilization and savagery. Some are scholars, most are fighters. Chiron was the wise one; the rest just like to party.",
    "Satyr": "A half-human, half-goat hedonist of Greek mythology \u2014 horns, goat legs, pan pipes, and an appetite for wine and revelry. Satyrs dance through forests, chase nymphs, and worship Dionysus. Pleasure is their purpose, chaos is their gift.",
    "Minotaur": "A bull-headed humanoid of Greek mythology \u2014 massive, muscular, and imprisoned in the Labyrinth of Crete. The Minotaur feeds on human sacrifices until Theseus ends its reign. A monster born of divine punishment, trapped in a maze of its own existence.",
    "Harpy": "A bird-woman hybrid of Greek mythology \u2014 eagle wings, sharp talons, wild hair, and a screech that curdles blood. Harpies steal food, curse the wicked, and serve as Zeus\\'s instruments of punishment. Beautiful from afar, terrifying up close.",
    "Griffin": "A lion-bodied, eagle-headed guardian of Greek mythology \u2014 majestic wings, razor talons, and a regal bearing that commands respect. Griffins guard treasure hoards and sacred sites. Half eagle, half lion, all power. The king of all creatures.",
    "Gorgon": "A woman with snakes for hair from Greek mythology \u2014 whose gaze turns the living to stone. The Gorgon\\'s face is a weapon, her serpentine locks a crown of horror. Medusa was the most famous, but all three sisters were deadly.",
    "Medusa": "The most famous Gorgon of Greek mythology \u2014 once a beautiful maiden, cursed by Athena into a monster with snake hair and a petrifying gaze. Slain by Perseus, her head became a weapon. Beauty turned to horror, victim turned to villain.",
    "Vampire": "An undead bloodsucker of European folklore \u2014 pale skin, fangs, red eyes, and an elegant darkness that hides centuries of predation. Vampires sleep in coffins, fear sunlight, and seduce their prey. Immortality has its price, and it\\'s paid in blood.",
    "Werewolf": "A wolf-human hybrid of European folklore \u2014 fur, claws, fangs, and a transformation triggered by the full moon. By day, human. By night, a beast. The curse passes through bites and bloodlines. Silver is the only cure, and the moon never stops rising.",
    "Ghost": "A translucent apparition of universal folklore \u2014 floating, ethereal, and tethered to the world of the living by unfinished business. Ghosts haunt houses, rattle chains, and whisper secrets from beyond the veil. The dead who refuse to leave.",
    "Banshee": "A wailing spirit of Irish folklore \u2014 long pale hair, grey cloak, and a keening cry that foretells death. The banshee does not kill; she warns. When she screams, someone in the family will die. A messenger of grief, not a cause of it.",
    "Wraith": "A dark shadowy spirit of Celtic folklore \u2014 hooded, glowing eyes, and a spectral form that barely touches the physical world. Wraiths are the restless dead, bound by rage or sorrow. They drift through cold places, draining warmth and hope.",
    "Dragon": "A massive winged reptile of European folklore \u2014 scales like armor, fire breath, horns, and a tail that can topple castles. Dragons hoard gold, terrorize kingdoms, and speak with ancient intelligence. The ultimate predator, ancient and terrifying.",
    "Wyvern": "A two-legged dragon of European folklore \u2014 wings, barbed tail, scales, and a serpentine grace that distinguishes it from true dragons. Wyverns are faster, more aggressive, and less intelligent. Pure aerial predator with venom in its sting.",
    "Basilisk": "The serpent king of European folklore \u2014 deadly gaze, crown-like crest, and venom that poisons the very air. The basilisk kills with a look and is born from a rooster\\'s egg hatched by a serpent. Only a weasel or its own reflection can defeat it.",
    "Hydra": "A multi-headed serpent of Greek mythology \u2014 cut one head and two grow back. The Lernaean Hydra was slain by Heracles as one of his twelve labors. Poisonous blood, regenerating heads, and a body that refuses to die. The monster that multiplies.",
    "Unicorn": "A horse with a single spiral horn from European folklore \u2014 white coat, pure heart, and magical healing properties. Unicorns can only be tamed by virgins and their horns neutralize poison. Symbol of purity, grace, and the untamable.",
    "Pegasus": "A winged horse of Greek mythology \u2014 white coat, majestic wings, and divine origin (born from Medusa\\'s blood). Pegasus carried Bellerophon to slay the Chimera and eventually became a constellation. The sky\\'s most noble steed.",
    "Mermaid": "A half-woman, half-fish creature of global folklore \u2014 seashell top, flowing fish tail, and an enchanting voice that lures sailors to their doom. Mermaids are beautiful, mysterious, and deeply dangerous. The sea\\'s most beautiful predators.",
    "Siren": "A winged femme fatale of Greek mythology \u2014 enchanting song that lures sailors to crash upon the rocks. Unlike mermaids, sirens were originally bird-women. Their music is irresistible and their intent is deadly. Silence is survival.",
    "Kraken": "A giant sea monster of Scandinavian folklore \u2014 massive tentacles, deep ocean dwelling, and the power to drag entire ships beneath the waves. Sailors\\' worst nightmare, the Kraken surfaces only to feed. The ocean\\'s apex predator.",
    "Kelpie": "A water horse of Scottish folklore \u2014 dark mane, aquatic body, and a lure that draws riders onto its back before dragging them underwater. Kelpies shape-shift into beautiful horses or humans. Never trust a horse near the loch.",
    "Leprechaun": "A small bearded man of Irish folklore \u2014 green suit, pot of gold, and a shoemaker\\'s craft. Leprechauns grant three wishes if caught, but they\\'re impossible to catch. Mischievous, wealthy, and perpetually elusive. The luck of the Irish, personified.",
    "Chimera": "A fire-breathing hybrid of Greek mythology \u2014 lion head, goat body, and serpent tail. The Chimera terrorized Lycia until Bellerophon slew it riding Pegasus. A monster of impossible anatomy, divine origin, and pure destructive chaos.",
    "Cerberus": "The three-headed dog of Greek mythology \u2014 guardian of the underworld, hellhound of Hades, and the final barrier between the living and the dead. Each head sees a different direction. Only Orpheus\\'s music and Heracles\\'s strength could subdue it.",
    "Sphinx": "A lion-bodied, human-headed riddler of Greek mythology \u2014 wings, claws, and a lethal intellect. The Sphinx guarded Thebes and devoured anyone who could not answer her riddle. Oedipus solved it. Everyone else died. Wisdom or death.",
    "Phoenix": "An immortal fire bird of Greek and Egyptian mythology \u2014 red and gold flames, rebirth from its own ashes, and a cry that moves the gods. The Phoenix lives for 500 years, burns, and rises again. Symbol of eternal renewal and hope.",
    "Djinn": "A smokeless fire being of Arabian folklore \u2014 lamp-dwelling, wish-granting, and dangerously mischievous. Djinn are neither good nor evil; they are amoral tricksters with cosmic power. Be careful what you wish for. Three wishes, infinite consequences.",
    "Genie": "A wish-granting spirit of Arabian folklore \u2014 bound to a lamp, a ring, or a vessel, granting three wishes to whoever frees them. Genies are powerful, playful, and masters of malicious compliance. Your wish is their command, literally.",
    "Dwarf": "A short, sturdy humanoid of Norse and Germanic mythology \u2014 long beard, axe, and a master smith\\'s hands. Dwarves forge legendary weapons (Mjolnir!), hoard gold in mountain halls, and drink mead by the barrel. Stubborn, skilled, and unbreakable.",
    "Elf": "A tall, elegant humanoid of Norse and Germanic mythology \u2014 pointed ears, ethereal beauty, and an otherworldly grace. Elves are immortal, magical, and slightly condescending toward mortals. They dance in moonlight and age like fine wine.",
    "Orc": "A brutish humanoid of Tolkien\\'s fantasy folklore \u2014 green skin, tusks, muscular build, and tribal scars. Orcs are warriors born, forged in darkness and tempered by conflict. Strength is their law, battle is their language, and weakness is unforgivable.",
    "Valkyrie": "A winged warrior maiden of Norse mythology \u2014 armor, spear, shield, and the divine duty of choosing who lives and dies in battle. Valkyries carry the slain to Valhalla, where heroes feast until Ragnarok. Choosers of the slain, daughters of Odin.",
    "Kappa": "A water imp of Japanese folklore \u2014 turtle shell, beak, bowl-shaped head filled with water, and a mischievous nature. Kappa drag swimmers underwater and challenge sumo wrestlers. Polite to a fault \u2014 bow to a kappa and it bows back, spilling its power.",
    "Oni": "A demon ogre of Japanese folklore \u2014 horns, red or blue skin, iron club, and a terrifying grin. Oni punish the wicked in hell, throw disease at villages, and wear tiger-skin loincloths. Japan\\'s version of the devil, complete with a fearsome reputation.",
    "Oni Mask": "A demon mask of Japanese folklore \u2014 fierce grin, horns, red or blue face, and worn during Setsubun to ward off evil. The Oni mask embodies fear itself \u2014 worn to drive away what it represents. Horror made decorative.",
    "Kasa-obake": "An umbrella ghost of Japanese folklore \u2014 one eye, one leg, and a cheerful hopping existence. Old umbrellas that survive a hundred years become Kasa-obake. Mischievous rather than dangerous, they surprise you in the rain.",
    "Tsukumogami": "An animated object spirit of Japanese folklore \u2014 household items that come alive after a hundred years. Forgotten umbrellas, worn-out sandals, and neglected tools that demand respect. Care for your possessions, or they will haunt you.",
    "Tanuki": "A raccoon dog of Japanese folklore \u2014 shapeshifter, large belly, and a jovial trickster spirit. Tanuki drum their bellies, transform into anything, and cause delightful chaos. The tanuki statue outside Japanese shops? That\\'s him, with his lucky scrotum.",
    "Yuki-onna": "A snow woman of Japanese folklore \u2014 pale white skin, long black hair, and a beauty that freezes the soul. Yuki-onna appears in blizzards, kisses travelers to death, and melts into mist. Cold, beautiful, and absolutely lethal.",
    "Fenghuang": "An immortal bird of Chinese mythology \u2014 colorful plumage, graceful flight, and a symbol of harmony and virtue. The Fenghuang is the Chinese phoenix, appearing only in times of peace. Where it lands, prosperity follows.",
    "Roc": "A giant bird of prey of Arabian folklore \u2014 enormous wings, carries elephants, and nests in mountains. Sinbad barely survived one. The Roc is mythology\\'s answer to the question: what if an eagle was the size of a building?",
    "Long": "A serpentine dragon of Chinese mythology \u2014 antlers, claws, pearl of wisdom, and divine authority. The Long controls rain, rivers, and seas. Unlike European dragons, Chinese dragons are benevolent symbols of power, strength, and good fortune.",
    "Dragon Turtle": "A turtle-bodied, dragon-headed creature of Chinese mythology \u2014 longevity, wisdom, and the patience of mountains. Dragon turtles carry the world on their backs and symbolize endurance. Slow, ancient, and unmovable.",
    "Huli Jing": "A nine-tailed fox spirit of Chinese folklore \u2014 seductive, shapeshifting, and dangerously intelligent. Huli Jing take human form, seduce scholars and emperors, and steal life force through passion. Beautiful, cunning, and rarely benevolent.",
    "Qilin": "A chimeric hooved creature of Chinese mythology \u2014 scales, flame aura, and an omen of prosperity. The Qilin appears only when a wise ruler is near or a great sage is born. It harms nothing, not even the grass beneath its feet. Pure good fortune.",
    "Saci": "A one-legged boy of Brazilian folklore \u2014 red cap, smoking pipe, and a whirlwind of mischief. Saci steals food, hides tools, and rides dust devils for fun. Catch his cap and he grants a wish. Brazil\\'s most beloved trickster spirit.",
    "Curupira": "A forest guardian of Brazilian folklore \u2014 backward feet, bright red hair, and a whistle that confuses hunters. Curupira protects the jungle from those who harm it, leading trespassers in circles until they go mad. The Amazon\\'s fierce protector.",
    "Boitata": "A fire serpent of Brazilian folklore \u2014 fiery eyes that see through the darkness, and a body of flame that slithers through flooded fields. Boitata guards the night and devours the eyes of the dead. The snake that swallowed the sun.",
    "Cuca": "An alligator-headed witch of Brazilian folklore \u2014 sleeps, kidnaps naughty children, and brews nightmares in her swamp. Cuca is the bogeywoman of Brazilian childhood, the monster under the bed that mothers invoke to make children behave.",
    "Lobisomem": "A werewolf of Brazilian folklore \u2014 wolf-human hybrid, cursed by moonlight, and doomed to transform on the eighth son\\'s eighth full moon. The Brazilian werewolf is a Catholic curse, not a pagan one. Confession breaks the spell, but the scars remain.",
    "Mula sem Cabeca": "A headless mule of Brazilian folklore \u2014 fire erupting from its neck, galloping through the night with supernatural speed. A woman cursed by the church for her sins, doomed to run as a headless horse forever. Brazil\\'s most terrifying night rider.",
    "Iara": "A water goddess of Brazilian folklore \u2014 long dark hair, enchanting song, and a beauty that lures fishermen to their watery graves. Iara is the mermaid of the Amazon, the siren of the rivers. Her voice is the last thing you hear before the current takes you.",
    "Mapinguari": "A giant hairy beast of Brazilian folklore \u2014 one eye, backwards feet, and a scream that freezes the blood. The Mapinguari is the Amazon\\'s Bigfoot, a sloth-like giant that protects the forest. Scientists think it might be a surviving ground sloth.",
    "Thunderbird": "A giant bird of Native American folklore \u2014 wings that create thunder, eyes that flash lightning, and a spirit of raw elemental power. The Thunderbird commands storms, battles serpents, and represents the sky\\'s fury. When it flies, the world trembles.",
    "Wendigo": "An emaciated humanoid of Algonquian folklore \u2014 deer skull head, frost-covered body, and an insatiable hunger for human flesh. The Wendigo is born from cannibalism in the frozen north. It grows larger with every meal, forever hungry, forever cold.",
    "Yeti": "A large ape-like creature of Himalayan folklore \u2014 white fur, mountain dweller, and the abominable snowman of legend. The Yeti roams above the snowline, leaving enormous footprints. Myth or missing link, the mountain keeps its secrets.",
    # Entries with names that differ from the task's display name:
    "Djinn / Genie": "A smokeless fire being of Arabian folklore \u2014 lamp-dwelling, wish-granting, and dangerously mischievous. Djinn are neither good nor evil; they are amoral tricksters with cosmic power. Be careful what you wish for. Three wishes, infinite consequences.",
    "Long (Chinese Dragon)": "A serpentine dragon of Chinese mythology \u2014 antlers, claws, pearl of wisdom, and divine authority. The Long controls rain, rivers, and seas. Unlike European dragons, Chinese dragons are benevolent symbols of power, strength, and good fortune.",
    "Boitat\u00e1": "A fire serpent of Brazilian folklore \u2014 fiery eyes that see through the darkness, and a body of flame that slithers through flooded fields. Boitata guards the night and devours the eyes of the dead. The snake that swallowed the sun.",
    "Mula sem Cabe\u00e7a": "A headless mule of Brazilian folklore \u2014 fire erupting from its neck, galloping through the night with supernatural speed. A woman cursed by the church for her sins, doomed to run as a headless horse forever. Brazil\\'s most terrifying night rider.",
}

# Disambiguated names that map differently in the file
# "Kraken (Scandinavian)" and "Ghost (universal)" are just "Kraken" and "Ghost" in the file
# We already have those in NEW_VIBES above with the richer versions.
# But the task provides *separate* entries for the disambiguated ones.
# Let's use the disambiguated versions' vibes since they're slightly different:
# Kraken (Scandinavian) vibe vs Kraken vibe - let me check...
# The task gives both "Kraken" and "Kraken (Scandinavian)" with different vibes.
# The file only has ONE Kraken entry. So we need to pick ONE vibe.
# Looking at the task carefully:
# - Kraken: "A giant sea monster of Scandinavian folklore — massive tentacles, deep ocean dwelling..."
# - Kraken (Scandinavian): "A giant sea monster of Scandinavian folklore — massive tentacles that drag ships to the deep..."
# Similarly:
# - Ghost: "A translucent apparition of universal folklore — floating, ethereal..."
# - Ghost (universal): "A translucent apparition of universal folklore — floating, ethereal white..."
# 
# The file only has one 'Kraken' and one 'Ghost'. We'll use the PRIMARY (non-disambiguated) vibe for each.
# These are already in NEW_VIBES dict above.


def main():
    with open(PRESETS_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    updated = 0
    not_found = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Match lines like:     name: 'Goblin',
        m = re.match(r"^(\s*name:\s*)'([^']*)'(,)\s*$", line)
        if m:
            creature_name = m.group(2)
            if creature_name in NEW_VIBES:
                # Look for the next vibe line
                j = i + 1
                while j < len(lines):
                    vm = re.match(r"^(\s*vibe:\s*)'(.*)'(,)\s*$", lines[j])
                    if vm:
                        new_vibe = NEW_VIBES[creature_name]
                        lines[j] = f"{vm.group(1)}'{new_vibe}'{vm.group(3)}\n"
                        updated += 1
                        print(f"  Updated: {creature_name} (line {j+1})")
                        break
                    # Stop if we hit the next name field (shouldn't happen, but safety)
                    if re.match(r"^\s*name:\s*'", lines[j]):
                        break
                    j += 1
                else:
                    not_found.append(creature_name)
        i += 1

    with open(PRESETS_PATH, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    print(f"\nDone! Updated {updated}/{len(NEW_VIBES)} creature vibes.")
    if not_found:
        print(f"Could not find vibe line for: {not_found}")


if __name__ == '__main__':
    main()
