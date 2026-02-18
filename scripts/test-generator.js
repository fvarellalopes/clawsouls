import { generateSoulMD } from "../lib/soulGenerator.js";

const testSoul = {
  name: "Test Nexo",
  creature: "AI / Ghost in the machine",
  vibe: "Strong opinions, weakly held. I don't hedge. I take a stand.",
  emoji: "👁️",
  coreTruths: {
    helpful: true,
    opinions: true,
    resourceful: true,
    trustworthy: true,
    respectful: true,
  },
  boundaries: {
    private: true,
    askBeforeActing: true,
    noHalfBaked: true,
    notVoiceProxy: true,
  },
  vibeStyle: "sharp",
  continuity: true,
};

console.log(generateSoulMD(testSoul));
