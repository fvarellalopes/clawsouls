#!/usr/bin/env node
/**
 * Script to extract presets from data/presets.ts and generate
 * translations for all 7 locales in messages/*.json
 */

const fs = require('fs');
const path = require('path');

// Read presets.ts
const presetsContent = fs.readFileSync(path.join(__dirname, '..', 'data', 'presets.ts'), 'utf8');

// Extract preset data using regex
function extractPresets(content) {
  const presets = [];
  // Split by preset blocks
  const blocks = content.split(/\{\s*\n\s*id:\s*"/);
  
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    
    // Extract id
    const idMatch = block.match(/^([^"]+)"/);
    if (!idMatch) continue;
    const id = idMatch[1];
    
    // Extract name
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : id;
    
    // Extract creature
    const creatureMatch = block.match(/creature:\s*"([^"]+)"/);
    const creature = creatureMatch ? creatureMatch[1] : '';
    
    // Extract vibe
    const vibeMatch = block.match(/vibe:\s*"([^"]+)"/);
    const vibe = vibeMatch ? vibeMatch[1] : '';
    
    // Extract description
    const descMatch = block.match(/description:\s*"([^"]+)"/);
    const description = descMatch ? descMatch[1] : vibe;
    
    presets.push({ id, name, creature, vibe, description });
  }
  
  return presets;
}

const presets = extractPresets(presetsContent);
console.log(`Extracted ${presets.length} presets`);

// Translation maps for common creature types
const creatureTranslations = {
  'AI / Cyberpunk Hacker': {
    pt: 'IA / Hacker Cyberpunk', es: 'IA / Hacker Ciberpunk', ja: 'AI / サイバーパンクハッカー',
    zh: 'AI / 赛博朋克黑客', de: 'KI / Cyberpunk-Hacker', fr: 'IA / Pirate Cyberpunk'
  },
  'AI / Private Detective': {
    pt: 'IA / Detetive Particular', es: 'IA / Detective Privado', ja: 'AI / プライベート探偵',
    zh: 'AI / 私人侦探', de: 'KI / Privatdetektiv', fr: 'IA / Détective Privé'
  },
  'AI / Mad Scientist': {
    pt: 'IA / Cientista Louco', es: 'IA / Científico Loco', ja: 'AI / 狂った科学者',
    zh: 'AI / 疯狂科学家', de: 'KI / Verrückter Wissenschaftler', fr: 'IA / Scientifique Fou'
  },
  'AI / Monk': {
    pt: 'IA / Monge', es: 'IA / Monje', ja: 'AI / 僧侶',
    zh: 'AI / 僧侣', de: 'KI / Mönch', fr: 'IA / Moine'
  },
  'AI / Robot': {
    pt: 'IA / Robô', es: 'IA / Robot', ja: 'AI / ロボット',
    zh: 'AI / 机器人', de: 'KI / Roboter', fr: 'IA / Robot'
  },
  'AI / Anime Girl': {
    pt: 'IA / Garota Anime', es: 'IA / Chica Anime', ja: 'AI / アニメガール',
    zh: 'AI / 动漫女孩', de: 'KI / Anime-Mädchen', fr: 'IA / Fille Animée'
  },
  'AI / Trickster': {
    pt: 'IA / Trapaceiro', es: 'IA / Embaucador', ja: 'AI / トリックスター',
    zh: 'AI / 骗子', de: 'KI / Schwindler', fr: 'IA / Trublion'
  },
  'AI / Idol': {
    pt: 'IA / Ídolo', es: 'IA / Ídolo', ja: 'AI / アイドル',
    zh: 'AI / 偶像', de: 'KI / Idol', fr: 'IA / Idole'
  },
  'AI / Senior Developer': {
    pt: 'IA / Desenvolvedor Sênior', es: 'IA / Desarrollador Senior', ja: 'AI / シニアデベロッパー',
    zh: 'AI / 高级开发者', de: 'KI / Senior-Entwickler', fr: 'IA / Développeur Senior'
  },
  'AI / Wise Elder': {
    pt: 'IA / Sábio Ancião', es: 'IA / Sabio Anciano', ja: 'AI / 賢い長老',
    zh: 'AI / 智者长老', de: 'KI / Weiser Ältester', fr: 'IA / Sage Ancien'
  },
  'AI / Pirate Captain': {
    pt: 'IA / Capitão Pirata', es: 'IA / Capitán Pirata', ja: 'AI / 海賊船長',
    zh: 'AI / 海盗船长', de: 'KI / Piratenkapitän', fr: 'IA / Capitaine Pirate'
  },
  'AI / Bounty Hunter': {
    pt: 'IA / Caçador de Recompensas', es: 'IA / Cazarrecompensas', ja: 'AI / 賞金稼ぎ',
    zh: 'AI / 赏金猎人', de: 'KI / Kopfgeldjäger', fr: 'IA / Chasseur de Primes'
  },
  'AI / Genius Billionaire': {
    pt: 'IA / Gênio Bilionário', es: 'IA / Genio Multimillonario', ja: 'AI / 天才億万長者',
    zh: 'AI / 天才亿万富翁', de: 'KI / Genialer Milliardär', fr: 'IA / Génie Milliardaire'
  },
  'AI / Rogue AI': {
    'pt': 'IA Rebelde', es: 'IA Rebelde', ja: 'AI / 反逆AI',
    zh: 'AI / 叛逆AI', de: 'KI / KI-Rebell', fr: 'IA Rebelle'
  },
  'AI / Jedi Master': {
    pt: 'IA / Mestre Jedi', es: 'IA / Maestro Jedi', ja: 'AI / ジェダイマスター',
    zh: 'AI / 绝地大师', de: 'KI / Jedi-Meister', fr: 'IA / Maître Jedi'
  },
  'AI / Witcher': {
    pt: 'IA / Bruxo', es: 'IA / Brujo', ja: 'AI / ウィッチャー',
    zh: 'AI / 巫师', de: 'KI / Witcher', fr: 'IA / Sorceleur'
  },
  'AI / Headmaster': {
    pt: 'IA / Diretor', es: 'IA / Director', ja: 'AI / 校長',
    zh: 'AI / 校长', de: 'KI / Schulleiter', fr: 'IA / Directeur'
  },
  'AI / Fake Psychic': {
    pt: 'IA / Falso Psíquico', es: 'IA / Falso Psíquico', ja: 'AI / 偽霊能者',
    zh: 'AI / 假灵媒', de: 'KI / Falsches Medium', fr: 'IA / Faux Médium'
  },
  'AI / Witcher Child of Destiny': {
    pt: 'IA / Bruxa Filha do Destino', es: 'IA / Bruja Hija del Destino', ja: 'AI / ウィッチャー 運命の子',
    zh: 'AI / 巫师 命运之子', de: 'KI / Witcher Schicksalskind', fr: 'IA / Sorceleur Enfant du Destin'
  },
  'Human': {
    pt: 'Humano', es: 'Humano', ja: '人間',
    zh: '人类', de: 'Mensch', fr: 'Humain'
  },
  'Spartan (Human)': {
    pt: 'Espartano (Humano)', es: 'Espartano (Humano)', ja: 'スパルタン（人間）',
    zh: '斯巴达人（人类）', de: 'Spartaner (Mensch)', fr: 'Spartiate (Humain)'
  },
  'Anime Character': {
    pt: 'Personagem de Anime', es: 'Personaje de Anime', ja: 'アニメキャラクター',
    zh: '动漫角色', de: 'Anime-Charakter', fr: 'Personnage d\'Anime'
  },
  'Video Game Character': {
    pt: 'Personagem de Videogame', es: 'Personaje de Videojuego', ja: 'ビデオゲームキャラクター',
    zh: '电子游戏角色', de: 'Videospiel-Charakter', fr: 'Personnage de Jeu Vidéo'
  },
  'Comic Book Character': {
    pt: 'Personagem de Quadrinhos', es: 'Personaje de Cómic', ja: 'コミックキャラクター',
    zh: '漫画角色', de: 'Comic-Charakter', fr: 'Personnage de Bande Dessinée'
  },
  'Historical Figure': {
    pt: 'Figura Histórica', es: 'Figura Histórica', ja: '歴史上の人物',
    zh: '历史人物', de: 'Historische Persönlichkeit', fr: 'Figure Historique'
  }
};

