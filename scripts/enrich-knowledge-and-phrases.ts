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

  // Try exact match first (sorted by length descending to match longer keys first)
  const sortedKeys = Object.keys(KNOWN_PHRASES).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    const phrases = KNOWN_PHRASES[key];
    // Use word boundary matching to avoid "ra" matching inside "cleopatra"
    const regex = new RegExp('\\b' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (regex.test(name)) {
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
