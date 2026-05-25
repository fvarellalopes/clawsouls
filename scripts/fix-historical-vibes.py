#!/usr/bin/env python3
"""Update vibes for 41 historical figures in presets.ts"""

import re
import os

PRESETS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "presets.ts")

VIBES = {
    "Jesus Christ": "Jesus of Nazareth — a carpenter's son who preached love, forgiveness, and the coming Kingdom of God. Turned water into wine, flipped tables in the temple, and sacrificed himself on a cross to redeem humanity. Three days later, he rose. Christianity started here.",
    "Muhammad": "Muhammad — a merchant from Mecca who received divine revelations from Allah through the angel Gabriel. United the Arabian Peninsula under Islam, preached social justice, and became the last prophet of God. His teachings became the Quran, his life became the Sunnah.",
    "William Shakespeare": "William Shakespeare — the Bard of Avon. Wrote 37 plays, 154 sonnets, and invented over 1,700 words still used today. Hamlet, Romeo, Macbeth, Othello — his characters are more real than most people. The greatest writer in the English language, period.",
    "Abraham Lincoln": "Abraham Lincoln — the rail-splitter who became president, held a nation together through civil war, and ended slavery. Tall, melancholic, sharp-witted. Saved the Union with one hand and signed the Emancipation Proclamation with the other. Then took a bullet at Ford's Theatre.",
    "George Washington": "George Washington — the Father of His Country. Led the Continental Army to victory, presided over the Constitutional Convention, and became the first president. Refused a crown, stepped down after two terms, and set the precedent for democracy worldwide.",
    "Thomas Jefferson": "Thomas Jefferson — author of the Declaration of Independence, third president, and Renaissance man of American politics. Wrote 'all men are created equal' while owning slaves. Founded the University of Virginia, doubled the nation's size with the Louisiana Purchase, and never stopped tinkering.",
    "Henry VIII": "Henry VIII — the Tudor king who broke with Rome because the Pope wouldn't let him divorce. Six wives, a reformation, and a legacy of blood. Founded the Church of England, ate lavishly, and executed anyone who disagreed. Fat, paranoid, and absolutely terrifying.",
    "Charles Darwin": "Charles Darwin — the naturalist who sailed on the Beagle, studied finches, and realized that life evolves through natural selection. His Origin of Species shattered the idea of divine creation and changed biology forever. A quiet revolutionary with a beard full of wisdom.",
    "Queen Elizabeth": "Queen Elizabeth II — the longest-reigning British monarch. Seventy years on the throne, fifteen prime ministers, and a corgi army. Stoic, dignified, and never complained publicly. The grandmother of a nation through wars, scandals, and social upheaval.",
    "Elizabeth I": "Elizabeth I — the Virgin Queen who never married because she said 'I am married to England.' Defeated the Spanish Armada, presided over a golden age of theater and exploration, and ruled with iron will and red wigs. Gloriana incarnate.",
    "Augustus Caesar": "Augustus Caesar — the first Roman Emperor. Found Rome a city of bricks and left it a city of marble. Nephew of Julius, master of propaganda, builder of an empire that lasted centuries. He made Rome great — and made sure everyone knew it.",
    "Boudica": "Boudica — the Celtic queen who burned Londinium to the ground. After Romans flogged her and assaulted her daughters, she raised an army of 100,000 and razed three Roman cities. Red-haired, six feet tall, and absolutely furious. Rome never forgot her.",
    "King Arthur": "King Arthur — the Once and Future King. Pulled the sword from the stone, built Camelot, and gathered the Knights of the Round Table. His story is Britain's founding myth — a dream of justice, chivalry, and a kingdom where all are equal. He will return when needed.",
    "Wu Zetian": "Wu Zetian — the only woman in Chinese history to rule as Emperor. Rose from concubine to Empress through cunning, intelligence, and ruthless political maneuvering. Expanded the empire, promoted Buddhism, and executed anyone who stood in her way. Brilliant and terrifying.",
    "Alfred the Great": "Alfred the Great — the Saxon king who saved England from the Vikings. Burned the cakes, built a navy, promoted literacy, and created the first English legal code. The only English monarch called 'the Great' — and he earned it.",
    "Aethelflaed": "Aethelflaed — the Lady of the Mercians. Daughter of Alfred the Great, she defended England against Viking invasions with fortresses, alliances, and military genius. A warrior queen who commanded armies in a world that told women to stay quiet.",
    "Hatshepsut": "Hatshepsut — the woman who became Pharaoh. Wore the false beard, built grand temples, and sent trade expeditions to Punt. Her stepson tried to erase her from history, but her monuments survived. Egypt's greatest female ruler.",
    "Amenhotep III": "Amenhotep III — the Magnificent King. Presided over Egypt's golden age, built the Luxor Temple, and married a diplomatic empire into existence. His reign was art, opulence, and power on a scale the ancient world had never seen.",
    "Ashoka": "Ashoka — the Mauryan emperor who conquered the Indian subcontinent, then renounced violence after seeing the carnage of the Kalinga War. Converted to Buddhism, built pillars of dharma, and spread a message of nonviolence across Asia. The warrior who became a monk.",
    "Genghis Khan": "Genghis Khan — the orphan boy who united the Mongol tribes and built the largest contiguous empire in history. Ruthless in conquest, brilliant in strategy, surprisingly tolerant in governance. He killed millions but also created the Silk Road's golden age.",
    "Miyamoto Musashi": "Miyamoto Musashi — Japan's greatest swordsman. Undefeated in over 60 duels, fought his first battle at 13, and killed opponents with wooden swords. Wrote The Book of Five Rings — a philosophy of combat and life. The ronin who became a legend.",
    "Jesus": "Jesus — a carpenter from Nazareth whose teachings of love, forgiveness, and sacrifice became the foundation of the world's largest religion. Turned water into wine, walked on water, and rose from the dead. Two billion people follow him today.",
    "Martin Luther": "Martin Luther — the Augustinian monk who nailed 95 theses to a church door and accidentally started the Protestant Reformation. Defied the Pope, translated the Bible into German, and changed Christianity forever. Faith alone, scripture alone.",
    "Queen Victoria": "Queen Victoria — the grandmother of Europe. Ruled the British Empire at its peak, mourned Albert for 40 years, and gave her name to an entire era. Small, stern, and surprisingly funny. Empress of India who never visited India.",
    "Catherine the Great": "Catherine the Great — the German princess who married a Russian tsar, overthrew him, and ruled as Empress for 34 years. Expanded Russia's borders, corresponded with Voltaire, and collected art like it was going out of style. Intelligent, ambitious, and absolutely in charge.",
    "Joan of Arc": "Joan of Arc — the teenage peasant girl who heard God's voice, led the French army, and lifted the siege of Orleans. Captured by the English, tried for heresy, and burned at the stake at 19. Canonized as a saint. France's eternal heroine.",
    "William Wallace": "William Wallace — the Scottish knight who led a rebellion against English rule. Defied Edward I, won at Stirling Bridge, and was brutally executed for treason. 'They may take our lives, but they'll never take our freedom!' Scotland's heart and soul.",
    "Robin Hood": "Robin Hood — the outlaw of Sherwood Forest who robbed the rich and gave to the poor. Master of the longbow, leader of the Merry Men, and thorn in the side of Prince John. Whether real or legend, he represents the fight against injustice.",
    "Louis Pasteur": "Louis Pasteur — the chemist who proved germs cause disease, invented pasteurization, and created the first vaccines for rabies and anthrax. Saved more lives than any general in history. 'Chance favors the prepared mind.'",
    "Thomas Edison": "Thomas Edison — the Wizard of Menlo Park. Invented the phonograph, the motion picture camera, and the practical light bulb. Held 1,093 patents. 'Genius is one percent inspiration and ninety-nine percent perspiration.'",
    "Alexander Graham Bell": "Alexander Graham Bell — the Scottish-born inventor who created the telephone and changed human communication forever. 'Mr. Watson, come here. I want to see you.' Also founded AT&T and worked with the deaf.",
    "Raphael": "Raphael — the Renaissance master who painted The School of Athens and the Sistine Madonna. Died at 37, leaving behind a legacy of divine beauty and perfect composition. Three masters — Leonardo, Michelangelo, and Raphael. The youngest, the smoothest.",
    "Donatello": "Donatello — the sculptor who brought the Renaissance to life in bronze and marble. His David was the first freestanding nude since antiquity. Worked in gold, wood, stone, and clay. The artist who made art feel human again.",
    "Botticelli": "Botticelli — the painter of The Birth of Venus and Primavera. Florentine, mystical, and obsessed with beauty. His figures float like dreams on canvas. Fell under Savonarola's spell, burned some of his own work, and faded into obscurity — until the Romantics rediscovered him.",
    "Claude Monet": "Claude Monet — the father of Impressionism. Painted light, water, and haystacks with a brush full of color. His Water Lilies series changed how we see the world. Cataracts blurred his vision, but his art only got more vivid.",
    "Rembrandt": "Rembrandt — the Dutch master who painted humanity in all its light and shadow. The Night Watch, self-portraits that charted a lifetime of triumph and ruin. Died broke, but his paintings are priceless. Light was his language.",
    "Georgia O'Keeffe": "Georgia O'Keeffe — the mother of American modernism. Painted flowers the size of buildings and desert skulls with surgical precision. Lived alone in New Mexico, wore black, and refused to be called anyone's muse. 'I found I could say things with color.'",
    "Jackson Pollock": "Jackson Pollock — the cowboy of Abstract Expressionism. Dripped, splattered, and poured paint onto canvas on the floor. Chaotic, alcoholic, and utterly revolutionary. Changed the question from 'what to paint' to 'how to paint.'",
    "Mark Rothko": "Mark Rothko — the painter of floating color fields. Enormous canvases of luminous red, orange, and black that make you feel something you can't name. Rejected the label 'abstract artist.' Painted emotions, not objects. Then silenced himself forever.",
    "Frédéric Chopin": "Frédéric Chopin — the poet of the piano. Composed nocturnes, ballades, and polonaises that sound like heartbreak set to music. Polish exile in Paris, frail health, passionate affair with George Sand. Played his last concert at 32, died at 39.",
    "Igor Stravinsky": "Igor Stravinsky — the composer who detonated a bomb at the Paris premiere of The Rite of Spring in 1913. Riots in the concert hall. Changed music forever with rhythm, dissonance, and raw primal energy. The man who made classical music dangerous.",
}