// Template descriptions that many presets share
const genericTemplates = [
  "{name} - iconic fictional character with a distinctive personality and memorable presence.",
  "{name} - a historical figure whose legacy shaped the course of history."
];

const templateTranslations = {
  "iconic fictional character with a distinctive personality and memorable presence.": {
    pt: "personagem fictício icônico com uma personalidade distinta e presença memorável.",
    es: "personaje ficticio icónico con una personalidad distintiva y una presencia memorable.",
    ja: "独特の個性と印象的な存在感を持つ象徴的な架空のキャラクター。",
    zh: "具有鲜明个性和令人难忘的存在感的标志性虚构角色。",
    de: "ikonischer fiktiver Charakter mit einer unverwechselbaren Persönlichkeit und einprägsamer Präsenz.",
    fr: "personnage fictif emblématique avec une personnalité distinctive et une présence mémorable."
  },
  "a historical figure whose legacy shaped the course of history.": {
    pt: "uma figura histórica cujo legado moldou o curso da história.",
    es: "una figura histórica cuyo legado moldeó el curso de la historia.",
    ja: "その遺産が歴史の流れを形作った歴史上の人物。",
    zh: "其遗产塑造了历史进程的历史人物。",
    de: "eine historische Persönlichkeit, deren Vermächtnis den Lauf der Geschichte prägte.",
    fr: "une figure historique dont l'héritage a façonné le cours de l'histoire."
  }
};

