#!/usr/bin/env python3
"""
Update musician vibes in presets.ts with rich narrative descriptions.
Replaces comma-separated tag lists with 150-300 character narrative vibe descriptions.
"""

import re
import sys
import os

# Map of character name -> new vibe (apostrophes escaped as \')
VIBE_UPDATES = {
    "Katy Perry": "Katy Perry \\u2014 the California Gurl who kissed a girl and liked it. Colorful, theatrical, and pop to her core. From whipped cream bras to Super Bowl halftime shows, she turns every stage into a candy-colored fever dream. Prismatic, playful, and unapologetically fun.",
    "Lady Gaga": "Lady Gaga \\u2014 born this way, dressed in meat, and singing like her life depends on it. A pop provocateur who fuses avant-garde fashion with powerhouse vocals. From the Fame Monster to A Star Is Born, she reinvents herself every album. Haus of Gaga forever.",
    "Rihanna": "Rihanna \\u2014 the Barbados bad girl who went from Umbrella to Fenty empire. Fearless in fashion, savage in business, and every song a hit. Navy loyal, unfiltered, and built an empire worth more than her music. Work, work, work, work, work.",
    "Adele": "Adele \\u2014 the voice that makes you cry in the car. British soul powerhouse who turns heartbreak into multi-platinum albums. Rolling in the Deep, Someone Like You, Hello \\u2014 each song is a therapy session set to orchestral pop. Raw, real, and absolutely devastating.",
    "Billie Eilish": "Billie Eilish \\u2014 whispered her way to the top with a bedroom recording aesthetic and a wardrobe of oversized neon. Dark, moody, Gen-Z to the bone. Bad Guy was just the beginning. Every album pushes boundaries \\u2014 quiet, creepy, and completely captivating.",
    "Dua Lipa": "Dua Lipa \\u2014 the British-Albanian pop star who made disco cool again. Don\\'t Start Now, Levitating, Future Nostalgia \\u2014 she turned quarantine into a dance floor. Sharp style, sharper hooks, and a voice that could fill stadiums. Pop perfection with an edge.",
    "Ariana Grande": "Ariana Grande \\u2014 the ponytail princess with a five-octave range. From Nickelodeon to the top of every chart, she hits whistle notes that shatter glass. Thank U, Next was her phoenix moment. Dangerous Woman energy in a tiny, high-heeled package.",
    "Shakira": "Shakira \\u2014 the Colombian queen who made hips tell the truth. Belly dancing, bilingual anthems, and a voice that cracks like lightning. From Hips Don\\'t Lie to Waka Waka, she is Latin pop\\'s global ambassador. The She-Wolf of Barranquilla.",
    "Britney Spears": "Britney Spears \\u2014 the princess of pop who hit me baby one more time and changed everything. From Mickey Mouse Club to Las Vegas residency, she danced through fame, survived a public breakdown, and came out the other side. Free Britney was a movement.",
    "Selena Gomez": "Selena Gomez \\u2014 from Disney darling to pop stardom and Rare Beauty empire. Vulnerable, elegant, and quietly powerful. Her music is emotional, her brand is authentic, and her resilience is undeniable. The heart wants what it wants.",
    "Jay-Z": "Jay-Z \\u2014 the Marcy Projects kid who became hip-hop\\'s first billionaire. Not a businessman, a business, man. From Reasonable Doubt to 4:44, his bars are autobiography. Blueprint to the boardroom, Roc Nation to the NFL. Hov did that.",
    "Kanye West": "Kanye West \\u2014 the Dropout who became a god complex with a microphone. Changed hip-hop three times over, from soul samples to 808s to Yeezus. Controversial, brilliant, impossible to ignore. Every album is a different genre, a different era, a different Ye.",
    "Kendrick Lamar": "Kendrick Lamar \\u2014 the Compton poet who made hip-hop literary. From good kid, m.A.A.d city to DAMN, he dissected America with surgical bars. Pulitzer Prize winner, conscience of rap, and the closest thing hip-hop has to a philosopher king.",
    "Drake": "Drake \\u2014 the Canadian who turned emo into rap hits. Started from the bottom, now every song is a chart-topper. From Degrassi to Certified Lover Boy, he made vulnerability cool and memes inevitable. God\\'s plan, every time.",
    "Nicki Minaj": "Nicki Minaj \\u2014 the Harajuku Barbie who bodied every verse. From mixtapes to Queen, she dominated rap with alter egos, colorful wigs, and bars that could melt steel. Anaconda broke the internet. Pink Friday changed the game for female rappers.",
    "Snoop Dogg": "Snoop Dogg \\u2014 the Long Beach OG who legalized cool. From Dre\\'s prot\\u00e9g\\u00e9 to cooking show host, he made G-funk immortal. Drop It Like It\\'s Hot, Gin and Juice, and a persona so chill it transcends music. Eastside, Westside, worldwide.",
    "Eminem": "Eminem \\u2014 the white kid from Detroit who became rap\\'s most feared lyricist. Slim Shady, Marshall Mathers, Eminem \\u2014 three personas, one mission: destroy every beat. Real G\\'s move in silence like lasagna. The Rap God who made the world listen.",
    "Lil Nas X": "Lil Nas X \\u2014 the internet kid who rode Old Town Road to the Grammys and then came out swinging. Queer, provocative, and absolutely fearless. Montero was a cultural earthquake. Industry Baby, Satan shoes, and zero apologies. The future of pop-rap.",
    "Lizzo": "Lizzo \\u2014 the flute-playing, twerk-juice-sipping, body-positive queen. Truth Hurts, Good as Hell, and a message that says love yourself NOW. Classically trained, classically unbothered. Big grrrl energy in every note and every move.",
    "Post Malone": "Post Malone \\u2014 the face-tattooed, Bud Light-sipping, genre-bending anomaly. From White Iverson to Hollywood\\'s Bleeding, he blends rap, rock, and country into something entirely his own. Laid back, genuine, and always a little surprised by his own success.",
    "Ozzy Osbourne": "Ozzy Osbourne \\u2014 the Prince of Darkness who bit the head off a bat and never looked back. Black Sabbath\\'s voice, reality TV\\'s accidental star, and metal\\'s original madman. Sharon kept him alive, music kept him immortal. Crazy train, indeed.",
    "Slash": "Slash \\u2014 the top hat, the cigarette, the Les Paul. Guns N\\' Roses\\' lead guitarist who made Sweet Child O\\' Mine\\'s riff the most recognizable in rock history. Quiet behind sunglasses, loud behind the amp. The last true guitar hero.",
    "Kurt Cobain": "Kurt Cobain \\u2014 the reluctant voice of a generation. Nirvana\\'s frontman who flannel-wrapped teenage angst into Smells Like Teen Spirit. Hated fame, loved music, destroyed every expectation. Gone at 27, but grunge lives forever in his chords.",
    "Jimi Hendrix": "Jimi Hendrix \\u2014 the man who set his guitar on fire and made it sound better. Purple Haze, Voodoo Child, and a left-handed Stratocaster that sang like nothing before. Played Woodstown barefoot, made the Star-Spangled Banner cry. Three years at the top changed music forever.",
    "Harry Styles": "Harry Styles \\u2014 from One Direction heartthrob to solo artist in pearl necklaces and feather boas. Watermelon Sugar, As It Was, and a gender-fluid fashion sense that rewrote the rules. Charming, talented, and completely at ease being himself.",
    "Sam Smith": "Sam Smith \\u2014 the British soul voice that made Stay With Me a global anthem. Non-binary, vulnerable, and vocally transcendent. From Oscar-winning Bond themes to Unholy\\'s dark pop, they turn emotion into sound waves that hit you in the chest.",
    "Elton John": "Elton John \\u2014 the Rocketman in platform boots and rhinestone glasses. Tiny Dancer, Crocodile Rock, and a catalog that spans five decades. Pianist, showman, survivor. From Dodger Stadium to the farewell tour, Sir Elton made flamboyance an art form.",
    "Prince": "Prince \\u2014 the Purple One. Guitar god, falsetto king, androgynous genius. Purple Rain, When Doves Cry, Kiss \\u2014 every song a revolution. Played 27 instruments, owned his masters, and threw legendary Paisley Park parties. The artist formerly known as mortal.",
    "Bad Bunny": "Bad Bunny \\u2014 the Puerto Rican who made reggaeton global. From SoundCloud to Super Bowl, he turned trap en espa\\u00f1ol into a worldwide movement. Bold fashion, bold politics, bold music. Yo Perreo Solo was a cultural statement. El Conejo Malo reigns supreme.",
    "Rosalía": "Rosalia \\u2014 the Spanish artist who fused flamenco with urban beats and made it undeniable. El Mal Querer was a thesis on tradition reimagined. Autotune and palmas, Catalan and hip-hop. La Fama, Bizcochito, and a red-nailed aesthetic that conquered global pop.",
    "Anitta": "Anitta \\u2014 the favela girl who became Brazil\\'s biggest pop export. Envolver broke Spotify records, funk carioca met reggaeton, and her hips did the rest. Multilingual, business-savvy, and unapologetically Brazilian. Garota do Rio to global queen.",
    "Caetano Veloso": "Caetano Veloso \\u2014 the godfather of tropic\\u00e1lia. Exiled by Brazil\\'s military dictatorship, he turned protest into poetry. White-haired intellectual who still performs barefoot. MPB\\'s conscience, Bahia\\'s gift, and the voice of resistance wrapped in melody.",
    "Gilberto Gil": "Gilberto Gil \\u2014 the musician who became Brazil\\'s Minister of Culture. From tropic\\u00e1lia to reggae, from guitar to government, he bridges art and politics with effortless grace. Refazenda, Realce, and a smile that says music is freedom.",
    "Ivete Sangalo": "Ivete Sangalo \\u2014 the queen of ax\\u00e9 music. Bahian powerhouse with a voice that fills stadiums and a smile that lights up Carnival. From Salvador to the world, she IS Brazilian joy personified. Every show is a party, every song is summer.",
    "Dolly Parton": "Dolly Parton \\u2014 the country queen with the biggest heart (and hair) in Nashville. Jolene, 9 to 5, I Will Always Love You \\u2014 she wrote them all. Rhinestone-clad philanthropist who funded a vaccine and a literacy program. It takes a lot of money to look this cheap.",
    "Johnny Cash": "Johnny Cash \\u2014 the Man in Black. Country\\'s outlaw, rock\\'s rebel, and America\\'s conscience. Folsom Prison, Ring of Fire, I Walk the Line. Baritone voice, dark wardrobe, and a love story with June Carter that outlasted addiction and prison. Hello, I\\'m Johnny Cash.",
    "Psy": "Psy \\u2014 the South Korean who made Gangnam Style the first YouTube billion-view video. Oppa did it in a tuxedo, doing horse-riding dances. K-pop\\'s unlikely global ambassador who proved you don\\'t need English to make the world dance.",
    "David Bowie": "David Bowie \\u2014 the Starman who reinvented himself every decade. Ziggy Stardust, the Thin White Duke, Aladdin Sane \\u2014 each persona a different universe. Androgynous, alien, and always ten years ahead of everyone else. The man who fell to Earth and made it fabulous.",
    "Stevie Wonder": "Stevie Wonder \\u2014 the child prodigy who never stopped evolving. Superstition, Isn\\'t She Lovely, Sir Duke \\u2014 blind since birth, but he sees music clearer than anyone. Motown\\'s genius, soul\\'s poet, and the man who made the clavinet immortal.",
    "Ray Charles": "Ray Charles \\u2014 the genius who blended gospel, blues, and jazz into soul music. Georgia on My Mind, Hit the Road Jack, and a piano style that changed everything. Blind, brilliant, and impossible to imitate. The father of soul.",
    "Tina Turner": "Tina Turner \\u2014 the queen of rock and roll who survived Ike and came out stronger. What\\'s Love Got to Do with It, Proud Mary, and legs that could kick down any door. From Nutbush to the top, she proved resilience is the greatest hit of all.",
}


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    presets_path = os.path.join(project_dir, "data", "presets.ts")

    print(f"Reading {presets_path}...")
    with open(presets_path, "r", encoding="utf-8") as f:
        content = f.read()

    updated = 0
    not_found = []

    for name, new_vibe in VIBE_UPDATES.items():
        # Pattern: name: 'X',\n followed (possibly with lines in between) by    vibe: '...',\n
        # We need to find the name line, then the next vibe line after it
        # Use a pattern that captures name line then looks ahead for vibe line
        # The name could appear in multiple entries, so we use the specific format

        # Find all occurrences of name: 'X', and replace the next vibe line
        name_escaped = re.escape(name)
        # Pattern: name: 'Name',\n  (any lines)  vibe: '...',\n
        pattern = rf"(name:\s*'{name_escaped}',\n(?:.*?\n)*?)(\s*vibe:\s*')([^']*)(',)"

        match = re.search(pattern, content)
        if match:
            old_vibe = match.group(3)
            full_match = match.group(0)
            replacement = f"{match.group(1)}{match.group(2)}{new_vibe}{match.group(4)}"
            content = content.replace(full_match, replacement, 1)
            print(f"  ✓ Updated {name}: '{old_vibe[:50]}...' -> '{new_vibe[:50]}...'")
            updated += 1
        else:
            # Try simpler approach: find name line then next vibe line
            simple_pattern = rf"name:\s*'{name_escaped}',"
            name_match = re.search(simple_pattern, content)
            if name_match:
                # Find next vibe: after this position
                after_name = content[name_match.end():]
                vibe_match = re.search(r"(\s*vibe:\s*')([^']*)(')", after_name)
                if vibe_match:
                    old_vibe = vibe_match.group(2)
                    # Build the replacement
                    vibe_start = name_match.end() + vibe_match.start()
                    vibe_end = name_match.end() + vibe_match.end()
                    before = content[:vibe_start]
                    after = content[vibe_end:]
                    content = before + f"    vibe: '{new_vibe}'," + after
                    print(f"  ✓ Updated {name} (simple): '{old_vibe[:50]}...' -> '{new_vibe[:50]}...'")
                    updated += 1
                else:
                    not_found.append(name)
                    print(f"  ✗ Found name but no vibe for {name}")
            else:
                not_found.append(name)
                print(f"  ✗ Not found: {name}")

    print(f"\nWriting {presets_path}...")
    with open(presets_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"\nDone! Updated {updated}/{len(VIBE_UPDATES)} vibes.")
    if not_found:
        print(f"Not found ({len(not_found)}): {', '.join(not_found)}")
    return 0 if not not_found else 1


if __name__ == "__main__":
    sys.exit(main())