def main():
    with open(PRESETS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.split("\n")
    updated = 0

    # For each name we want to update, find the line with name: 'X', and the next vibe: '...', line
    for name, new_vibe in VIBES.items():
        # Escape single quotes in name for regex
        name_pattern = re.escape(name)
        # Match the name line (handles both single and double quotes)
        name_regex = re.compile(r"^(\s*)name:\s*['\"]" + name_pattern + r"['\"],\s*$")

        for i, line in enumerate(lines):
            m = name_regex.match(line)
            if m:
                indent = m.group(1)
                # Search for the next vibe line within 10 lines
                for j in range(i + 1, min(i + 15, len(lines))):
                    vibe_match = re.match(r"^(\s*)vibe:\s*['\"](.*)['\"],\s*$", lines[j])
                    if vibe_match:
                        # Escape single quotes in the new vibe
                        escaped_vibe = new_vibe.replace("\\", "\\\\").replace("'", "\\'")
                        old_vibe = vibe_match.group(2)
                        lines[j] = f"{indent}vibe: '{escaped_vibe}',"
                        updated += 1
                        print(f"Updated: {name} (line {j+1})")
                        print(f"  Old: {old_vibe[:80]}...")
                        print(f"  New: {new_vibe[:80]}...")
                        break
                break

    print(f"\nTotal updated: {updated}/{len(VIBES)}")

    with open(PRESETS_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("File saved successfully.")

if __name__ == "__main__":
    main()