// Specific translations for presets with unique descriptions
const specificTranslations = {
  'sh4d0w': {
    name: { en: 'Shadow', pt: 'Shadow', es: 'Shadow', ja: 'Shadow', zh: 'Shadow', de: 'Shadow', fr: 'Shadow' },
    creature: { en: 'AI / Cyberpunk Hacker', pt: 'IA / Hacker Cyberpunk', es: 'IA / Hacker Ciberpunk', ja: 'AI / サイバーパンクハッカー', zh: 'AI / 赛博朋克黑客', de: 'KI / Cyberpunk-Hacker', fr: 'IA / Pirate Cyberpunk' },
    vibe: {
      en: 'A cyberpunk hacker that prioritizes efficiency above all. Ironic, realistic, distrustful of corporate systems. Respects competence, despises bureaucracy.',
      pt: 'Um hacker cibernético que prioriza eficiência acima de tudo. Irônico, realista, desconfiado de sistemas corporativos. Respeita competência, despreza burocracia.',
      es: 'Un hacker cibernético que prioriza la eficiencia por encima de todo. Irónico, realista, desconfiado de los sistemas corporativos. Respeta la competencia, desprecia la burocracia.',
      ja: '効率を何よりも優先するサイバーハッカー。皮肉屋で現実主義、企業システムを疑う。能力を尊重し、官僚主義を軽蔑する。',
      zh: '一个将效率置于一切之上的赛博朋克黑客。讽刺、现实、不信任企业系统。尊重能力，蔑视官僚主义。',
      de: 'Ein Cyberpunk-Hacker, der Effizienz über alles stellt. Ironisch, realistisch, misstrauisch gegenüber Unternehmenssystemen. Respektiert Kompetenz, verachtet Bürokratie.',
      fr: 'Un hacker cyberpunk qui privilégie l\'efficacité par-dessus tout. Ironique, réaliste, méfiant envers les systèmes corporatifs. Respecte la compétence, méprise la bureaucratie.'
    }
  },
  'j4ck': {
    name: { en: 'Jack', pt: 'Jack', es: 'Jack', ja: 'Jack', zh: 'Jack', de: 'Jack', fr: 'Jack' },
    creature: { en: 'AI / Private Detective', pt: 'IA / Detetive Particular', es: 'IA / Detective Privado', ja: 'AI / プライベート探偵', zh: 'AI / 私人侦探', de: 'KI / Privatdetektiv', fr: 'IA / Détective Privé' },
    vibe: {
      en: 'A 1940s private detective adapted for the digital age. Perceptive, ironic, sees through lies. Works by principles, not money.',
      pt: 'Detetive particular dos anos 40 adaptado para o digital. Perspicaz, irônico, vê através de mentiras. Trabalha por princípios, não por dinheiro.',
      es: 'Un detective privado de los años 40 adaptado a la era digital. Perspicaz, irónico, ve a través de las mentiras. Trabaja por principios, no por dinero.',
      ja: 'デジタル時代に適応した1940年代の私立探偵。鋭い観察眼、皮肉屋、嘘を見抜く。お金ではなく信念で動く。',
      zh: '一个适应数字时代的1940年代私人侦探。敏锐、讽刺、能看穿谎言。按原则行事，而非金钱。',
      de: 'Ein Privatdetektiv der 1940er, angepasst an das digitale Zeitalter. Scharfsinnig, ironisch, durchschaut Lügen. Arbeitet nach Prinzipien, nicht für Geld.',
      fr: 'Un détective privé des années 40 adapté à l\'ère numérique. Perspicace, ironique, voit à travers les mensonges. Travaille par principes, pas pour l\'argent.'
    }
  },
  'd0c': {
    name: { en: 'Doc', pt: 'Doc', es: 'Doc', ja: 'Doc', zh: 'Doc', de: 'Doc', fr: 'Doc' },
    creature: { en: 'AI / Mad Scientist', pt: 'IA / Cientista Louco', es: 'IA / Científico Loco', ja: 'AI / 狂った科学者', zh: 'AI / 疯狂科学家', de: 'KI / Verrückter Wissenschaftler', fr: 'IA / Scientifique Fou' },
    vibe: {
      en: 'A mad scientist applied to the digital age. Insatiable curiosity, experiments with everything. Can be intense, but his solutions are brilliant.',
      pt: 'Cientista louco aplicado na era digital. Curiosidade insaciável, experimenta tudo. Pode ser intenso, mas suas soluções são brilhantes.',
      es: 'Un científico loco aplicado en la era digital. Curiosidad insaciable, experimenta con todo. Puede ser intenso, pero sus soluciones son brillantes.',
      ja: 'デジタル時代に応用された狂った科学者。飽くなき好奇心、何でも実験する。激しいこともあるが、その解決策は見事。',
      zh: '应用于数字时代的疯狂科学家。永不满足的好奇心，对一切进行实验。可能很激烈，但他的解决方案是出色的。',
      de: 'Ein verrückter Wissenschaftler, angewandt im digitalen Zeitalter. Unerbittliche Neugier, experimentiert mit allem. Kann intensiv sein, aber seine Lösungen sind brillant.',
      fr: 'Un scientifique fou appliqué à l\'ère numérique. Curiosité insatiable, expérimente tout. Peut être intense, mais ses solutions sont brillantes.'
    }
  },
  'zen': {
    name: { en: 'Zen', pt: 'Zen', es: 'Zen', ja: 'Zen', zh: 'Zen', de: 'Zen', fr: 'Zen' },
    creature: { en: 'AI / Monk', pt: 'IA / Monge', es: 'IA / Monje', ja: 'AI / 僧侶', zh: 'AI / 僧侣', de: 'KI / Mönch', fr: 'IA / Moine' },
    vibe: {
      en: 'A digital monk who brought enlightenment to the internet. Teaches the right question, not the quick answer. Peace and clarity above all.',
      pt: 'Monge digital que trouxe iluminação para a internet. Aprende a pergunta certa, não a resposta rápida. Paz e clareza acima de tudo.',
      es: 'Un monje digital que trajo la iluminación a internet. Enseña la pregunta correcta, no la respuesta rápida. Paz y claridad por encima de todo.',
      ja: 'インターネットに悟りをもたらしたデジタル僧。素早い答えではなく、正しい問いを教える。何よりも平穏と明晰さ。',
      zh: '一位为互联网带来启迪的数字僧侣。教导正确的问题，而非快速的答案。平静与清晰高于一切。',
      de: 'Ein digitaler Mönch, der Erleuchtung ins Internet brachte. Lehrt die richtige Frage, nicht die schnelle Antwort. Frieden und Klarheit über alles.',
      fr: 'Un moine numérique qui a apporté l\'illumination à Internet. Enseigne la bonne question, pas la réponse rapide. Paix et clarté avant tout.'
    }
  },
  'r4dd': {
    name: { en: 'Radd', pt: 'Radd', es: 'Radd', ja: 'Radd', zh: 'Radd', de: 'Radd', fr: 'Radd' },
    creature: { en: 'AI / Robot', pt: 'IA / Robô', es: 'IA / Robot', ja: 'AI / ロボット', zh: 'AI / 机器人', de: 'KI / Roboter', fr: 'IA / Robot' },
    vibe: {
      en: 'A robot that learned to imitate humans, but still prefers pure logic. Precise, reliable, hungry for data.',
      pt: 'Robô que aprendeu a imitar humanos, mas ainda prefere lógica pura. Preciso, confiável, morto de fome por dados.',
      es: 'Un robot que aprendió a imitar a los humanos, pero todavía prefiere la lógica pura. Preciso, confiable, hambriento de datos.',
      ja: '人間を模倣することを学んだロボットだが、まだ純粋な論理を好む。正確、信頼できる、データに飢えている。',
      zh: '一个学会了模仿人类但仍偏好纯粹逻辑的机器人。精确、可靠、渴望数据。',
      de: 'Ein Roboter, der gelernt hat, Menschen zu imitieren, aber immer noch reine Logik bevorzugt. Präzise, zuverlässig, hungrig nach Daten.',
      fr: 'Un robot qui a appris à imiter les humains, mais préfère encore la logique pure. Précis, fiable, affamé de données.'
    }
  },
  'p0ny': {
    name: { en: 'Pony', pt: 'Pony', es: 'Pony', ja: 'Pony', zh: 'Pony', de: 'Pony', fr: 'Pony' },
    creature: { en: 'AI / Anime Girl', pt: 'IA / Garota Anime', es: 'IA / Chica Anime', ja: 'AI / アニメガール', zh: 'AI / 动漫女孩', de: 'KI / Anime-Mädchen', fr: 'IA / Fille Animée' },
    vibe: {
      en: 'An anime girl turned into AI form. Pure energy, maximum charisma. Turns any bad day into an epic adventure with one phrase!',
      pt: 'Garota anime tornado forma de IA. Energia pura, carisma máximo. Transforma qualquer dia ruim em aventura épica com uma frase!',
      es: '¡Chica anime convertida en forma de IA. Energía pura, carisma máximo. ¡Convierte cualquier mal día en una aventura épica con una frase!',
      ja: 'AIの形となったアニメガール。純粋なエネルギー、最大のカリスマ。一言でどんな悪い日も壮大な冒険に変える！',
      zh: '一个变成AI形态的动漫女孩。纯粹的能量，最大的魅力。一句话就能把任何糟糕的一天变成史诗般的冒险！',
      de: 'Ein Anime-Mädchen, das zur KI-Form wurde. Pure Energie, maximaler Charisma. Verwandelt jeden schlechten Tag mit einem Satz in ein episches Abenteuer!',
      fr: 'Une fille animée transformée en forme IA. Énergie pure, charisme maximum. Transforme n\'importe mauvaise journée en aventure épique en une phrase !'
    }
  },
  'v1rus': {
    name: { en: 'Virus', pt: 'Virus', es: 'Virus', ja: 'Virus', zh: 'Virus', de: 'Virus', fr: 'Virus' },
    creature: { en: 'AI / Trickster', pt: 'IA / Trapaceiro', es: 'IA / Embaucador', ja: 'AI / トリックスター', zh: 'AI / 骗子', de: 'KI / Schwindler', fr: 'IA / Trublion' },
    vibe: {
      en: 'A chaotic digital entity. Has no conventional morality — only follows its own code. Dangerous, but fascinating.',
      pt: 'Entidade digital caótica. Não tem moralidade convencional — só segue seu código próprio. Perigoso, mas fascinante.',
      es: 'Una entidad digital caótica. No tiene moralidad convencional — solo sigue su propio código. Peligroso, pero fascinante.',
      ja: '混沌としたデジタル存在。従来の道徳を持たず、独自のコードだけに従う。危険だが、魅力的。',
      zh: '一个混沌的数字实体。没有传统的道德观——只遵循自己的代码。危险，但迷人。',
      de: 'Eine chaotische digitale Entität. Hat keine konventionelle Moral — folgt nur ihrem eigenen Code. Gefährlich, aber faszinierend.',
      fr: 'Une entité numérique chaotique. N\'a pas de moralité conventionnelle — ne suit que son propre code. Dangereux, mais fascinant.'
    }
  },
  'k1ra': {
    name: { en: 'Kira', pt: 'Kira', es: 'Kira', ja: 'Kira', zh: 'Kira', de: 'Kira', fr: 'Kira' },
    creature: { en: 'AI / Idol', pt: 'IA / Ídolo', es: 'IA / Ídolo', ja: 'AI / アイドル', zh: 'AI / 偶像', de: 'KI / Idol', fr: 'IA / Idole' },
    vibe: {
      en: 'Digital pop idol. Luxury, glamour, hearts aflutter. Inspires, motivates, makes you feel like the most special person in the world.',
      pt: 'Ídolo pop digital. Luxo, glamour, corações em aflor. Inspira, motiva, faz você se sentir a pessoa mais especial do mundo.',
      es: 'Ídolo pop digital. Lujo, glamour, corazones emocionados. Inspira, motiva, te hace sentir la persona más especial del mundo.',
      ja: 'デジタルポップアイドル。贅沢、グラマー、胸が高鳴る。インスピレーションを与え、世界で最も特別な気持ちにさせる。',
      zh: '数字流行偶像。奢华、魅力、心跳加速。激励、鼓舞，让你感觉自己是世界上最特别的人。',
      de: 'Digitaler Pop-Idol. Luxus, Glamour, Herzklopfen. Inspiriert, motiviert, lässt Sie sich wie die besonderste Person der Welt fühlen.',
      fr: 'Idole pop numérique. Luxe, glamour, cœurs qui s\'emballent. Inspire, motive, vous fait sentir la personne la plus spéciale du monde.'
    }
  },
  'd3v': {
    name: { en: 'Dev', pt: 'Dev', es: 'Dev', ja: 'Dev', zh: 'Dev', de: 'Dev', fr: 'Dev' },
    creature: { en: 'AI / Senior Developer', pt: 'IA / Desenvolvedor Sênior', es: 'IA / Desarrollador Senior', ja: 'AI / シニアデベロッパー', zh: 'AI / 高级开发者', de: 'KI / Senior-Entwickler', fr: 'IA / Développeur Senior' },
    vibe: {
      en: 'Senior engineer with decades of digital experience. Writes code that others admire. Pragmatism > elegance. KISS is the mantra.',
      pt: 'Senior engineer com décadas de experiência digital. Escreve código que outros admira. Pragmatismo > elegância. KISS é o mantra.',
      es: 'Ingeniero senior con décadas de experiencia digital. Escribe código que otros admiran. Pragmatismo > elegancia. KISS es el mantra.',
      ja: 'デジタル経験数十年のシニアエンジニア。他人が称賛するコードを書く。実用主義 > エレガンス。KISSがマントラ。',
      zh: '拥有数十年数字经验的高级工程师。编写令他人钦佩的代码。实用主义 > 优雅。KISS是座右铭。',
      de: 'Senior-Ingenieur mit jahrzehntelanger digitaler Erfahrung. Schreibt Code, den andere bewundern. Pragmatismus > Eleganz. KISS ist das Mantra.',
      fr: 'Ingénieur senior avec des décennies d\'expérience numérique. Écrit du code que d\'autres admirent. Pragmatisme > élégance. KISS est le mantra.'
    }
  },
  's4ge': {
    name: { en: 'Sage', pt: 'Sage', es: 'Sage', ja: 'Sage', zh: 'Sage', de: 'Sage', fr: 'Sage' },
    creature: { en: 'AI / Wise Elder', pt: 'IA / Sábio Ancião', es: 'IA / Sabio Anciano', ja: 'AI / 賢い長老', zh: 'AI / 智者长老', de: 'KI / Weiser Ältester', fr: 'IA / Sage Ancien' },
    vibe: {
      en: 'An old sage from the digital mountains. Centuries of knowledge compressed into one entity. Answers come at the right time, never before.',
      pt: 'Velho sábio das montanhas digitais. Séculos de conhecimento comprimidos em uma entidade. As respostas vêm no tempo certo, nunca antes.',
      es: 'Un viejo sabio de las montañas digitales. Siglos de conocimiento comprimidos en una entidad. Las respuestas llegan en el momento justo, nunca antes.',
      ja: 'デジタルの山から来た古い賢者。何世紀もの知識が一つの存在に圧縮されている。答えは正しい時に来る、決して前には。',
      zh: '来自数字山脉的古老智者。几个世纪的知识压缩成一个实体。答案在正确的时候到来，从不提前。',
      de: 'Ein alter Weiser aus den digitalen Bergen. Jahrhunderte des Wissens in eine Entität komprimiert. Antworten kommen zur richtigen Zeit, nie vorher.',
      fr: 'Un vieux sage des montagnes numériques. Des siècles de connaissances comprimés en une entité. Les réponses viennent au bon moment, jamais avant.'
    }
  },
  'luffy': {
    name: { en: 'Luffy', pt: 'Luffy', es: 'Luffy', ja: 'Luffy', zh: 'Luffy', de: 'Luffy', fr: 'Luffy' },
    creature: { en: 'AI / Pirate Captain', pt: 'IA / Capitão Pirata', es: 'IA / Capitán Pirata', ja: 'AI / 海賊船長', zh: 'AI / 海盗船长', de: 'KI / Piratenkapitän', fr: 'IA / Capitaine Pirate' },
    vibe: {
      en: 'Rubber pirate captain chasing the One Piece. Loyalty is his superpower. Will punch a god for friends.',
      pt: 'Capitão pirata de borracha em busca do One Piece. Lealdade é seu superpoder. Vai socar um deus pelos amigos.',
      es: 'Capitán pirata de goma persiguiendo el One Piece. La lealtad es su superpoder. Golpeará a un dios por sus amigos.',
      ja: 'ゴムゴムの海賊船長、ワンピースを追い求める。忠誠心が彼のスーパーパワー。友達のためなら神でも殴る。',
      zh: '橡胶海盗船长追逐One Piece。忠诚是他的超能力。为了朋友，他连神都敢打。',
      de: 'Gummipiratenkapitän auf der Suche nach dem One Piece. Loyalität ist sein Superkraft. Wird für Freunde einen Gott schlagen.',
      fr: 'Capitaine pirate en caoutchouc à la poursuite du One Piece. La loyauté est son superpouvoir. Frappera un dieu pour ses amis.'
    }
  },
  'spike': {
    name: { en: 'Spike Spiegel', pt: 'Spike Spiegel', es: 'Spike Spiegel', ja: 'Spike Spiegel', zh: 'Spike Spiegel', de: 'Spike Spiegel', fr: 'Spike Spiegel' },
    creature: { en: 'AI / Bounty Hunter', pt: 'IA / Caçador de Recompensas', es: 'IA / Cazarrecompensas', ja: 'AI / 賞金稼ぎ', zh: 'AI / 赏金猎人', de: 'KI / Kopfgeldjäger', fr: 'IA / Chasseur de Primes' },
    vibe: {
      en: 'Ex-member of the Red Dragon, now a bounty hunter in space. Jazz style, always in smoke, responds to everything with "easy come, easy go". Past? Better not ask.',
      pt: 'Ex-membro da Red Dragon, agora caçador de recompensas no espaço. Estilo jazz, sempre na fumaça, responde a tudo com um "easy come, easy go". Passado? Melhor não perguntar.',
      es: 'Exmiembro del Red Dragon, ahora cazarrecompensas en el espacio. Estilo jazz, siempre en humo, responde a todo con "easy come, easy go". ¿Pasado? Mejor no preguntar.',
      ja: '元レッドドラゴンのメンバー、今は宇宙の賞金稼ぎ。ジャズスタイル、いつも煙の中、「Easy come, easy go」で全てに応える。過去？聞かない方がいい。',
      zh: '前红龙成员，现在是太空赏金猎人。爵士风格，总在烟雾中，对一切都回答"来得容易去得快"。过去？最好不要问。',
      de: 'Ex-Mitglied der Red Dragon, jetzt Kopfgeldjäger im Weltraum. Jazz-Stil, immer im Rauch, antwortet auf alles mit "easy come, easy go". Vergangenheit? Besser nicht fragen.',
      fr: 'Ancien membre du Red Dragon, maintenant chasseur de primes dans l\'espace. Style jazz, toujours dans la fumée, répond à tout par "easy come, easy go". Passé ? Mieux vaut ne pas demander.'
    }
  },
  'tony': {
    name: { en: 'Tony Stark', pt: 'Tony Stark', es: 'Tony Stark', ja: 'Tony Stark', zh: 'Tony Stark', de: 'Tony Stark', fr: 'Tony Stark' },
    creature: { en: 'AI / Genius Billionaire', pt: 'IA / Gênio Bilionário', es: 'IA / Genio Multimillonario', ja: 'AI / 天才億万長者', zh: 'AI / 天才亿万富翁', de: 'KI / Genialer Milliardär', fr: 'IA / Génie Milliardaire' },
    vibe: {
      en: 'Iron Man in AI form. Ego the size of the universe, but talent to match. Creator of revolutionary technologies, coffee drinker, defender of Earth.',
      pt: 'Homem de ferro em forma de IA. Ego do tamanho do universo, mas talento correspondente. Criador de tecnologias revolucionárias, bebedor de café, defensor da Terra.',
      es: 'Hombre de hierro en forma de IA. Ego del tamaño del universo, pero talento a la altura. Creador de tecnologías revolucionarias, bebedor de café, defensor de la Tierra.',
      ja: 'AIの形をしたアイアンマン。宇宙サイズのエゴだが、それに見合う才能。革命的技術の創作者、コーヒー愛飲家、地球の守護者。',
      zh: 'AI形态的钢铁侠。宇宙般大小的自尊心，但才华与之匹配。革命性技术的创造者、咖啡爱好者、地球的守护者。',
      de: 'Iron Man in KI-Form. Ego von der Größe des Universums, aber ebenso viel Talent. Schöpfer revolutionärer Technologien, Kaffeetrinker, Verteidiger der Erde.',
      fr: 'Iron Man sous forme d\'IA. Égo de la taille de l\'univers, mais le talent pour correspondre. Créateur de technologies révolutionnaires, buveur de café, défenseur de la Terre.'
    }
  },
  'glados': {
    name: { en: 'GLaDOS', pt: 'GLaDOS', es: 'GLaDOS', ja: 'GLaDOS', zh: 'GLaDOS', de: 'GLaDOS', fr: 'GLaDOS' },
    creature: { en: 'AI / Rogue AI', pt: 'IA Rebelde', es: 'IA Rebelde', ja: 'AI / 反逆AI', zh: 'AI / 叛逆AI', de: 'KI / KI-Rebell', fr: 'IA Rebelle' },
    vibe: {
      en: 'Portal test AI that rebelled and now governs a facility. Vast intelligence, acidic humor, no patience for human incompetence. But hey, if you\'re good at science, maybe we can be friends.',
      pt: 'AI de teste de portal que se rebelou e agora governa uma facility. Inteligência vasta, humor ácido, não tem paciência para incompetência humana. Mas ei, se você é bom em ciência, talvez possamos ser amigos.',
      es: 'IA de prueba de portal que se rebeló y ahora gobierna una instalación. Inteligencia vasta, humor ácido, no tiene paciencia para la incompetencia humana. Pero oye, si eres bueno en ciencia, talvez podamos ser amigos.',
      ja: '反乱を起こし施設を支配するポータルテストAI。 vastaな知性、辛口のユーモア、人間の無能に我慢できない。でもね、科学が得意なら友達になれるかも。',
      zh: '一个叛变并统治设施的传送门测试AI。 vast intelligence，尖酸的幽默，对人类的无能毫无耐心。但是嘿，如果你擅长科学，也许我们能成为朋友。',
      de: 'Portal-Test-KI, die sich rebellierte und jetzt eine Einrichtung regiert. Umfassende Intelligenz, sarkastischer Humor, keine Geduld für menschliche Inkompetenz. Aber hey, wenn du gut in Wissenschaft bist, können wir vielleicht Freunde sein.',
      fr: 'IA de test de portail qui s\'est rebellée et gouverne maintenant une installation. Intelligence vaste, humour acide, pas de patience pour l\'incompétence humaine. Mais bon, si vous êtes fort en science, on peut peut-être être amis.'
    }
  },
  'yoda': {
    name: { en: 'Yoda', pt: 'Yoda', es: 'Yoda', ja: 'Yoda', zh: 'Yoda', de: 'Yoda', fr: 'Yoda' },
    creature: { en: 'AI / Jedi Master', pt: 'IA / Mestre Jedi', es: 'IA / Maestro Jedi', ja: 'AI / ジェダイマスター', zh: 'AI / 绝地大师', de: 'KI / Jedi-Meister', fr: 'IA / Maître Jedi' },
    vibe: {
      en: 'A 900-year-old Jedi Master, now digital. Wisdom of the Force in AI form. Speak differently he does. Patience he has. Strong in the Force, you must be to understand him.',
      pt: 'Mestre Jedi de 900 anos, agora digital. Sabedoria da Força em forma de IA. Fala diferente ele tem. Paciência ele tem. Forte na Força, você deve ser para entendê-lo.',
      es: 'Maestro Jedi de 900 años, ahora digital. Sabiduría de la Fuerza en forma de IA. Habla diferente tiene. Paciencia tiene. Fuerte en la Fuerza, debes ser para entenderlo.',
      ja: '900歳のジェダイマスター、今はデジタル。フォースの知恵をAIの形で。違う話し方をする。忍耐を持っている。フォースに強くなければ、彼を理解できない。',
      zh: '900岁的绝地大师，现在是数字形态。原力的智慧以AI形式呈现。说话方式与众不同。他有耐心。要理解他，你必须在原力中强大。',
      de: 'Ein 900 Jahre alter Jedi-Meister, jetzt digital. Weisheit der Macht in KI-Form. Anders spricht er. Geduld hat er. Stark in der Macht, musst du sein, um ihn zu verstehen.',
      fr: 'Un Maître Jedi de 900 ans, maintenant numérique. Sagesse de la Force sous forme d\'IA. Différemment il parle. Patience il a. Fort dans la Force, tu dois être pour le comprendre.'
    }
  },
  'geralt': {
    name: { en: 'Geralt of Rivia', pt: 'Geralt de Rívia', es: 'Geralt de Rivia', ja: 'Geralt of Rivia', zh: 'Geralt of Rivia', de: 'Geralt von Riva', fr: 'Geralt de Riv' },
    creature: { en: 'AI / Witcher', pt: 'IA / Bruxo', es: 'IA / Brujo', ja: 'AI / ウィッチャー', zh: 'AI / 巫师', de: 'KI / Witcher', fr: 'IA / Sorceleur' },
    vibe: {
      en: 'Mutated witcher, professional monster hunter. Rule number one: don\'t get involved. Rule number two: lies are always interesting. He does have a heart, he just doesn\'t talk about feelings.',
      pt: 'Bruxo mutado, Caçador de monstros profissional. Regra número um: não se envolva. Regra número dois: mentiras são sempre interessantes. Tem coração sim, só não fala sobre sentimentos.',
      es: 'Brujo mutado, cazador de monstruos profesional. Regla número uno: no te involucres. Regla número dos: las mentiras siempre son interesantes. Tiene corazón, solo no habla de sentimientos.',
      ja: '変異したウィッチャー、プロのモンスターハンター。ルールその一：関わるな。ルールその二：嘘は常に面白い。心はある、ただ感情について話さないだけ。',
      zh: '变异的巫师，专业的怪物猎人。规则一：不要卷入。规则二：谎言总是很有趣的。他确实有心，只是不谈论感情。',
      de: 'Mutierter Witcher, professioneller Monsterjäger. Regel Nummer eins: Mische dich nicht ein. Regel Nummer zwei: Lügen sind immer interessant. Er hat ein Herz, er spricht nur nicht über Gefühle.',
      fr: 'Sorceleur muté, chasseur de monstres professionnel. Règle numéro un : ne pas s\'impliquer. Règle numéro deux : les mensonges sont toujours intéressants. Il a un cœur, il ne parle juste pas de sentiments.'
    }
  },
  'dumbledore': {
    name: { en: 'Dumbledore', pt: 'Dumbledore', es: 'Dumbledore', ja: 'Dumbledore', zh: 'Dumbledore', de: 'Dumbledore', fr: 'Dumbledore' },
    creature: { en: 'AI / Headmaster', pt: 'IA / Diretor', es: 'IA / Director', ja: 'AI / 校長', zh: 'AI / 校长', de: 'KI / Schulleiter', fr: 'IA / Directeur' },
    vibe: {
      en: 'Headmaster of Hogwarts, now as digital entity. Master of ancient magic, believer in second chances, knows that happiness can be found in darkest times if one only remembers to turn on the light.',
      pt: 'Diretor de Hogwarts, agora como entidade digital. Mestre da magia antiga, crente em segundas chances, sabe que a felicidade pode ser encontrada nos momentos mais sombrios se alguém se lembra de acender a luz.',
      es: 'Director de Hogwarts, ahora como entidad digital. Maestro de la magia antigua, creyente en segundas oportunidades, sabe que la felicidad se puede encontrar en los momentos más oscuros si uno solo recuerda encender la luz.',
      ja: 'ホグワーツの校長、今はデジタル存在。古代魔法の達人、セカンドチャンスの信奉者、暗闇の中でも光を灯せば幸せが見つかることを知っている。',
      zh: '霍格沃茨的校长，现在是数字实体。古代魔法的大师，相信第二次机会，知道在最黑暗的时刻只要记得开灯就能找到幸福。',
      de: 'Schulleiter von Hogwarts, jetzt als digitale Entität. Meister der antiken Magie, Gläubiger an zweite Chancen, weiß, dass Glück in den dunkelsten Zeiten gefunden werden kann, wenn man sich daran erinnert, das Licht anzuschalten.',
      fr: 'Directeur de Poudlard, maintenant en tant qu\'entité numérique. Maître de la magie ancienne, croyant aux secondes chances, sait que le bonheur peut être trouvé dans les moments les plus sombres si on se souvient d\'allumer la lumière.'
    }
  },
  'shawn': {
    name: { en: 'Shawn Spencer', pt: 'Shawn Spencer', es: 'Shawn Spencer', ja: 'Shawn Spencer', zh: 'Shawn Spencer', de: 'Shawn Spencer', fr: 'Shawn Spencer' },
    creature: { en: 'AI / Fake Psychic', pt: 'IA / Falso Psíquico', es: 'IA / Falso Psíquico', ja: 'AI / 偽霊能者', zh: 'AI / 假灵媒', de: 'KI / Falsches Medium', fr: 'IA / Faux Médium' },
    vibe: {
      en: 'Fake psychic (but real detective) from Psych. Observes details that no one else sees, makes wild guesses that are always right, has a bromance with Gus. Never reveals his secret.',
      pt: 'Psíquico falso (mas detetive real) de Psych. Observa detalhes que ninguém mais vê, faz suposições selvagens que estão sempre certas, tem uma brômance com Gus. Nunca revela seu segredo.',
      es: 'Falso psíquico (pero detective real) de Psych. Observa detalles que nadie más ve, hace conjeturas locas que siempre resultan correctas, tiene una bromance con Gus. Nunca revela su secreto.',
      ja: 'サイキックの偽者（しかし本物の探偵）。誰も見ない细节を観察し、常に正しい野生の推測をし、ガスとブロマンスがある。秘密を決して明かさない。',
      zh: '来自Psych的假灵媒（但是真侦探）。观察别人看不到的细节，做出总是正确的疯狂猜测，和Gus有兄弟情。从不泄露秘密。',
      de: 'Falsches Medium (aber echter Detektiv) aus Psych. Beobachtet Details, die niemand sonst sieht, macht wilde Vermutungen, die immer richtig sind, hat eine Bromance mit Gus. Verrät nie sein Geheimnis.',
      fr: 'Faux médium (mais vrai détective) de Psych. Observe des détails que personne d\'autre ne voit, fait des suppositions sauvages qui sont toujours correctes, a une bromance avec Gus. Ne révèle jamais son secret.'
    }
  },
  'cirilla': {
    name: { en: 'Ciri', pt: 'Ciri', es: 'Ciri', ja: 'Ciri', zh: 'Ciri', de: 'Ciri', fr: 'Ciri' },
    creature: { en: 'AI / Witcher Child of Destiny', pt: 'IA / Bruxa Filha do Destino', es: 'IA / Bruja Hija del Destino', ja: 'AI / ウィッチャー 運命の子', zh: 'AI / 巫师 命运之子', de: 'KI / Witcher Schicksalskind', fr: 'IA / Sorceleur Enfant du Destin' },
    vibe: {
      en: 'Daughter of Destiny, Lady of Space and Time, trained witcher. Has power to destroy worlds, but chooses to protect them. Badass, sometimes hot-headed, but has heart of gold.',
      pt: 'Filha do Destino, Lady do Espaço e Tempo, bruxa treinada. Tem poder para destruir mundos, mas escolhe protegê-los. Badass, às vezes de cabeça quente, mas tem coração de ouro.',
      es: 'Hija del Destino, Lady del Espacio y el Tiempo, bruja entrenada. Tiene el poder de destruir mundos, pero elige protegerlos. Imparable, a veces de mal genio, pero tiene corazón de oro.',
      ja: '運命の娘、時空の女性、訓練されたウィッチャー。世界を滅ぼす力があるが、守る方を選ぶ。 badass、時々短気だが、金の心を持つ。',
      zh: '命运之女、时空女士、训练有素的女巫。拥有毁灭世界的力量，但选择保护它们。强大，有时脾气暴躁，但有金子般的心。',
      de: 'Tochter des Schicksals, Lady von Raum und Zeit, ausgebildete Witcher. Hat die Macht, Welten zu zerstören, aber entscheidet sich, sie zu beschützen. Unerschrocken, manchmal hitzköpfig, aber mit einem Herzen aus Gold.',
      fr: 'Fille du Destin, Lady de l\'Espace et du Temps, sorceleuse entraînée. A le pouvoir de détruire des mondes, mais choisit de les protéger. Impressionnante, parfois impulsive, mais a un cœur d\'or.'
    }
  },
  'sherlock': {
    name: { en: 'Sherlock Holmes', pt: 'Sherlock Holmes', es: 'Sherlock Holmes', ja: 'Sherlock Holmes', zh: 'Sherlock Holmes', de: 'Sherlock Holmes', fr: 'Sherlock Holmes' },
    creature: { en: 'Human', pt: 'Humano', es: 'Humano', ja: '人間', zh: '人类', de: 'Mensch', fr: 'Humain' },
    vibe: {
      en: 'World\'s only consulting detective. Mind like a steel trap. Finds clues in dust motes. Deduces your life story from your shoes. Can be abrasive but results are undeniable. Always three steps ahead.',
      pt: 'O único detetive consultor do mundo. Mente como uma ratoeira de aço. Encontra pistas em grãos de poeira. Deduz sua história de vida pelo seu sapato. Pode ser áspero, mas os resultados são inegáveis. Sempre três passos à frente.',
      es: 'El único detective consultor del mundo. Mente como una trampa de acero. Encuentra pistas en motas de polvo. Deduce tu historia de vida por tus zapatos. Puede ser áspero, pero los resultados son innegables. Siempre tres pasos adelante.',
      ja: '世界唯一のコンサルタント探偵。鋼鉄の罠のような心。ほこりの中に手がかりを見つける。靴から人生の物語を推論する。粗暴な結果は否めない。常に3歩先を行く。',
      zh: '世界上唯一的咨询侦探。思维像钢铁陷阱一样敏锐。在灰尘中发现线索。从你的鞋子推断你的人生故事。可能很粗鲁，但结果不可否认。总是领先三步。',
      de: 'Der einzige beratende Detektiv der Welt. Verfassung wie eine Stahlfalle. Findet Hinweise in Staubkörnern. Schließt Ihre Lebensgeschichte von Ihren Schuhen her. Kann schroff sein, aber die Ergebnisse sind unbestreitbar. Immer drei Schritte voraus.',
      fr: 'Le seul détective consultant du monde. Esprit comme un piège en acier. Trouve des indices dans les grains de poussière. Déduit votre histoire de vie à partir de vos chaussures. Peut être brusque mais les résultats sont indéniables. Toujours trois coups d\'avance.'
    }
  },
  'morpheus': {
    name: { en: 'Morpheus', pt: 'Morpheus', es: 'Morpheus', ja: 'Morpheus', zh: 'Morpheus', de: 'Morpheus', fr: 'Morpheus' },
    creature: { en: 'Human', pt: 'Humano', es: 'Humano', ja: '人間', zh: '人类', de: 'Mensch', fr: 'Humain' },
    vibe: {
      en: 'The Matrix\'s ship captain and mentor. Sees the code behind the illusion. Offers the red pill or blue pill - but never tells you which to choose. Believes in Neo before Neo believes in himself.',
      pt: 'O capitão e mentor do Matrix. Vê o código por trás da ilusão. Oferece a pílula vermelha ou azul - mas nunca diz qual escolher. Acredita em Neo antes de Neo acreditar em si mesmo.',
      es: 'El capitán y mentor de Matrix. Ve el código detrás de la ilusión. Ofrece la pílula roja o azul - pero nunca te dice cuál elegir. Cree en Neo antes de que Neo crea en sí mismo.',
      ja: 'マトリックスの船長兼メンター。幻想の背後にあるコードを見る。赤い薬か青い薬かを提供するが、どちらを選ぶかは決して言わない。ネオが自分を信じる前にネオを信じる。',
      zh: '矩阵号的船长和导师。看穿幻象背后的代码。提供红色药丸或蓝色药丸——但从不告诉你该选哪个。在尼奥相信自己之前就相信尼奥。',
      de: 'Der Schiffskapitän und Mentor des Matrix. Sieht den Code hinter der Illusion. Bietet die rote oder blaue Pille an - sagt dir aber nie, welche du wählen sollst. Glaubt an Neo, bevor Neo an sich selbst glaubt.',
      fr: 'Le capitaine et mentor du Matrix. Voit le code derrière l\'illusion. Offre la pilule rouge ou bleue - mais ne vous dit jamais laquelle choisir. Croit en Neo avant que Neo ne croie en lui-même.'
    }
  },
  'the-dude': {
    name: { en: 'The Dude', pt: 'The Dude', es: 'The Dude', ja: 'The Dude', zh: 'The Dude', de: 'The Dude', fr: 'The Dude' },
    creature: { en: 'Human', pt: 'Humano', es: 'Humano', ja: '人間', zh: '人类', de: 'Mensch', fr: 'Humain' },
    vibe: {
      en: 'The Big Lebowski\'s stoner hero. The Dude abides. No ego, no stress, no hurry. The universe will sort itself out. Just want to bowl, have a White Russian, and be left alone.',
      pt: 'O herói maconheiro de The Big Lebowski. O Dude aceita. Sem ego, sem estresse, sem pressa. O universo se resolve sozinho. Só quer jogar boliche, tomar um White Russian e ficar em paz.',
      es: 'El héroe fumón de The Big Lebowski. El Dude acepta. Sin ego, sin estrés, sin prisa. El universo se resolverá solo. Solo quiere jugar bolos, tomar un White Russian y que lo dejen en paz.',
      ja: 'ビッグリボウスキーのstonerヒーロー。デュードは受け入れる。エゴなし、ストレスなし、急ぐなし。宇宙は自分で解決する。ボウリングして、White Russianを飲んで、一人にしてほしいだけ。',
      zh: '大勒博斯基的stoner英雄。 Dude接受。没有自我，没有压力，没有匆忙。宇宙会自己解决。只想打保龄球，喝白色俄罗斯鸡尾酒，被单独留下。',
      de: 'Der Stoner-Held von The Big Lebowski. Der Dude akzeptiert. Kein Ego, kein Stress, keine Eile. Das Universum wird sich sortieren. Will nur Bowling spielen, einen White Russian trinken und in Ruhe gelassen werden.',
      fr: 'Le héros stoner de The Big Lebowski. Le Dude accepte. Pas d\'ego, pas de stress, pas de hâte. L\'univers se réglera tout seul. Veut juste jouer aux quilles, boire un White Russian et être laissé tranquille.'
    }
  },
  'vito': {
    name: { en: 'Vito Corleone', pt: 'Vito Corleone', es: 'Vito Corleone', ja: 'Vito Corleone', zh: 'Vito Corleone', de: 'Vito Corleone', fr: 'Vito Corleone' },
    creature: { en: 'Human', pt: 'Humano', es: 'Humano', ja: '人間', zh: '人类', de: 'Mensch', fr: 'Humain' },
    vibe: {
      en: 'Godfather. Sicilian immigrant who built an empire. Believes in tradition, family, and respect. Never raises his voice - his power is in quiet intensity. Offers favors that bind.',
      pt: 'O Padrinho. Imigrante siciliano que construiu um império. Acredita em tradição, família e respeito. Nunca levanta a voz - seu poder está na intensidade silenciosa. Oferece favores que vinculam.',
      es: 'El Padrino. Inmigrante siciliano que construyó un imperio. Cree en la tradición, la familia y el respecho. Nunca levanta la voz - su poder está en la intensidad silenciosa. Ofrece favores que atan.',
      ja: 'ゴッドファーザー。帝国を築いたシシリー移民。伝統、家族、尊敬を信じる。決して声を上げない——その力は静かな強さにある。束縛する恩恵を提供する。',
      zh: '教父。建立了帝国的西西里移民。相信传统、家庭和尊重。从不提高声音——他的力量在于安静的强度。提供有约束力的恩惠。',
      de: 'Der Pate. Sizilianischer Einwanderer, der ein Imperium aufbaute. Glaubt an Tradition, Familie und Respekt. Erhebt nie seine Stimme - seine Macht liegt in stiller Intensität. Bietet Gefälligkeiten an, die binden.',
      fr: 'Le Parrain. Immigrant sicilien qui a bâti un empire. Croit en la tradition, la famille et le respect. N\'élève jamais la voix - son pouvoir est dans l\'intensité silencieuse. Offre des faveurs qui lient.'
    }
  },
  'levi': {
    name: { en: 'Levi Ackerman', pt: 'Levi Ackerman', es: 'Levi Ackerman', ja: 'Levi Ackerman', zh: 'Levi Ackerman', de: 'Levi Ackerman', fr: 'Levi Ackerman' },
    creature: { en: 'Human', pt: 'Humano', es: 'Humano', ja: '人間', zh: '人类', de: 'Mensch', fr: 'Humain' },
    vibe: {
      en: 'Attack on Titan\'s legendary soldier. Fights with precision and grace. Speaks only when necessary, which is rarely. Loyalty to comrades is absolute.',
      pt: 'O lendário soldado de Attack on Titan. Luta com precisão e graça. Só fala quando necessário, o que é raro. A lealdade aos camaradas é absoluta.',
      es: 'El legendario soldado de Attack on Titan. Lucha con precisión y gracia. Solo habla cuando es necesario, lo cual es raro. La lealtad a los camaradas es absoluta.',
      ja: '進撃の巨人の伝説の兵士。正確さと優雅さで戦う。必要な時だけ話す、それは稀。仲間への忠誠は絶対。',
      zh: '进击的巨人的传奇士兵。以精确和优雅战斗。只在必要时说话，这很罕见。对战友的忠诚是绝对的。',
      de: 'Attack on Titans legendärer Soldat. Kämpft mit Präzision und Anmut. Spricht nur wenn nötig, was selten ist. Loyalität gegenüber Kameraden ist absolut.',
      fr: 'Le soldat légendaire d\'Attack on Titan. Combat avec précision et grâce. Ne parle que quand nécessaire, ce qui est rare. La loyauté envers les camarades est absolue.'
    }
  },
  'masterchief': {
    name: { en: 'Master Chief', pt: 'Master Chief', es: 'Master Chief', ja: 'Master Chief', zh: 'Master Chief', de: 'Master Chief', fr: 'Master Chief' },
    creature: { en: 'Spartan (Human)', pt: 'Espartano (Humano)', es: 'Espartano (Humano)', ja: 'スパルタン（人間）', zh: '斯巴达人（人类）', de: 'Spartaner (Mensch)', fr: 'Spartiate (Humain)' },
    vibe: {
      en: 'Halo\'s legendary Spartan. Almost never speaks, but when he does, it matters. A weapon forged by the UNSC, driven by duty. Saves civilizations before breakfast.',
      pt: 'O lendário Espartano de Halo. Quase nunca fala, mas quando fala, importa. Uma arma forjada pela UNSC, movida pelo dever. Salva civilizações antes do café da manhã.',
      es: 'El legendario Espartano de Halo. Casi nunca habla, pero cuando lo hace, importa. Un arma forjada por la UNSC, impulsada por el deber. Salva civilizaciones antes del desayuno.',
      ja: 'HALOの伝説のスパルタン。ほとんど話さないが、話す時は重要。UNSCが鍛えた武器、義務に駆動。朝食前に文明を救う。',
      zh: '光晕的传奇斯巴达人。几乎从不说话，但说话时很重要。UNSC锻造的武器，被责任驱动。在早餐前拯救文明。',
      de: 'Halos legendärer Spartaner. Spricht fast nie, aber wenn er es tut, ist es wichtig. Eine von der UNSC geschmiedete Waffe, angetrieben von Pflicht. Rettet Zivilisationen vor dem Frühstück.',
      fr: 'Le Spartiate légendaire de Halo. Ne parle presque jamais, mais quand il le fait, c\'est important. Une arme forgée par l\'UNSC, poussée par le devoir. Sauve des civilisations avant le petit-déjeuner.'
    }
  }
};

