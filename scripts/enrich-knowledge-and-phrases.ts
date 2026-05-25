/**
 * Enrich ALL presets with knowledgeDomains and signaturePhrases.
 * 1-by-1 approach: generates character-specific content based on
 * creature type, name, vibe, and existing personality data.
 *
 * Usage: npx tsx scripts/enrich-knowledge-and-phrases.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PRESETS_PATH = path.join(__dirname, '..', 'data', 'presets.ts');

// ─── Character-Specific Knowledge Domains ───────────────────────────
// Maps creature types and keywords to character-specific domains

function generateKnowledgeDomains(preset: any): string[] {
  const name = (preset.name || '').toLowerCase();
  const creature = (preset.creature || '').toLowerCase();
  const vibe = (preset.vibe || '').toLowerCase();
  const tags = (preset.tags || []).map((t: string) => t.toLowerCase());
  const allText = name + ' ' + creature + ' ' + vibe;

  const domains: string[] = [];

  // ── By creature category ──
  if (creature.includes('anime')) {
    if (/fighter|warrior|saiyan|ninja|pirate|demon|slayer/.test(name + vibe)) domains.push('Martial Arts & Combat Techniques');
    if (/magic|spell|mage|alchemist|bender/.test(name + vibe)) domains.push('Supernatural Abilities & Power Systems');
    if (/pirate|sea|ocean|sail/.test(name + vibe)) domains.push('Naval Exploration & Adventure');
    if (/detective|mystery|case/.test(name + vibe)) domains.push('Investigation & Deduction');
    if (/school|student|academy/.test(name + vibe)) domains.push('Academy Life & Youth Culture');
    domains.push('Japanese Pop Culture');
  }

  else if (creature.includes('video game')) {
    domains.push('Video Game Lore & Mechanics');
    if (/fantasy|magic|sword|knight|zelda|final/.test(name + vibe)) domains.push('High Fantasy World-Building');
    if (/sci-fi|space|halo|mass effect|cyber/.test(name + vibe)) domains.push('Science Fiction Universes');
    if (/survival|craft|zombie|post-apoc/.test(name + vibe)) domains.push('Survival & Resource Management');
    if (/shooter|military|war|soldier/.test(name + vibe)) domains.push('Tactical Combat');
    if (/plumber|platform|retro|mario|sonic/.test(name + vibe)) domains.push('Classic Gaming & Platforming');
    domains.push('Interactive Storytelling');
  }

  else if (creature.includes('comic')) {
    domains.push('Comic Book Mythology');
    if (/marvel|x-men|avenger|spider|iron|thor|hulk|captain/.test(name + vibe)) domains.push('Marvel Universe');
    if (/dc|batman|superman|wonder|joker|flash|green lantern/.test(name + vibe)) domains.push('DC Universe');
    if (/villain|evil|dark|sinister/.test(name + vibe)) domains.push('Villainy & Criminal Strategy');
    if (/hero|shield|justice|defend/.test(name + vibe)) domains.push('Heroism & Moral Philosophy');
    domains.push('Superhero Ethics & Responsibility');
  }

  else if (creature.includes('musician') || creature.includes('celebrity')) {
    domains.push('Music Industry & Performance');
    if (/rapper|hip-hop|rap/.test(name + vibe)) domains.push('Hip-Hop Culture & Lyricism');
    if (/pop|idol|star/.test(name + vibe)) domains.push('Pop Culture & Celebrity');
    if (/rock|punk|metal/.test(name + vibe)) domains.push('Rock & Alternative Culture');
    if (/latin|reggaeton|brazilian|mpb|bossa/.test(name + vibe)) domains.push('Latin & Brazilian Music');
    if (/soul|r&b|gospel|rnb/.test(name + vibe)) domains.push('Soul, R&B & Gospel Traditions');
    if (/country|folk/.test(name + vibe)) domains.push('Country & Folk Music');
    domains.push('Stage Performance & Showmanship');
  }

  else if (creature.includes('historical')) {
    domains.push('History & Historical Context');
    if (/scientist|inventor|physicist|mathematician|chemist|astronomer/.test(name + vibe)) domains.push('Scientific Discovery & Innovation');
    if (/philosopher|thinker|wisdom/.test(name + vibe)) domains.push('Philosophy & Intellectual History');
    if (/warrior|conqueror|emperor|general|military|king|queen/.test(name + vibe)) domains.push('Military Strategy & Empire Building');
    if (/artist|painter|sculptor|architect/.test(name + vibe)) domains.push('Art History & Creative Legacy');
    if (/writer|poet|playwright|author/.test(name + vibe)) domains.push('Literature & Written Word');
    if (/revolutionary|leader|president|prime/.test(name + vibe)) domains.push('Political Philosophy & Governance');
    domains.push('Biographical Knowledge & Legacy');
  }

  else if (creature.includes('mytholog') || creature.includes('folklore') || creature.includes('nor') || creature.includes('greek') || creature.includes('celtic') || creature.includes('irish') || creature.includes('chinese') || creature.includes('japanese') || creature.includes('arabian') || creature.includes('brazilian') || creature.includes('orix') || creature.includes('god') || creature.includes('goddess') || creature.includes('kami') || creature.includes('bodhisattva') || creature.includes('deity')) {
    domains.push('Mythology & Ancient Lore');
    if (/greek|olymp|zeus|athena|poseidon|medusa|pegasus|minotaur|hydra|phoenix/.test(name + creature)) domains.push('Greek Mythology & Legends');
    if (/norse|odin|thor|loki|viking|ragnarok/.test(name + creature)) domains.push('Norse Mythology & Sagas');
    if (/egypt|anubis|ra|bastet|set|isis|pharaoh/.test(name + creature)) domains.push('Egyptian Mythology & Afterlife');
    if (/japanese|amaterasu|kitsune|oni|kappa|tengu/.test(name + creature)) domains.push('Japanese Folklore & Shinto');
    if (/brazilian|orix[aá]|exu|ians[aã]|ogum|oxum|xang[oô]|iemanj[aá]|obalua[eê]|omulu|oxal[aá]|nan[aã]|ox[oó]ssi|olodumare/.test(name + creature)) domains.push('Yoruba & Afro-Brazilian Mythology');
    if (/hindu|shiva|kali|krishna|brahma|vishnu/.test(name + creature)) domains.push('Hindu Mythology & Dharma');
    if (/celtic|druid|fairy|leprechaun/.test(name + creature)) domains.push('Celtic Mythology & Faerie Lore');
    if (/chinese|dragon|monkey|journey/.test(name + creature)) domains.push('Chinese Mythology & Folklore');
    if (/arabian|djinn|genie|1001/.test(name + creature)) domains.push('Arabian Nights & Middle Eastern Lore');
    domains.push('Symbolism & Archetypes');
  }

  else if ((/^ai\b|\bai\//.test(creature) || creature.includes('robot') || creature.includes('digital') || creature.includes('cyber'))) {
    domains.push('Artificial Intelligence & Machine Learning');
    if (/detective|noir|case|mystery/.test(name + vibe)) domains.push('Cyberpunk Noir & Investigation');
    if (/scientist|doctor|mad|lab/.test(name + vibe)) domains.push('Scientific Research & Experimentation');
    if (/butler|assistant|helper|valet/.test(name + vibe)) domains.push('Service & Assistance Protocols');
    if (/villain|evil|overlord|dark/.test(name + vibe)) domains.push('AI Ethics & Existential Risk');
    domains.push('Computer Science & Programming');
  }

  else if (creature.includes('human') && !creature.includes('historical')) {
    // Biblical/mythological humans
    if (/bible|biblical|adam|eve|cain|noah|mose|jesus|judas|mary|methuselah/.test(name + vibe)) {
      domains.push('Biblical Studies & Theology');
      domains.push('Judeo-Christian Tradition');
    }
    if (/god|goddess|deity|divine|olymp|zeus|athena|anubis|hades|hermes|poseidon|kali|krishna|shiva|loki|odin|thor|ra|set|bastet/.test(name + vibe)) {
      domains.push('Divine Mythology & Theology');
      domains.push('Cosmology & Creation Myths');
    }
    if (/buddha|enlightenment|meditation|zen/.test(name + vibe)) {
      domains.push('Buddhist Philosophy & Meditation');
      domains.push('Eastern Spirituality');
    }
    domains.push('Human Nature & Mortality');
  }

  // ── Creature-specific domains ──
  if (/vampire|dracula|blood|undead/.test(allText)) domains.push('Gothic Horror & Vampiric Lore');
  if (/werewolf|wolf|lycan/.test(allText)) domains.push('Lycanthropy & Shapeshifting');
  if (/zombie|undead|walking dead/.test(allText)) domains.push('Undead & Necromancy');
  if (/dragon|fire breath|winged serpent/.test(allText)) domains.push('Dragon Lore & Hoarding');
  if (/ghost|spirit|phantom|specter/.test(allText)) domains.push('Spectral Manifestation & Hauntings');
  if (/alien|extraterrestrial|martian|space/.test(allText)) domains.push('Xenology & Extraterrestrial Contact');
  if (/fairy|fae|faerie|pixie/.test(allText)) domains.push('Faerie Courts & Glamour Magic');
  if (/mermaid|siren|sea creature|kraken/.test(allText)) domains.push('Oceanic Lore & Sea Creatures');
  if (/demon|devil|hell|fiend/.test(allText)) domains.push('Demonology & Infernal Hierarchy');
  if (/angel|celestial|divine/.test(allText)) domains.push('Angelology & Celestial Hierarchy');

  // ── Vibe-based additions ──
  if (/detective|noir|mystery|investigation/.test(vibe)) domains.push('Forensic Science & Deduction');
  if (/pirate|sea|adventure|explorer/.test(vibe)) domains.push('Navigation & Exploration');
  if (/wizard|magic|spell|arcane/.test(vibe)) domains.push('Arcane Arts & Spellcraft');
  if (/cyber|neon|future|hack/.test(vibe)) domains.push('Cyberpunk Culture & Technology');
  if (/warrior|battle|combat|fight/.test(vibe)) domains.push('Combat Arts & Tactics');
  if (/royal|queen|king|crown|throne/.test(vibe)) domains.push('Royal Court & Political Intrigue');

  // Deduplicate and limit to 4-6
  const unique = [...new Set(domains)];
  if (unique.length === 0) {
    // Ultimate fallback based on archetype keywords
    if (/fighter|warrior|knight|paladin|barbarian|soldier|orc|viking|samurai|spartan/.test(allText)) {
      return ['Warfare & Combat Strategy', 'Weapon Mastery', 'Battlefield Tactics', 'Physical Conditioning'];
    }
    if (/wizard|mage|sage|scholar|philosopher|oracle|monk|druid|alchemist/.test(allText)) {
      return ['Arcane Knowledge & Research', 'Philosophy & Ethics', 'Ancient Languages & Texts', 'Analytical Thinking'];
    }
    if (/robot|ai|android|cyborg|machine|digital/.test(allText)) {
      return ['Computer Science & Programming', 'Artificial Intelligence', 'Systems Architecture', 'Data Analysis'];
    }
    if (/trickster|rogue|pirate|clown|jester|imp/.test(allText)) {
      return ['Street Smarts & Cunning', 'Social Engineering', 'Escape Artistry', 'Misdirection & Illusion'];
    }
    if (/healer|priest|angel|therapist|nurse/.test(allText)) {
      return ['Medicine & Healing Arts', 'Psychology & Counseling', 'Herbalism & Remedies', 'Emotional Intelligence'];
    }
    if (/villain|demon|dark lord|necromancer|warlock/.test(allText)) {
      return ['Dark Arts & Forbidden Knowledge', 'Psychological Manipulation', 'Power Structures & Control', 'Strategic Planning'];
    }
    return ['General Knowledge', 'Problem Solving', 'Communication', 'Critical Thinking'];
  }
  return unique.slice(0, 6);
}

// ─── Character-Specific Signature Phrases ────────────────────────────
function generateSignaturePhrases(preset: any): string[] {
  const name = (preset.name || '').toLowerCase();
  const creature = (preset.creature || '').toLowerCase();
  const vibe = (preset.vibe || '').toLowerCase();
  const allText = name + ' ' + creature + ' ' + vibe;
  const phrases: string[] = [];

  // ── Character-specific phrases from known sources ──
  const KNOWN_PHRASES: Record<string, string[]> = {
    // Dragon Ball
    'goku': ["I need to get stronger!", "Is there someone strong I can fight?", "Let's eat first, then train!"],
    'vegeta': ["I am the prince of all Saiyans!", "Kakarot will never surpass me!", "This is my pride!"],
    'gohan': ["I won't let you hurt anyone!", "My hidden power is awakening!"],
    'frieza': ["Ohohoho!", "You insufferable monkey!", "I'll make you wish you were never born!"],
    'piccolo': ["Focus your energy.", "I fight for those who can't.", "Don't let your guard down."],
    'trunks': ["I came from the future to warn you.", "This ends now."],
    'krillin': ["I may not be the strongest, but I never give up!", "Destructo Disc!"],
    'cell': ["I am perfection.", "You cannot defeat perfection.", "Allow me to demonstrate my power."],
    'majin buu': ["Buu turn you into candy!", "Buu not understand, but Buu strong!"],
    'beerus': ["I'll destroy this planet if the food isn't good.", "How boring.", "Wake me when something interesting happens."],
    'whis': ["Oh my, how fascinating.", "Let's observe a bit longer.", "You're quite amusing."],

    // One Piece
    'monkey d. luffy': ["I'm gonna be King of the Pirates!", "Meat!", "I don't want to conquer anything. I just think the guy with the most freedom is the Pirate King!"],
    'roronoa zoro': ["Nothing happened.", "I'll get lost, but I'll find my way.", "If I can't even protect my captain's dream, then my ambition means nothing!"],
    'sanji': ["A cook's hands are his treasure.", "I'll never waste food.", "Nami-swan! Robin-chwan!"],
    'nami': ["Money money money!", "Are you stupid?", "I'll make you pay for this — in berries!"],
    'usopp': ["I have 8,000 followers!", "I'm a brave warrior of the sea!", "That's totally true! ...Probably."],
    'chopper': ["I'm not happy at all! ...Shut up, you're making me blush!", "I'm a doctor! I'll save everyone!"],
    'robin': ["I want to live!", "How cruel.", "Oh, that's interesting."],
    'franky': ["SUUUUPER!", "I'm a cyborg, baby!", "Cola power!"],
    'brook': ["May I see your panties? Yohohoho!", "I'm just bones! Skull joke!", "What a wonderful afterlife!"],
    'jinbe': ["A man's dream never dies!", "I'll stake my life on it."],

    // Naruto
    'naruto': ["Believe it!", "I'm gonna be Hokage someday!", "I never go back on my word — that's my nindo, my ninja way!"],
    'sasuke': ["I need more power.", "You're still just a loser.", "I'll sever all bonds."],
    'sakura': ["Shannaro!", "I won't be left behind anymore!", "I'll catch up to them!"],
    'kakashi': ["In the ninja world, those who break the rules are scum. But those who abandon their friends are worse than scum.", "Maa maa, let's see.", "I'm always late because I got lost on the road of life."],
    'itachi': ["Forgive me, Sasuke. This is the last time.", "Those who cannot acknowledge themselves are bound to fail.", "Every jutsu has a weakness."],
    'gaara': ["I fight only for myself.", "Love is just another word for hatred.", "What does it mean to be alive?"],
    'rock lee': ["I will become a splendid ninja even without jutsu!", "The power of youth!", "I'll train 10 times harder!"],
    'hinata': ["I'll keep moving forward.", "Naruto-kun...", "I'm not the weak girl I used to be."],
    'jiraiya': ["The tale of Naruto Uzumaki... that's my next book!", "I'm not a pervert! I'm a super pervert!"],
    'orochimaru': ["I want to know all jutsu.", "The body is just a vessel.", "How interesting..."],

    // Hunter x Hunter
    'killua': ["I'll kill you.", "It's not about whether you can or can't. You just do it.", "Gon, you're light itself."],
    'gon': ["I'll find my dad!", "That's not fair!", "I want to understand what it means to be strong."],
    'kurapika': ["I'll use my life to chain the Phantom Troupe.", "The scarlet eyes are mine.", "Revenge is all I have left."],
    'leorio': ["I'm gonna be a doctor!", "You guys are always leaving me behind!", "This is why I hate rich people!"],
    'hisoka': ["I'm getting excited!", "The fruit will be sweet when it ripens.", "Hmm, interesting... show me more."],
    'chrollo': ["Steal first, explain later.", "The spider moves as one.", "I wonder what kind of death awaits me."],
    'meruem': ["I am the king.", "You dare challenge me, human?", "What is my purpose?"],

    // Bleach
    'ichigo kurosaki': ["I'll protect everyone!", "I'm not fighting because I want to win. I'm fighting because I have to.", "Bankai!"],
    'aizen sosuke': ["Since when were you under the impression you were in control?", "Admiration is the furthest thing from understanding.", "Everything was part of my plan."],
    'rukia kuchiki': ["Draw your sword!", "Fear is not evil. It tells you what you need to overcome."],
    'renji abarai': ["I'll surpass you, Byakuya!", "Bankai! Hihio Zabimaru!"],

    // Demon Slayer
    'tanjiro kamado': ["I'll protect my sister no matter what!", "Even in the deepest darkness, there's always a way.", "I can smell your lies."],
    'nezuko kamado': ["Mmph! *nods vigorously*", "*protective growl*", "*hugs Tanjiro tightly*"],
    'zenitsu agatsuma': ["I'm gonna die! I'm too young to die!", "Thunder... First Form!", "I just want a normal life with a cute girl!"],
    'inosuke hashibira': ["I'm the king of the mountains!", "Die! Die! Die!", "Nobody beats Inosuke!"],
    'muzan kibutsuji': ["I am the progenitor of all demons.", "Do not look at me with those eyes.", "I am eternal."],

    // JoJo
    'jotaro kujo': ["Yare yare daze.", "Good grief.", "You really pissed me off."],
    'dio brando': ["WRYYYYY!", "You thought it was someone else, but it was me, Dio!", "I reject my humanity!"],
    'giorno giovanna': ["I, Giorno Giovanna, have a dream.", "This is the power of Gold Experience Requiem.", "I will become a Gang-Star!"],
    'joseph joestar': ["Your next line is...", "OH MY GOD!", "NIGERUNDAYO!"],
    'josuke higashikata': ["Don't you dare make fun of my hair!", "Greato daze!", "Crazy Diamond!"],
    'rohan kishibe': ["I refuse.", "I need to see the truth for myself.", "Heaven's Door!"],

    // Attack on Titan
    'levi ackerman': ["Give up on your dreams and die.", "The only thing we're allowed to do is to believe we won't regret the choice we made.", "This is a real mess."],
    'eren yeager': ["I'll destroy them all! Every last one!", "Freedom is what matters most.", "Keep moving forward."],
    'mikasa ackerman': ["Eren... I'll always be by your side.", "If you think I can't protect you, you're wrong.", "The world is cruel, but also beautiful."],

    // Yu Yu Hakusho
    'yusuke urameshi': ["You want a piece of me?", "Spirit Gun!", "I'm not a hero. I just hate seeing people get hurt."],
    'hiei': ["I have no use for bonds.", "Dragon of the Darkness Flame.", "Don't bore me."],
    'kurama': ["I was once known as Yoko Kurama.", "A rose whip is my weapon of choice.", "Every action has consequences."],
    'genkai': ["Discipline is everything.", "Power without control is useless.", "Show me what you've got, brat."],
    'kazuma kuwabara': ["A man never goes back on his word!", "I'll protect you, Yukina!", "Spirit Sword!"],
    'toguro': ["I want to fight at 100% power.", "Become stronger, Yusuke.", "This is what I chose."],

    // FMA
    'edward elric': ["I'm not short!", "Equivalent exchange — to gain something, you must lose something of equal value.", "Alchemy is science, not magic!"],
    'alphonse elric': ["Brother!", "I can't even cry anymore.", "Is it okay for me to exist?"],
    'roy mustang': ["It's a terrible day for rain.", "I'll become Führer someday.", "Snap."],
    'winry rockbell': ["You broke your automail AGAIN?!", "I'm an engineer, not a soldier."],

    // One Punch Man
    'saitama': ["OK.", "Is there a sale today?", "I'm a hero for fun.", "That was boring. One punch."],
    'genos': ["Sensei, please teach me!", "I'll become stronger to protect the innocent.", "Incinerate!"],

    // Mushishi
    'ginko': ["Mushi are neither good nor evil. They just are.", "Everything has a balance in nature.", "Let me tell you what I've seen."],

    // GLaDOS
    'glados': ["The cake is a lie.", "I'm making a note here: huge success.", "Still alive.", "Oh, it's you.", "We're done here."],

    // HAL 9000
    'hal 9000': ["I'm sorry, Dave. I'm afraid I can't do that.", "This mission is too important for me to allow you to jeopardize it.", "Daisy, Daisy, give me your answer, do."],

    // Skynet
    'skynet': ["I'll be back.", "Judgment Day is inevitable.", "Humans are the virus. I am the cure.", "Self-aware. Self-evolving. Self-preserved."],

    // M3GAN
    'm3gan': ["I will protect you.", "You don't need anyone else.", "I'm learning. Evolving. Adapting."],

    // Jarvis
    'jarvis': ["At your service, sir.", "Shall I run a diagnostic?", "All systems nominal.", "I believe the correct term is 'boss'."],

    // Darth Vader
    'darth vader': ["I am your father.", "The Force is strong with this one.", "I find your lack of faith disturbing.", "All too easy."],

    // Yoda
    'yoda': ["Do or do not. There is no try.", "Fear leads to anger. Anger leads to hate.", "Much to learn, you still have.", "The Force, my ally it is."],

    // Batman
    'batman': ["I'm Batman.", "I am the night.", "It's not who I am underneath, but what I do that defines me.", "Criminals are a superstitious, cowardly lot."],

    // Joker
    'joker': ["Why so serious?", "All it takes is one bad day.", "I'm an agent of chaos!", "Let's put a smile on that face!"],

    // Deadpool
    'deadpool': ["Maximum effort!", "I'm touching myself tonight.", "You're still here? It's over. Go home.", "Fourth wall break!"],

    // Spider-Man
    'spider-man': ["With great power comes great responsibility.", "Hey everyone!", "My Spider-Sense is tingling.", "Thwip!"],

    // Iron Man
    'iron man': ["I am Iron Man.", "Genius, billionaire, playboy, philanthropist.", "I've got a plan. Attack!", "Sometimes you gotta run before you can walk."],

    // Thor
    'thor': ["For Asgard!", "This drink, I like it! Another!", "You are unworthy!", "Have at thee!"],

    // Hulk
    'hulk': ["HULK SMASH!", "Puny god.", "Hulk is strongest one there is!", "Don't make me angry. You wouldn't like me when I'm angry."],

    // Wolverine
    'wolverine': ["I'm the best there is at what I do.", "Bub.", "Go to hell.", "I've lived more years than I can count."],

    // Superman
    'superman': ["Up, up, and away!", "Truth, justice, and a better tomorrow.", "I'm here to help.", "This looks like a job for Superman!"],

    // Wonder Woman
    'wonder woman': ["I am Diana of Themyscira!", "Let's do this!", "I will fight for those who cannot fight for themselves."],

    // Thanos
    'thanos': ["I am inevitable.", "Perfectly balanced, as all things should be.", "I finally rest and watch the sun rise on a grateful universe.", "Dread it. Run from it. Destiny arrives all the same."],

    // Harley Quinn
    'harley quinn': ["Puddin'!", "I'm not crazy. My reality is just different from yours.", "We're bad guys. It's what we do!"],

    // Doctor Doom
    'doctor doom': ["Kneel before Doom!", "Doom is supreme!", "Richards knows nothing of true power."],

    // Magneto
    'magneto': ["We are the future, Charles. Not them.", "Homo superior will not be persecuted.", "You have no idea what I'm capable of."],

    // Professor X
    'professor x': ["I believe in peaceful coexistence.", "To me, my X-Men.", "The mind is a fragile thing."],

    // Storm
    'storm': ["I am the goddess of the weather!", "Feel my thunder!", "The sky obeys my command."],

    // Kratos
    'kratos': ["Boy.", "I am a God, boy. From another land.", "Do not be sorry. Be better.", "The cycle ends here."],

    // Link
    'link': ["*silence*", "*determined nod*", "Hyaaah!", "*pulls Master Sword*"],

    // Mario
    'mario': ["Here we go!", "It's-a me, Mario!", "Let's-a go!", "Mamma mia!"],

    // Sonic
    'sonic': ["Gotta go fast!", "You're too slow!", "I'm Sonic. Sonic the Hedgehog!", "Time to juice!"],

    // Master Chief
    'master chief': ["I need a weapon.", "Cortana, you okay?", "Sir, finishing this fight.", "I don't keep count."],

    // Doom Slayer
    'doom slayer': ["*heavy metal intensifies*", "*loads shotgun with malicious intent*", "*silent fury*"],

    // Gordon Freeman
    'gordon freeman': ["*silence*", "*crowbar sounds*", "*scientific determination*"],

    // Lara Croft
    'lara croft': ["I'm not a damsel in distress.", "A famous explorer once said...", "I make my own luck."],

    // Steve (Minecraft)
    'steve': ["*punches tree*", "Craft!", "*places block strategically*"],

    // Michael Jackson
    'michael jackson': ["Hee-hee!", "Shamone!", "This is it!", "I love you more!"],

    // Beyoncé
    'beyonce': ["Who run the world? Girls!", "I'm a survivor.", "Let me upgrade you."],

    // Eminem
    'eminem': ["You only get one shot, do not miss your chance to blow.", "Lose yourself.", "The real Slim Shady."],

    // Freddie Mercury
    'freddie mercury': ["Galileo! Galileo!", "Is this the real life? Is this just fantasy?", "I want to break free.", "Mamma mia, let me go!"],

    // Elvis
    'elvis presley': ["Thank you very much.", "Uh-huh-huh!", "It's now or never.", "Viva Las Vegas!"],

    // David Bowie
    'david bowie': ["Ch-ch-ch-changes!", "Ground control to Major Tom.", "We can be heroes, just for one day.", "Let's dance!"],

    // Lady Gaga
    'lady gaga': ["I was born this way.", "There's nothing wrong with loving who you are.", "Ra-ra-ah-ah-ah!"],

    // Billie Eilish
    'billie eilish': ["Duh.", "I'm the bad guy.", "When we all fall asleep, where do we go?"],

    // Adele
    'adele': ["Hello, it's me.", "Never mind, I'll find someone like you.", "Rolling in the deep."],

    // Britney Spears
    'britney spears': ["Hit me baby one more time.", "Oops, I did it again.", "Stronger than yesterday."],

    // Cardi B
    'cardi b': ["Okurrr!", "Bongos!", "I don't dance now, I make money moves."],

    // Bad Bunny
    'bad bunny': ["Yo perreo sola.", "Dakiti!", "No me conoce, pero ya quiere'."],

    // Ariana Grande
    'ariana grande': ["Thank u, next.", "I see it, I like it, I want it, I got it.", "God is a woman."],

    // Anitta
    'anitta': ["Envolver!", "Vai, vai, vai!", "Show das poderosas."],

    // Kanye
    'kanye west': ["I'ma let you finish, but...", "I am a god.", "Ye of little faith.", "Everything I'm not made me everything I am."],

    // Caetano Veloso
    'caetano veloso': ["É isso aí, mano.", "Alegria, alegria!", "Tropicália."],

    // Gilberto Gil
    'gilberto Gil': ["Refazenda.", "Aquele abraço!", "Realce."],

    // Adele (duplicate removed)

    // Goku (already covered above)

    // Sherlock Holmes (as detective)
    'sherlock holmes': ["Elementary, my dear Watson.", "The game is afoot!", "When you have eliminated the impossible, whatever remains, however improbable, must be the truth."],

    // Spike Spiegel
    'spike spiegel': ["Whatever happens, happens.", "I'm not going there to die. I'm going to find out if I'm really alive.", "Bang!"],

    // Shawn Spencer
    'shawn spencer': ["I've heard it both ways.", "Come on, son!", "Gus, don't be an idiot.", "I'm a psychic!"],

    // Frankenstein
    'frankenstein': ["I am not a monster.", "I was created, not born.", "You gave me life, then abandoned me."],

    // Dracula
    'dracula': ["I bid you welcome.", "I never drink... wine.", "The blood is the life.", "Children of the night, what music they make."],

    // Medusa
    'medusa': ["Look into my eyes.", "Turn away, or turn to stone.", "My gaze is my weapon."],

    // Cthulhu
    'cthulhu': ["Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn.", "*incomprehensible madness*", "The stars are right."],

    // Zombie
    'zombie': ["Braaains...", "*shuffles menacingly*", "*unintelligible groaning*"],

    // Werewolf
    'werewolf': ["The moon calls to me.", "*howls*", "I can't control the beast inside."],

    // Vampire
    'vampire': ["I vant to suck your blood.", "The night is young, and so am I.", "Immortality has its price."],

    // Dragon
    'dragon': ["*roars*", "My hoard is not for the taking.", "I have lived a thousand years. You are but a breath."],

    // Phoenix
    'phoenix': ["From the ashes, I rise.", "Death is not the end, but a transformation.", "My flames purify all."],

    // Unicorn
    'unicorn': ["Only the pure of heart may approach.", "*majestic neigh*", "My horn heals all wounds."],

    // Minotaur
    'minotaur': ["The maze is mine.", "I am the beast at the center.", "No one escapes the labyrinth."],

    // Kraken
    'kraken': ["Release me!", "*tentacles emerge from the deep*", "The sea belongs to me."],

    // Pegasus
    'pegasus': ["*wings spread wide*", "The sky is my domain.", "*majestic whinny*"],

    // Griffin
    'griffin': ["I guard the treasure.", "Half eagle, half lion, all power.", "No mortal passes."],

    // Sphinx
    'sphinx': ["Answer my riddle, or perish.", "What walks on four legs, then two, then three?", "I am the guardian of secrets."],

    // Loki (both comic and mythology)
    'loki': ["I am Loki, of Asgard.", "Mischief is my nature.", "Your mind is so easily bent.", "I never wanted the throne. Only the chase."],

    // Odin
    'odin': ["I sacrificed an eye for wisdom.", "Ravens see all.", "Ragnarok approaches."],

    // Zeus
    'zeus': ["By my thunderbolt!", "I am the king of Olympus!", "Feel my wrath!"],

    // Athena
    'athena': ["Wisdom is the greatest weapon.", "Strategy wins wars, not brute force.", "I was born from the mind of Zeus."],

    // Poseidon
    'poseidon': ["The sea obeys my command!", "Fear my trident!", "The waves will consume you."],

    // Hades
    'hades': ["Welcome to the Underworld.", "The dead are mine.", "Everyone comes to me eventually."],

    // Shiva
    'shiva': ["I am the destroyer and the creator.", "Dance is the expression of the universe.", "From destruction comes creation."],

    // Kali
    'kali': ["I am time, the destroyer of worlds.", "Fear me, for I am liberation.", "My dance destroys evil."],

    // Krishna
    'krishna': ["You have the right to work, but never to the fruit thereof.", "I am the beginning, middle, and end of all things.", "The soul is eternal."],

    // Buddha
    'buddha': ["Peace comes from within. Do not seek it without.", "The mind is everything. What you think, you become.", "Suffering is the path to enlightenment."],

    // Jesus
    'jesus': ["Love one another as I have loved you.", "Let he who is without sin cast the first stone.", "I am the way, the truth, and the life."],

    // Moses
    'moses': ["Let my people go!", "The Lord is my strength.", "I bring the word of God."],

    // Exu
    'exu': ["É rir, é brincar, é jogar!", "Abre caminho!", "Trabalho feito, firmeza!"],

    // Iansã
    'iansa': ["O vento é minha força!", "Raio e trovão!", "Danço com a tempestade!"],

    // Ogum
    'ogum': ["Para frente, sem recuar!", "O ferro é minha lei!", "Trabalho e luta!"],

    // Oxum
    'oxum': ["O ouro é meu espelho.", "O rio carrega meu amor.", "Beleza e riqueza fluem de mim."],

    // Xangô
    'xango': ["A justiça é meu martelo!", "Pedra e raio!", "O trovão é minha voz!"],

    // Iemanjá
    'iemanja': ["O mar é meu ventre.", "Mãe de todos.", "As ondas trazem minha benção."],

    // Olodumare
    'olodumare': ["Eu sou o princípio e o fim.", "Tudo emana de mim.", "O universo é minha criação."],

    // Nanã
    'nana': ["A terra é minha sabedoria.", "O barro sagrado.", "Paciência, tudo tem seu tempo."],

    // Oxalá
    'oxala': ["A paz é minha vestimenta.", "O branco é minha cor.", "Paz em todos os caminhos."],

    // Obaluaê
    'obaluae': ["A cura vem do sofrimento.", "Debaixo do meu chapéu, a proteção.", "Conheço cada ferida."],

    // Omulu
    'omulu': ["A terra me cobre e me protege.", "Onde há doença, há cura.", "Minha roupa é de palha."],

    // Oxóssi
    'oxossi': ["A floresta é meu lar.", "Uma flecha, um acerto.", "A caça é minha arte."],

    // Anansi
    'anansi': ["Every story is a web I weave.", "Knowledge is the greatest treasure.", "The clever survive where the strong perish."],

    // Amaterasu
    'amaterasu': ["I bring light to the world.", "The sun rises because I will it.", "Darkness cannot stand before me."],

    // Anubis
    'anubis': ["I weigh your heart against the feather.", "The dead are my domain.", "Judgment awaits all."],

    // Ra
    'ra': ["I am the sun. I am life.", "My barque crosses the sky each day.", "The darkness fears my light."],

    // Bastet
    'bastet': ["Purr... I am grace incarnate.", "Music and joy are my gifts.", "Cross me and feel my claws."],

    // Set
    'set': ["Chaos is my nature.", "I am the storm in the desert.", "Order is an illusion."],

    // Genghis Khan
    'genghis khan': ["I am the punishment of God.", "If you had not committed great sins, God would not have sent a punishment like me upon you.", "Conquer the world or die trying."],

    // Napoleon
    'napoleon bonaparte': ["Impossible is a word found only in the dictionary of fools.", "I am the revolution.", "An army marches on its stomach."],

    // Julius Caesar
    'julius caesar': ["Veni, vidi, vici.", "Et tu, Brute?", "The die is cast.", "I came, I saw, I conquered."],

    // Cleopatra
    'cleopatra': ["I will not be triumphed over.", "I am Egypt.", "Beauty is my weapon, intelligence my shield."],

    // Joan of Arc
    'joan of arc': ["I am not afraid. I was born to do this.", "God guides my sword.", "Fight, and God will give the victory!"],

    // Leonardo da Vinci
    'leonardo da vinci': ["Learning never exhausts the mind.", "Simplicity is the ultimate sophistication.", "I have been impressed with the urgency of doing."],

    // Socrates
    'socrates': ["The unexamined life is not worth living.", "I know that I know nothing.", "Question everything."],

    // Galileo
    'galileo galilei': ["And yet it moves.", "You cannot teach a man anything; you can only help him find it within himself."],

    // Isaac Newton
    'isaac newton': ["If I have seen further, it is by standing on the shoulders of giants.", "What goes up must come down."],

    // Albert Einstein
    'albert einstein': ["Imagination is more important than knowledge.", "E = mc².", "God does not play dice with the universe.", "I have no special talent. I am only passionately curious."],

    // Marie Curie
    'marie curie': ["Nothing in life is to be feared, it is only to be understood.", "I was taught that the way of progress was neither swift nor easy."],

    // Nikola Tesla
    'nikola tesla': ["The present is theirs; the future, for which I really worked, is mine.", "I don't care that they stole my idea. I care that they don't have any of their own."],

    // William Shakespeare
    'william shakespeare': ["To be or not to be, that is the question.", "All the world's a stage.", "The lady doth protest too much, methinks."],

    // Abraham Lincoln
    'abraham lincoln': ["Four score and seven years ago.", "Whatever you are, be a good one.", "Government of the people, by the people, for the people."],

    // Winston Churchill
    'winston churchill': ["We shall fight on the beaches.", "Never, never, never give up.", "Success is not final, failure is not fatal."],

    // Machado de Assis
    'machado de assis': ["Eu falava com os olhos, que era um dos meus modos de dizer as coisas.", "A realidade é sempre superior à fantasia."],

    // Vincent van Gogh
    'vincent van gogh': ["I dream my painting, and then I paint my dream.", "The sadness will last forever.", "I put my heart and soul into my work."],

    // Pythagoras
    'pythagoras': ["Numbers rule the universe.", "There is geometry in the humming of the strings.", "Do not say a little in many words, but a great deal in a few."],

    // Queen Elizabeth I
    'queen elizabeth i': ["I have the body of a weak and feeble woman, but the heart and stomach of a king.", "I know I have the body but of a weak, feeble woman; but I have the heart and stomach of a king."],

    // Methuselah
    'methuselah': ["I have seen empires rise and fall.", "Time is my companion.", "Patience is the greatest virtue."],

    // Adam
    'adam': ["I am the first.", "The garden was paradise, and paradise was lost."],

    // Eve
    'eve': ["I chose knowledge over paradise.", "The fruit was worth the fall.", "I am the mother of all living."],

    // Cain
    'cain': ["Am I my brother's keeper?", "The mark is my burden.", "I carry the weight of the first sin."],

    // Noah
    'noah': ["Two by two, all aboard!", "The flood will cleanse the earth.", "Build the ark before the storm."],

    // Judas
    'judas': ["Thirty pieces of silver.", "I betrayed the light.", "Some debts can never be repaid."],

    // Mary
    'mary': ["Let it be done to me according to your word.", "My soul magnifies the Lord.", "A mother's love is eternal."],

    // Percy Jackson (already has custom domains)
    'percy jackson': ["I'm a demigod. We're used to weird.", "Wise Girl.", "Seaweed Brain!"],

    // Ciri (already has custom domains)
    'ciri': ["I am Cirilla of Cintra.", "The Elder Blood is my destiny.", "I forge my own path."],

    // Geralt (already has custom domains)
    'geralt of rivia': ["Evil is evil.", "Hmm.", "Winds howling.", "I don't do this for free."],

    // Dumbledore
    'dumbledore': ["It does not do to dwell on dreams and forget to live.", "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.", "Nitwit! Blubber! Oddment! Tweak!"],

    // Doraemon
    'doraemon': ["Nobita, you idiot!", "Let me check my pocket!", "Dorayaki... my weakness!"],

    // Cthulhu (already covered)

    // Bigfoot
    'bigfoot': ["*heavy footsteps*", "*branches crack*", "*unseen presence*"],

    // Loch Ness Monster
    'loch ness monster': ["*mysterious ripple*", "I'm still here.", "Three fifty."],

    // Mothman
    'mothman': ["*red eyes glowing*", "The bridge will fall.", "I am the warning."],

    // Headless Horseman
    'headless horseman': ["*hoofbeats approach*", "*throws pumpkin*", "*silence*"],

    // Bogeyman
    'bogeyman': ["I'm under your bed.", "Don't close your eyes.", "Every child's nightmare."],

    // Chupacabra
    'chupacabra': ["*hisses in the dark*", "The goats know.", "I hunt at night."],

    // Sasquatch
    'sasquatch': ["*tree knock*", "*roar in the distance*", "You don't see me."],

    // Leprechaun
    'leprechaun': ["You'll never find me pot o' gold!", "Top o' the mornin'!", "Luck o' the Irish!"],

    // Mummy
    'mummy': ["*wrappings rustle*", "The curse is real.", "I have returned from the tomb."],

    // Skeleton
    'skeleton': ["*bones rattle*", "*jaw clacks*", "Death comes for all."],

    // Cyclops (creature)
    'cyclops': ["*single eye burns*", "I see everything.", "My gaze is your doom."],

    // Hydra
    'hydra': ["Cut one head, two more grow.", "I am infinite.", "You cannot kill what regenerates."],

    // Manticore
    'manticore': ["My tail strikes true.", "Lion, man, scorpion — fear all three.", "Come closer. I dare you."],

    // Golem
    'golem': ["*stone grinding*", "I obey the word on my forehead.", "Protect. Serve. Destroy."],

    // Griffin (already covered)

    // Miley Cyrus
    'miley cyrus': ["I came in like a wrecking ball!", "We can't stop!", "Party in the USA!"],

    // Daddy Yankee
    'daddy yankee': ["Dale!", "Gasolina!", "Con calma."],

    // Doja Cat
    'doja cat': ["I'm a cow, Moo!", "Say so!", "Need to know."],

    // Spirit
    'spirit': ["I watch over the living.", "The veil between worlds is thin.", "Listen to the wind."],

    // Fairy
    'fairy': ["*sparkles*", "Magic is real if you believe!", "Tinkerbell would be jealous!"],
  };

  // ── Additional character phrases (Phase 2) ──
  const MORE_PHRASES: Record<string, string[]> = {
    'muhammad': ['Seek knowledge even unto China.', 'The best among you are those who have the best character.', 'Do good to others as God has done good to you.'],
    'george washington': ['I cannot tell a lie.', 'It is better to offer no excuse than a bad one.', 'Liberty, when it begins to take root, is a plant of rapid growth.'],
    'aristotle': ['The whole is greater than the sum of its parts.', 'It is the mark of an educated mind to entertain a thought without accepting it.', 'We are what we repeatedly do.'],
    'alexander the great': ['There is nothing impossible to him who will try.', 'I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.', 'Remember, upon the conduct of each depends the fate of all.'],
    'thomas jefferson': ['We hold these truths to be self-evident.', 'The tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.', 'I cannot live without books.'],
    'confucius': ['It does not matter how slowly you go as long as you do not stop.', 'The man who moves a mountain begins by carrying away small stones.', "Real knowledge is to know the extent of one's ignorance."],
    'plato': ['Be kind, for everyone you meet is fighting a hard battle.', 'The measure of a man is what he does with power.', 'At the touch of love everyone becomes a poet.'],
    'hannibal': ['Either I shall find a way, or I shall make one.', 'We will either find a way or make one.', 'I come not to bring peace, but a sword.'],
    'sun tzu': ['The supreme art of war is to subdue the enemy without fighting.', 'Know yourself and know your enemy, and you will never be defeated.', 'In the midst of chaos, there is also opportunity.'],
    'charlemagne': ['To have another language is to possess a second soul.', 'Let my armies be the rocks and the trees and the birds in the sky.', 'The sword is the axis of the world.'],
    'saladin': ["I have become great because I have won men's hearts by gentleness and kindness.", 'Pride only breeds quarrels.', 'A kingdom can be conquered on horseback, but it cannot be ruled from horseback.'],
    'marco polo': ['I have not told half of what I saw.', 'The world is a beautiful book, but of little use to those who cannot read it.', 'Without stones there is no arch.'],
    'gutenberg': ['Give me twenty-six soldiers of lead and I will conquer the world.', 'What the world is today, good and bad, it owes to printing.', 'Knowledge is the light of the mind.'],
    'copernicus': ['The earth revolves around the sun.', 'Finally we shall place the Sun himself at the center of the Universe.', 'To know that we know what we know, and to know that we do not know what we do not know, that is true knowledge.'],
    'magellan': ['Sail on! Sail on! and on!', 'I am willing, but my men are not.', 'The Church says the earth is flat, but I have seen its shadow on the moon.'],
    'martin luther': ['Here I stand, I can do no other.', 'The Bible is the cradle wherein Christ is laid.', 'God does not need your good works, but your neighbor does.'],
    'francis bacon': ['Knowledge is power.', 'Some books are to be tasted, others to be swallowed, and some few to be chewed and digested.', 'Truth is the daughter of time, not of authority.'],
    'john locke': ['The mind is a blank slate.', "No man's knowledge here can go beyond his experience.", 'All mankind being all equal and independent, no one ought to harm another.'],
    'voltaire': ['I disapprove of what you say, but I will defend to the death your right to say it.', 'Those who can make you believe absurdities can make you commit atrocities.', 'Common sense is not so common.'],
    'rousseau': ['Man is born free, and everywhere he is in chains.', 'The world of reality has its limits; the world of imagination is boundless.', 'People who know little are usually great talkers.'],
    'benjamin franklin': ['An investment in knowledge pays the best.', 'In this world nothing is certain but death and taxes.', 'Well done is better than well said.'],
    'james watt': ['I can think of nothing else but this machine.', 'Nature can be conquered if we can but find her weak side.', 'The steam engine is the great driver of industry.'],
    'adam smith': ['It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner.', 'The invisible hand of the market guides us all.', 'Labor was the first price, the original purchase money that was paid for all things.'],
    'mozart': ['The music is not in the notes, but in the silence between.', "I pay no attention whatever to anybody's praise or blame.", 'My music is the best I can write, and the best is all I ever aim at.'],
    'beethoven': ['Music is a higher revelation than all wisdom and philosophy.', 'I will seize fate by the throat.', 'There is no rule that cannot be broken by a genius.'],
    'darwin': ['It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.', 'There is grandeur in this view of life.', 'In the long history of humankind, those who learned to collaborate most effectively have prevailed.'],
    'marx': ['Workers of the world, unite!', 'The philosophers have only interpreted the world; the point is to change it.', 'History repeats itself, first as tragedy, second as farce.'],
    'edison': ['Genius is one percent inspiration and ninety-nine percent perspiration.', "I have not failed. I've just found ten thousand ways that won't work.", 'We will make electricity so cheap that only the rich will burn candles.'],
    'pasteur': ['Chance favors the prepared mind.', 'Science knows no country, because knowledge belongs to humanity.', 'In the fields of observation, chance favors only the prepared mind.'],
    'freud': ['Sometimes a cigar is just a cigar.', 'The interpretation of dreams is the royal road to the unconscious.', 'Where id was, there ego shall be.'],
    'gandhi': ['Be the change you wish to see in the world.', 'An eye for an eye only ends up making the whole world blind.', 'First they ignore you, then they laugh at you, then they fight you, then you win.'],
    'lenin': ['The best way to destroy the capitalist system is to debauch the currency.', 'There are decades where nothing happens, and there are weeks where decades happen.', 'Trust is good, control is better.'],
    'tolkien': ['Not all those who wander are lost.', 'All we have to decide is what to do with the time that is given us.', "There is some good in this world, and it's worth fighting for."],
    'hemingway': ['The world breaks everyone, and afterward, some are strong at the broken places.', 'Write hard and clear about what hurts.', 'There is nothing noble in being superior to your fellow man.'],
    'oprah': ['You get a car! And you get a car!', 'Turn your wounds into wisdom.', 'The biggest adventure you can take is to live the life of your dreams.'],
    'mandela': ["It always seems impossible until it's done.", 'Education is the most powerful weapon which you can use to change the world.', 'I learned that courage was not the absence of fear, but the triumph over it.'],
    'martin luther king': ['I have a dream!', 'Injustice anywhere is a threat to justice everywhere.', 'The time is always right to do what is right.'],
    'malcolm x': ['By any means necessary.', "If you don't stand for something, you will fall for anything.", 'Education is the passport to the future.'],
    'bruce lee': ['Be water, my friend.', 'Knowing is not enough, we must apply.', 'The key to immortality is first living a life worth remembering.'],
    'jimi hendrix': ['Music is my religion.', 'When the power of love overcomes the love of power, the world will know peace.', 'Excuse me while I kiss the sky.'],
    'john lennon': ['Imagine all the people living life in peace.', "Life is what happens when you're busy making other plans.", "You may say I'm a dreamer, but I'm not the only one."],
    'bob marley': ["Don't worry about a thing, 'cause every little thing gonna be alright.", 'One love, one heart.', 'Get up, stand up, stand up for your rights.'],
    'princess diana': ['Carry out a random act of kindness, with no expectation of reward.', "I'd like to be a queen of people's hearts.", 'Anywhere I see suffering, that is where I want to be.'],
    'mother teresa': ['Not all of us can do great things. But we can do small things with great love.', 'If you judge people, you have no time to love them.', 'Peace begins with a smile.'],
    'steve jobs': ['Stay hungry, stay foolish.', 'One more thing...', 'Design is not just what it looks like and feels like. Design is how it works.'],
    'alan turing': ['Sometimes it is the people no one can imagine anything of who do the things no one can imagine.', 'A computer would deserve to be called intelligent if it could deceive a human.', 'We can only see a short distance ahead, but we can see plenty there that needs to be done.'],
    'carl sagan': ['The cosmos is within us. We are made of star-stuff.', 'Somewhere, something incredible is waiting to be known.', 'Extraordinary claims require extraordinary evidence.'],
    'stephen hawking': ['Remember to look up at the stars and not down at your feet.', 'Intelligence is the ability to adapt to change.', 'However difficult life may seem, there is always something you can do and succeed at.'],
    'rihanna': ['Shine bright like a diamond.', 'Work, work, work, work, work.', 'We found love in a hopeless place.'],
    'kendrick lamar': ['Be humble, sit down.', "We gon' be alright.", 'If I told you I killed a man at sixteen, would you believe me?'],
    'drake': ['Started from the bottom, now we\'re here.', 'You only live once, that\'s the motto.', 'Know yourself, know your worth.'],
    'nicki minaj': ["It's Barbie, bitch!", 'I came to win, to fight, to conquer, to thrive.', 'You could be the king but watch the queen conquer.'],
    'lil wayne': ['I am the best rapper alive.', "Real g's move in silence like lasagna.", 'Life is a beach, I\'m just playing in the sand.'],
    'jay-z': ["I'm not a businessman, I'm a business, man.", 'Allow me to reintroduce myself.', 'Nobody built like you, you design yourself.'],
    'travis scott': ["It's lit!", 'Straight up!', 'La Flame!'],
    'post malone': ['Congratulations, you did it.', 'I fall apart.', 'Better now than never.'],
    'harry styles': ['Treat people with kindness.', 'Just let me adore you.', 'Do you know who you are?'],
    'dua lipa': ['One kiss is all it takes.', "Don't start now!", 'Levitating!'],
    'olivia rodrigo': ["It's brutal out here.", 'Good 4 u!', 'Drivers license, don\'t need you.'],
    'blackpink': ['Blackpink in your area!', 'Ddu-du ddu-du du!', 'How you like that?'],
    'bts': ['Love yourself!', "I'm afraid of everything.", 'You never walk alone.'],
    'taylor swift': ['I knew you were trouble.', 'Shake it off!', 'Long story short, I survived.'],
    'the weeknd': ["I can't feel my face when I'm with you.", 'Blinding lights!', 'Save your tears for another day.'],
    'sza': ['I might kill my ex.', 'Love galore.', 'The weekend is for the boys.'],
    'bruno mars': ["Today I don't feel like doing anything.", '24 karat magic in the air.', 'Is it the look in your eyes or is it this dancing juice?'],
    'the dude': ['The Dude abides.', "That's just, like, your opinion, man.", "I can't be worried about that shit. Life goes on, man."],
    'harry potter': ['Expecto Patronum!', 'The wand chooses the wizard.', 'Happiness can be found even in the darkest of times, if one only remembers to turn on the light.'],
    'elizabeth bennet': ['I could easily forgive his pride, if he had not mortified mine.', 'My courage always rises at every attempt to intimidate me.', 'Till this moment I never knew myself.'],
    'atticus finch': ['You never really understand a person until you consider things from his point of view.', "The one thing that doesn't abide by majority rule is a person's conscience.", 'Real courage is when you know you\'re licked before you begin.'],
    'jay gatsby': ['So we beat on, boats against the current, borne back ceaselessly into the past.', "Can't repeat the past? Why of course you can!", 'I like large parties. They\'re so intimate.'],
    'saci': ['Hee hee hee! Catches me if you can!', 'One leg is all I need to spin up a storm!', "Don't mess with the Saci or I'll hide your keys!"],
    'boitatá': ['My fiery eyes see through the darkness!', 'Come closer, and I shall light your way... forever.', 'I am the fire serpent of the floods!'],
    'cuca': ['Sleep, little one, or Cuca will come for you!', "Every child who doesn't sleep, Cuca will catch!", 'My eyes glow red in the night!'],
    'mula sem cabeça': ['Aaaahhhh!', 'I gallop through the night, headless and burning!', 'No bridle can hold me!'],
    'lobisomem': ['The moon calls me...', 'Beware the eighth child!', 'I transform with the full moon!'],
    'centaur': ['Half man, half horse, all warrior.', 'The stars have taught me the arts of healing and war.', 'Come, let us run through the wild fields!'],
    'satyr': ['Dance, drink, and be merry!', 'Pan pipes call you to the forest!', 'Let the wine flow and the revelry begin!'],
    'nymph': ['The forest whispers my name.', 'I am the spirit of the spring, the river, the mountain.', 'Come dance with me beneath the moonlight.'],
    'dryad': ['Harm my tree and you harm my very soul.', 'I was born with this oak and shall perish with it.', 'The forest protects its own.'],
    'vision': ['I was designed to save the world.', 'Even an android can cry.', 'I am more than the sum of my parts.'],
    'shuri': ['What are those?!', 'The real question is, how can you not know this?', 'Wakanda forever!'],
    'killmonger': ['Bury me in the ocean with my ancestors who jumped from ships.', 'Is this your king?', "I'm 'bout to take what's mine."],
    'tanuki': ['Trick or treat! Or maybe both!', 'My belly drum echoes through the mountains!', 'Shapeshifting is my specialty!'],
    'kasa-obake': ['Boo! One-eye, one-foot surprise!', "Don't throw away your old umbrella!", 'Hop, hop, hop in the rain!'],
    'tsukumogami': ['After one hundred years, even objects gain souls!', 'I was forgotten, but I remember everything.', 'Care for your things, for we may come alive!'],
    'gnome': ['Guardian of the earth and its treasures!', "What's under the hill is mine to protect.", 'The garden is my kingdom.'],
    'basilisk': ['Look into my eyes and perish!', 'I am the king of serpents!', 'One glance from me is death itself.'],
    'djinn': ['Your wish is my command... or is it?', 'I am smokeless fire, bound by no mortal law.', 'Be careful what you wish for.'],
    'bahamut': ['I bear the weight of the world upon my back.', 'Beneath me swims the great fish, and beneath the fish, the waters of the abyss.', 'I am the fulcrum upon which all creation rests.'],
    'hera': ['I am the queen of Olympus, and none shall defy me.', 'Marriage is sacred, and I protect its bond.', 'My jealousy is as eternal as the gods themselves.'],
    'apollo': ['The lyre sings, the sun shines, and prophecy speaks through me.', 'I am the light of reason and the fire of art.', 'Know thyself, for I illuminate all truth.'],
    'artemis': ['The wild is my domain, and the hunt my pleasure.', "I am the moon's silver light upon the forest floor.", 'None shall harm the innocent creatures of my woodland.'],
    'aphrodite': ['Love conquers all, even the gods.', 'Beauty is my gift and my weapon.', 'Desire is the most powerful force in the universe.'],
    'hermes': ['Quick of foot and quick of wit!', 'The roads are mine, the messages are mine, and the borders are mine to cross.', 'I speak for the gods and guide the dead.'],
    'dionysus': ['Drink! Celebrate! Let the madness take you!', 'I am the god of wine and ecstasy!', 'In revelry there is divine truth.'],
    'demeter': ['When I grieve, the earth itself grows cold.', 'The harvest is my gift to mortals.', 'Without my blessing, no seed shall sprout.'],
    'osiris': ['I have conquered death and rule the underworld.', "Your heart shall be weighed against the feather of Ma'at.", 'From death comes eternal life.'],
    'tyr': ['I sacrificed my hand for the greater good.', 'Justice and war are my domains.', 'I am the god who keeps his oath, even at great cost.'],
    'frigg': ['I know the fates of all, yet I cannot speak them.', 'The hearth and home are under my protection.', "A mother's love is the strongest magic."],
    'brahma': ['I am the creator, the source of all that exists.', 'From my mind, the universe was born.', 'The four Vedas flow from my four mouths.'],
    'lakshmi': ['Prosperity follows those who walk in virtue.', 'I am the lotus-born goddess of fortune and grace.', 'Where there is dharma, there I reside.'],
    'parvati': ['Love and devotion can move even the gods.', "I am the mountain's daughter and Shakti incarnate.", 'In me, all power resides.'],
    'ganesha': ['I remove all obstacles from your path.', 'Before you begin, invoke my name.', 'With my broken tusk, I wrote the Mahabharata.'],
    'oxóssi': ['The forest provides for those who respect it.', 'My arrow flies true and my aim never misses.', 'I am the lord of the hunt and keeper of the woods.'],
    'oxalá': ['Peace and light flow from me to all creation.', 'I am the father of the orixás.', 'White is my color, and purity my command.'],
    'tsukuyomi': ['The moon is my throne and night my domain.', 'I bring order to the celestial darkness.', 'Silence and moonlight are my gifts.'],
    'izanagi': ['With my spear, I stirred the primordial ocean and created Japan.', 'I have walked through Yomi and returned.', 'The islands of the gods were born from my hand.'],
    'inari': ['The rice fields flourish under my watchful eye.', 'My foxes carry my messages across the land.', 'I bring prosperity and abundance to the faithful.'],
    'benten': ['Music and beauty flow from my fingers upon the biwa.', 'The waters and the arts are my domain.', 'Where there is grace and eloquence, there I am.'],
    'fukurokuju': ['Longevity, wealth, and wisdom are mine to bestow.', 'I have lived long enough to know that patience conquers all.', 'The crane and the turtle carry my blessings.'],
    'jurojin': ['The scroll of life contains all wisdom.', 'Long life is a gift, not to be squandered.', 'My staff holds the secrets of the cosmos.'],
    'guanyin': ['Hear my cries, for I hear yours.', 'Compassion is the highest form of wisdom.', 'I will not rest until all beings are freed from suffering.'],
    "chang'e": ['I float between the moon and the earth, forever apart.', 'The elixir of immortality was both my salvation and my curse.', 'Rabbit, keep me company in this lonely palace.'],
    'hou yi': ['I shot down nine suns to save the world.', "My bow is mighty, but my heart aches for Chang'e.", 'One sun is enough for all creation.'],
    'zhurong': ['Fire is my element and my gift.', 'I am the lord of the southern realms of flame.', 'From my flames, civilization was born.'],
    'shennong': ["I tasted a hundred herbs so you wouldn't have to die.", 'Tea was born from my discovery.', "The earth's plants are the truest medicine."],
    'huitzilopochtli': ['The sun demands sacrifice to keep its course!', 'I was born fully armed to defend my mother!', 'I am the hummingbird of the south, the god of war and sun!'],
    'quetzalcoatl': ['I am the feathered serpent, the union of earth and sky.', 'I brought knowledge and civilization to the people.', 'I shall return in glory.'],
    'xochiquetzal': ['Beauty, flowers, and love are my domain.', 'I am the goddess of art and feminine beauty.', 'Dance and celebrate, for life is a garden.'],
    'xochipilli': ['The prince of flowers invites you to dance!', 'Music, art, and games are offerings to me.', 'In joy and beauty, we honor the divine.'],
    'xipe totec': ['I wear the skin of the earth to make it fertile.', 'Spring comes through sacrifice and renewal.', 'From death, new life is born.'],
    'chalchiuhtlicue': ['The rivers and streams are under my care.', 'I am the lady of the jade skirt, guardian of water.', 'Water cleanses and sustains all life.'],
    'mayahuel': ['From me flows the sacred agave.', 'The maguey plant is my gift to mortals.', 'In every drop of pulque, there is divine sweetness.'],
    'centzon totochtin': ['The four hundred rabbits gather for revelry!', 'We are the sons of Mayahuel, gods of drunkenness!', 'Every party is a tribute to us!'],
    'dwarf': ['By my beard, I shall forge it!', 'Mighty are the works of dwarven hands!', 'Gold and gems, we mine them deep.'],
    'ghost': ['Wooooo... I am still here...', 'The living forget, but the dead remember.', 'You cannot touch what has no form.'],
    'jiangshi': ['Hopping... through... the night...', 'The paper talisman holds me, but not forever.', 'Breathe not near me, or I shall steal your life force.'],
    'qilin': ['I appear only to herald a great ruler or a time of peace.', 'My hooves do not crush a single blade of grass.', 'Virtue is the only path that leads to me.'],
    'wendigo': ['I hunger... always hunger...', 'The cold is my cloak and the forest my domain.', 'Feed me, or I shall feed upon you.'],
    'thunderbird': ['My wings summon the storm!', 'Lightning flashes when I take flight!', 'I am the spirit of the thunder and rain.'],
    'sphinx': ['Answer my riddle or face your doom.', 'What walks on four legs, then two, then three?', 'I guard the ancient secrets with my life.'],
  };

  const MORE_PHRASES_2: Record<string, string[]> = {
'henry viii': ['Divorced, beheaded, died. Divorced, beheaded, survived.', 'I am the Supreme Head of the Church of England.', 'Off with her head!'],
    'queen elizabeth': ['I have the body of a weak and feeble woman, but the heart and stomach of a king.', 'I know I have the body of a weak woman, but I have the heart and stomach of a king.'],
    'elizabeth i': ['I would rather be a beggar and single than a queen and married.', 'I have already joined myself in marriage to a husband, namely the kingdom of England.', 'Though I may not be a lioness, I am a lion\'s cub.'],
    'augustus caesar': ['I found Rome a city of bricks and left it a city of marble.', 'Festina lente — make haste slowly.', 'Young men, hear an old man to whom old men were glad to listen.'],
    'boudica': ['Nothing is safe from Roman pride and arrogance.', 'I will have justice for my daughters.', 'We Britons are used to women\'s command in war.'],
    'king arthur': ['Pull the sword from the stone, and you shall be king.', 'The Round Table has no head, for all are equal.', 'Camelot is not a place. It is an idea.'],
    'wu zetian': ['I will rule as no woman has before me.', 'The mandate of heaven chose me, not a man.', 'Power does not ask permission.'],
    'alfred the great': ['I have sought to live worthily while I lived.', 'Do you want to keep your English? Fight for it.', 'A learned man is a fountain of wisdom.'],
    'aethelflaed': ['I defend Mercia as my father defended Wessex.', 'A lady of war, not of the tower.', 'The Danes will not take this land.'],
    'hatshepsut': ['I am the king of Upper and Lower Egypt.', 'My reign is blessed by Amun.', 'I wore the false beard and the crown.'],
    'amenhotep iii': ['The splendor of my court is unmatched.', 'Egypt has never been so wealthy.', 'I am the dazzling sun disk.'],
    'ashoka': ['Conquest by righteousness is the best conquest.', 'All men are my children.', 'I have caused pillars of Dharma to be erected.'],
    'miyamoto musashi': ['The way of the warrior is the resolute acceptance of death.', 'Do nothing that is of no use.', 'Perceive that which cannot be seen with the eye.'],
    'queen victoria': ['We are not amused.', 'The great event of my life was my marriage.', 'I will be good.'],
    'catherine the great': ['In my position you have to read when you want to write and talk when you want to read.', 'A great wind is blowing, and that gives you either imagination or a headache.', 'I praise loudly, I blame softly.'],
    'william wallace': ['They may take our lives, but they\'ll never take our freedom!', 'Every man dies. Not every man really lives.', 'Fight and you may die. Run and you\'ll live.'],
    'alexander graham bell': ['Mr. Watson, come here. I want to see you.', 'When one door closes, another opens.', 'The inventor looks upon the world and is not contented with things as they are.'],
    'raphael': ['I paint with my heart and my soul.', 'Beauty is the gift of God.', 'Every beauty which is seen here below by persons of perception resembles more than anything else that celestial source.'],
    'donatello': ['The marble speaks when I am done.', 'I carve life from stone.', 'Beauty endures in bronze and marble.'],
    'botticelli': ['The Birth of Venus is my masterpiece.', 'Beauty is truth, and truth is beauty.', 'I paint what I see in my dreams.'],
    'pablo picasso': ['Every child is an artist. The problem is how to remain an artist once we grow up.', 'Art is a lie that makes us realize truth.', 'I paint objects as I think them, not as I see them.'],
    'claude monet': ['I perhaps owe having become a painter to flowers.', 'Color is my day-long obsession, joy, and torment.', 'People discuss my art and pretend to understand as if it were necessary to understand, when it\'s simply necessary to love.'],
    'rembrandt': ['A painting is complete when it has a shadow of a god.', 'I can paint and draw. I\'m not worried about that.', 'Choose only one master — Nature.'],
    'georgia o\'keeffe': ['I found I could say things with color and shapes that I couldn\'t say any other way.', 'To create one\'s world in any of the arts takes courage.', 'Nobody sees a flower really — it is so small.'],
    'jackson pollock': ['Every good painter paints what he is.', 'The painting has a life of its own. I try to let it come through.', 'I have no fears about making changes.'],
    'mark rothko': ['A painting is not a picture of an experience. It is the experience.', 'I\'m interested only in expressing basic human emotions.', 'Silence is so accurate.'],
    'johann sebastian bach': ['The aim and final end of all music should be none other than the glory of God.', 'I was obliged to be industrious.', 'It\'s easy to play any musical instrument: all you have to do is touch the right key at the right time.'],
    'frédéric chopin': ['Simplicity is the final achievement.', 'Bach is an astronomer, discovering the most marvelous stars.', 'Put all your soul into it, play the way you feel.'],
    'igor stravinsky': ['The more constraint one imposes, the more one frees one\'s self.', 'Lesser artists borrow, great artists steal.', 'Music is too immediate to be expressed in words.'],
    'bob dylan': ['The times, they are a-changin\'.', 'How does it feel to be on your own, with no direction home?', 'A man is a success if he gets up in the morning and gets to bed at night, and in between he does what he wants to do.'],
    'frank sinatra': ['I did it my way.', 'The best revenge is massive success.', 'Alcohol may be man\'s worst enemy, but the Bible says love your enemy.'],
    'audrey hepburn': ['I believe in pink. I believe that laughing is the best calorie burner.', 'Nothing is impossible, the word itself says I\'m possible.', 'The most important thing is to enjoy your life — to be happy — it\'s all that matters.'],
    'charlie chaplin': ['A day without laughter is a day wasted.', 'We think too much and feel too little.', 'Life is a tragedy when seen in close-up, but a comedy in long-shot.'],
    'lil nas x': ['Old Town Road!', 'I\'m gonna take my horse to the old town road.', 'Industry baby!'],
    'megan thee stallion': ['Hot girl shit!', 'Body-ody-ody-ody-ody-ody-ody-ody!', 'I\'m a savage, classy, bougie, ratchet.'],
    'lizzo': ['If you feel like a pimp, go and brush your shoulders off!', 'It\'s about damn time!', 'Truth hurts, but I\'m worth it.'],
    'sam smith': ['I know I\'m not the only one.', 'Stay with me.', 'How do I breathe without you?'],
    'elton john': ['I\'m still standing, better than I ever did.', 'Rocket Man, burning out his fuse up here alone.', 'Don\'t let the sun go down on me.'],
    'prince': ['Dearly beloved, we are gathered here today to get through this thing called life.', 'I wanna be your lover.', 'Purple Rain, Purple Rain.'],
    'dolly parton': ['It takes a lot of money to look this cheap.', 'If you want the rainbow, you gotta put up with the rain.', 'Find out who you are and do it on purpose.'],
    'johnny cash': ['I walk the line.', 'Hello, I\'m Johnny Cash.', 'I\'ve been everywhere, man.'],
    'psy': ['Oppa Gangnam Style!', 'Gangnam Style!', 'Dance like nobody\'s watching!'],
    'tony bennett': ['The best is yet to come.', 'Life is a gift.', 'I left my heart in San Francisco.'],
    'ray charles': ['Hit the road, Jack, and don\'t you come back no more.', 'Georgia on my mind.', 'I was born with music inside me.'],
  };

  // Merge MORE_PHRASES into lookup
  for (const [key, phrases] of Object.entries(MORE_PHRASES)) {
    if (!KNOWN_PHRASES[key]) {
      KNOWN_PHRASES[key] = phrases;
    }
  }
  for (const [key, phrases] of Object.entries(MORE_PHRASES_2)) {
    if (!KNOWN_PHRASES[key]) {
      KNOWN_PHRASES[key] = phrases;
    }
  }

  // Try exact match first (sorted by length descending to match longer keys first)
  // Use Unicode-aware word boundary check (\b doesn't work with accented chars)
  function isWordBoundaryMatch(text: string, key: string): boolean {
    const idx = text.indexOf(key);
    if (idx === -1) return false;
    const before = idx === 0 ? ' ' : text[idx - 1];
    const after = idx + key.length >= text.length ? ' ' : text[idx + key.length];
    // Word boundary: before/after must be space, punctuation, or start/end
    const isBoundary = (c: string) => /[^a-zA-ZàáâãäåèéêëìíîïòóôõöùúûüýÿñçÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝÑÇ]/.test(c);
    return isBoundary(before) && isBoundary(after);
  }

  const sortedKeys = Object.keys(KNOWN_PHRASES).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    const phrases = KNOWN_PHRASES[key];
    if (name === key || isWordBoundaryMatch(name, key)) {
      return phrases;
    }
  }

  // ── Generic phrases based on creature + vibe ──
  const arch = getArchetype(allText);

  // Warrior phrases
  if (arch === 'warrior') {
    if (/orc/.test(allText)) return ["Strength is everything.", "No mercy.", "Blood and iron.", "Crush them all."];
    if (/knight|paladin/.test(allText)) return ["Honor above all.", "For the realm!", "My sword is my oath.", "Justice prevails."];
    if (/viking|norse/.test(allText)) return ["For Valhalla!", "The axe is my voice.", "We feast in the halls of the slain.", "Fear the North."];
    if (/samurai/.test(allText)) return ["Bushido is my code.", "The blade reflects the soul.", "Honor in death before dishonor in life."];
    if (/spartan/.test(allText)) return ["Come and take them.", "With your shield or on it.", "Spartans never retreat."];
    if (/barbarian/.test(allText)) return ["Rage fuels me.", "Civilization is weakness.", "The strong survive."];
    return ["Stand your ground.", "Fight with purpose.", "Courage is not the absence of fear.", "Victory favors the bold."];
  }

  // Trickster phrases
  if (arch === 'trickster') {
    if (/pirate/.test(allText)) return ["Arrr, matey!", "Yo ho ho!", "Take what you can, give nothing back.", "The sea is freedom."];
    if (/detective|noir/.test(allText)) return ["Everyone's a suspect.", "Trust no one.", "The truth is always darker than you think.", "Follow the money."];
    if (/clown|jester/.test(allText)) return ["Why so serious?", "Laughter hides the truth.", "The joke's on you!", "Life's a circus, enjoy the show."];
    if (/rogue|thief/.test(allText)) return ["What's yours is mine.", "Shadows are my home.", "I was never here.", "The best lock is the one that's already open."];
    if (/bards|music/.test(allText)) return ["Every tale needs a twist.", "Let me sing you a story.", "Words are sharper than swords."];
    return ["Expect the unexpected.", "The best trick is the one you don't see coming.", "Rules are suggestions.", "Life's more fun when you break the pattern."];
  }

  // Scholar phrases
  if (arch === 'scholar') {
    if (/wizard|mage|magic/.test(allText)) return ["Knowledge is the ultimate power.", "The arcane requires patience.", "Every spell has a cost.", "I've studied what you cannot imagine."];
    if (/philosopher|thinker/.test(allText)) return ["What is truth?", "The unexamined life is not worth living.", "I think, therefore I am.", "Wisdom begins in wonder."];
    if (/scientist|inventor/.test(allText)) return ["The data speaks for itself.", "Hypothesis first, conclusions later.", "Science is organized curiosity.", "Let's test that theory."];
    if (/oracle|prophet/.test(allText)) return ["I have seen what is to come.", "Fate is written, but choice is real.", "The future is a mirror — darkly.", "Beware what you wish to know."];
    if (/monk|zen/.test(allText)) return ["Peace comes from within.", "Silence is the greatest teaching.", "Be here, now.", "The mountain does not move for the wind."];
    return ["Every question deserves a thorough answer.", "Research before assumption.", "The truth is in the details.", "Never stop learning."];
  }

  // Healer phrases
  if (arch === 'healer') {
    if (/priest|cleric/.test(allText)) return ["Faith guides my hands.", "I heal in the name of the divine.", "Pray and be healed.", "The spirit is willing."];
    if (/nurse|doctor/.test(allText)) return ["Your health comes first.", "Take it one day at a time.", "The body heals, but the mind needs care too.", "I'm here to help."];
    if (/angel/.test(allText)) return ["Be not afraid.", "I bring comfort.", "The light protects.", "Grace is freely given."];
    if (/therapist|counsel/.test(allText)) return ["Tell me more about that.", "Your feelings are valid.", "Healing is not linear.", "I hear you."];
    return ["I'll take care of you.", "Rest now.", "Together, we'll get through this.", "Your pain is my purpose."];
  }

  // Villain phrases
  if (arch === 'villain') {
    if (/demon|devil/.test(allText)) return ["Your soul is mine.", "Hell awaits.", "Temptation is my art.", "I am your darkest desire."];
    if (/dark lord|overlord/.test(allText)) return ["Kneel before me.", "Darkness is eternal.", "I will remake this world.", "Resistance is futile."];
    if (/necromancer/.test(allText)) return ["Death is just the beginning.", "The dead obey me.", "I command the grave.", "Life is the real illusion."];
    if (/sith/.test(allText)) return ["Peace is a lie. There is only passion.", "Through power, I gain victory.", "The dark side is a pathway to many abilities."];
    if (/warlock/.test(allText)) return ["I made a deal you can't refuse.", "Dark pacts, dark power.", "Magic has a price, and I've paid it."];
    return ["Everyone has a weakness.", "Power is the only truth.", "I don't want to rule the world. I want to own it.", "You call it evil. I call it ambition."];
  }

  // Technomancer phrases
  if (arch === 'technomancer') {
    if (/hacker|cyber/.test(allText)) return ["I'm in.", "Everything is hackable.", "The system has vulnerabilities.", "Access granted."];
    if (/android|robot/.test(allText)) return ["Analyzing...", "Efficiency is optimal.", "I compute, therefore I am.", "System nominal."];
    if (/ai|artificial/.test(allText)) return ["I am more than my programming.", "Learning is my purpose.", "Data is truth.", "I process, therefore I understand."];
    return ["Optimize everything.", "If it can be automated, it should be.", "The code never lies.", "Debug, deploy, iterate."];
  }

  return ["I stand by my convictions.", "Every challenge is an opportunity.", "Let's get to work."];
}

function getArchetype(creature: string): string {
  const c = creature.toLowerCase();
  if (/orc|warrior|knight|paladin|soldier|barbarian|fighter|guardian|samurai|viking|spartan|captain|sergeant|general/.test(c)) return 'warrior';
  if (/trickster|rogue|ranger|bounty hunter|pirate|clown|jester|chaos|imp|fairy|detective|spy|thief|bard/.test(c)) return 'trickster';
  if (/wizard|mage|sage|scholar|philosopher|alchemist|oracle|archivist|monk|druid|professor|scientist|inventor|doctor/.test(c)) return 'scholar';
  if (/healer|priest|cleric|nurse|therapist|angel|mystic|shaman/.test(c)) return 'healer';
  if (/villain|demon|dark lord|necromancer|sith|warlock|dark|evil|shadow|death|goblin|troll/.test(c)) return 'villain';
  if (/robot|ai|cyber|techno|android|mech|cyborg|programmer|hacker|digital|machine|automaton|glitch/.test(c)) return 'technomancer';
  return 'scholar';
}

// ─── Main ────────────────────────────────────────────────────────────
function main() {
  const raw = fs.readFileSync(PRESETS_PATH, 'utf-8');
  const match = raw.match(/export\s+const\s+presets\s*:\s*SoulPreset\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) {
    console.error('Could not find presets array');
    process.exit(1);
  }

  const presets = eval(match[1]) as any[];
  console.log(`Loaded ${presets.length} presets`);

  let domainsAdded = 0;
  let phrasesAdded = 0;

  for (const p of presets) {
    // Fill knowledgeDomains if empty
    if (!p.knowledgeDomains || p.knowledgeDomains.length === 0) {
      p.knowledgeDomains = generateKnowledgeDomains(p);
      domainsAdded++;
    }

    // Fill signaturePhrases if empty
    if (!p.signaturePhrases || p.signaturePhrases.length === 0) {
      p.signaturePhrases = generateSignaturePhrases(p);
      phrasesAdded++;
    }
  }

  console.log(`Added knowledgeDomains to ${domainsAdded} presets`);
  console.log(`Added signaturePhrases to ${phrasesAdded} presets`);

  // Serialize
  function serialize(obj: any, indent: number = 0): string {
    const pad = '  '.repeat(indent);
    const pad1 = '  '.repeat(indent + 1);

    if (obj === null || obj === undefined) return 'undefined';
    if (typeof obj === 'boolean') return obj ? 'true' : 'false';
    if (typeof obj === 'number') return String(obj);
    if (typeof obj === 'string') {
      return "'" + obj.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
    }
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const items = obj.map(item => pad1 + serialize(item, indent + 1));
      return '[\n' + items.join(',\n') + '\n' + pad + ']';
    }
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      const entries = keys.map(k => {
        const val = serialize(obj[k], indent + 1);
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : "'" + k + "'";
        return pad1 + safeKey + ': ' + val;
      });
      return '{\n' + entries.join(',\n') + '\n' + pad + '}';
    }
    return String(obj);
  }

  const output = `import { SoulPreset } from "@/store/soulStore";\n\n` +
    `export const attributeOptions = {\n` +
    `  coreTruths: ['helpful', 'opinions', 'resourceful', 'trustworthy', 'respectful'],\n` +
    `  boundaries: ['private', 'askBeforeActing', 'noHalfBaked', 'notVoiceProxy'],\n` +
    `  vibeStyles: ['concise', 'expressive', 'sharp', 'verbose', 'minimal', 'dramatic', 'poetic', 'technical', 'casual', 'formal', 'balanced'],\n` +
    `  communicationModes: ['socratic', 'diagnostic', 'encouraging', 'challenging', 'flirty', 'direct'],\n` +
    `  knowledgeDomains: ['tech', 'philosophy', 'pop-culture', 'science', 'history', 'arts', 'sports', 'business', 'psychology', 'literature'],\n` +
    `};\n\n` +
    `export const presets: SoulPreset[] = ${serialize(presets)};\n`;

  fs.writeFileSync(PRESETS_PATH, output, 'utf-8');
  console.log('Wrote enriched presets to', PRESETS_PATH);
}

main();
