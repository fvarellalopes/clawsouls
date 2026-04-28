import * as yaml from "js-yaml";

interface SoulState {
  name: string;
  creature: string;
  vibe: string;
  emoji: string;
  avatar?: string;
  coreTruths: Record<string, boolean>;
  boundaries: Record<string, boolean>;
  customCoreTruths?: string[];
  customBoundaries?: string[];
  vibeStyle?: string;
  humor: number;
  formality: number;
  emojiUsage: number;
  verbosity: number;
  consciousness: number;
  questioning: number;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  communicationMode: string;
  knowledgeDomains: string[];
  signaturePhrases?: string[];
  emotionalRange?: number;
}

export function exportYAML(soul: SoulState): string {
  const exportData = {
    name: soul.name,
    creature: soul.creature,
    vibe: soul.vibe,
    emoji: soul.emoji,
    coreTruths: soul.coreTruths,
    boundaries: soul.boundaries,
    toneAttributes: {
      humor: soul.humor,
      formality: soul.formality,
      emojiUsage: soul.emojiUsage,
      verbosity: soul.verbosity,
      consciousness: soul.consciousness,
      questioning: soul.questioning,
    },
    personality: {
      openness: soul.openness,
      conscientiousness: soul.conscientiousness,
      extraversion: soul.extraversion,
      agreeableness: soul.agreeableness,
      neuroticism: soul.neuroticism,
    },
    communicationMode: soul.communicationMode,
    knowledgeDomains: soul.knowledgeDomains,
    signaturePhrases: soul.signaturePhrases,
    emotionalRange: soul.emotionalRange,
  };

  return yaml.dump(exportData, {
    indent: 2,
    lineWidth: 80,
    noRefs: true,
    sortKeys: false,
  });
}