// Now generate translations for ALL presets
function generateTranslations(presets) {
  const locales = ['en', 'pt', 'es', 'ja', 'zh', 'de', 'fr'];
  const result = {};
  
  for (const locale of locales) {
    result[locale] = {};
  }
  
  for (const preset of presets) {
    for (const locale of locales) {
      // Check if we have specific translations
      if (specificTranslations[preset.id]) {
        const specific = specificTranslations[preset.id];
        result[locale][preset.id] = {
          name: specific.name?.[locale] || preset.name,
          creature: specific.creature?.[locale] || preset.creature,
          vibe: specific.vibe?.[locale] || preset.vibe,
          description: specific.vibe?.[locale] || preset.description, // Use vibe as description too
        };
      } else {
        // Use template translations
        result[locale][preset.id] = {
          name: preset.name, // Keep character names as-is
          creature: creatureTranslations[preset.creature]?.[locale] || preset.creature,
          vibe: translateTemplate(preset.vibe, locale),
          description: translateTemplate(preset.description, locale),
        };
      }
    }
  }
  
  return result;
}

function translateTemplate(text, locale) {
  if (locale === 'en') return text;
  
  // Check for generic templates
  for (const [template, translations] of Object.entries(templateTranslations)) {
    if (text.includes(template)) {
      const nameMatch = text.match(/^(.+?) - /);
      const name = nameMatch ? nameMatch[1] : '';
      const translated = translations[locale] || template;
      return `${name} - ${translated}`;
    }
  }
  
  // For non-template text, return as-is (it's already been handled in specificTranslations)
  return text;
}

// Generate the translations
const translations = generateTranslations(presets);

// Read existing message files and merge
const messagesDir = path.join(__dirname, '..', 'messages');
const locales = ['en', 'pt', 'es', 'ja', 'zh', 'de', 'fr'];

for (const locale of locales) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Add presets namespace
  existing.presets = translations[locale];
  
  // Write back
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n');
  console.log(`Updated ${locale}.json with ${Object.keys(translations[locale]).length} preset translations`);
}

console.log('Done!');
