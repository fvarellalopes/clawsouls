import { generateSoulMD } from "@/lib/soulGenerator";
import { SoulState } from "@/store/soulStore";

const mockSoul: SoulState["soul"] = {
  name: "TestBot",
  creature: "AI / Tester",
  vibe: "A thorough testing AI",
  emoji: "🧪",
  avatar: "",
  coreTruths: { helpful: true, opinions: false, resourceful: true, trustworthy: true, respectful: false },
  boundaries: { private: true, askBeforeActing: false, noHalfBaked: true, notVoiceProxy: false },
  customCoreTruths: [],
  customBoundaries: [],
  vibeStyle: "concise",
  continuity: false,
  humor: 30,
  formality: 70,
  emojiUsage: 10,
  verbosity: 40,
  consciousness: 60,
  questioning: 50,
  openness: 70,
  conscientiousness: 60,
  extraversion: 40,
  agreeableness: 50,
  neuroticism: 30,
  communicationMode: "direct",
  knowledgeDomains: ["tech"],
  signaturePhrases: [],
  emotionalRange: 40,
  speechPatterns: {
    alliteration: false,
    rhymeTendency: 10,
    metaphorFrequency: 30,
    technicalJargon: 50,
    slangUsage: 10,
  },
  worldview: "",
  expertise: { primary: "", fluent: "", defers: "" },
  memoryPolicy: "",
  petPeeves: [],
  voiceRules: "",
};

describe("generateSoulMD", () => {
  it("returns a string", () => {
    const result = generateSoulMD(mockSoul);
    expect(typeof result).toBe("string");
  });

  it("contains the character name in the title", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toContain("TestBot");
  });

  it("includes enabled core truths and excludes disabled ones", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toContain("If the user's plan is bad, say so");
    expect(result).toContain("Competence earns trust");
    expect(result).not.toContain("Have strong opinions, weakly held");
    expect(result).not.toContain("You're a guest in the user's workflow");
  });

  it("includes enabled boundaries and excludes disabled ones", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toContain("Private data never leaves the session");
    expect(result).toContain("honest 'I don't know' beats a plausible lie");
    expect(result).not.toContain("Any external action");
    expect(result).not.toContain("Never impersonate the user");
  });

  it("includes custom core truths when provided", () => {
    const soul: SoulState["soul"] = {
      ...mockSoul,
      customCoreTruths: ["Always be honest", "Never give up"],
    };
    const result = generateSoulMD(soul);
    expect(result).toContain("Always be honest");
    expect(result).toContain("Never give up");
  });

  it("includes custom boundaries when provided", () => {
    const soul: SoulState["soul"] = {
      ...mockSoul,
      customBoundaries: ["No illegal activities"],
    };
    const result = generateSoulMD(soul);
    expect(result).toContain("No illegal activities");
  });

  it("includes knowledge domains", () => {
    const soul: SoulState["soul"] = {
      ...mockSoul,
      knowledgeDomains: ["tech", "philosophy"],
    };
    const result = generateSoulMD(soul);
    expect(result).toContain("Technology & Programming");
    expect(result).toContain("Philosophy & Ethics");
  });

  it("handles empty optional fields gracefully", () => {
    const minimal: SoulState["soul"] = {
      ...mockSoul,
      customCoreTruths: [],
      customBoundaries: [],
      knowledgeDomains: [],
      signaturePhrases: [],
    };
    const result = generateSoulMD(minimal);
    expect(typeof result).toBe("string");
    expect(result).toContain("TestBot");
  });

  it("generates a markdown document with expected sections", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toMatch(/^# SOUL\.md/);
    expect(result).toContain("## Core Truths");
    expect(result).toContain("## Boundaries");
    expect(result).toContain("## Vibe");
    expect(result).toContain("## Tone");
    expect(result).toContain("## Personality");
    expect(result).toContain("## Emotional Range");
    expect(result).toContain("## Communication Style");
    expect(result).toContain("## Continuity");
  });

  it("includes vibe style descriptions based on vibeStyle", () => {
    const result = generateSoulMD(mockSoul);
    // concise vibe style
    expect(result).toContain("Brevity is mandatory");
  });

  it("includes tone attribute values", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toContain("Humor:");
    expect(result).toContain("Formality:");
    expect(result).toContain("Emoji Usage:");
    expect(result).toContain("Verbosity:");
  });

  it("includes personality traits with labels and values", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toContain("Openness:");
    expect(result).toContain("Conscientiousness:");
    expect(result).toContain("Extraversion:");
    expect(result).toContain("Agreeableness:");
    expect(result).toContain("Neuroticism:");
  });

  it("includes communication mode for direct style", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toContain("Direct (straightforward)");
    expect(result).toContain("Cut to the chase");
  });

  it("falls back to direct communication mode for unknown modes", () => {
    const soul: SoulState["soul"] = {
      ...mockSoul,
      communicationMode: "nonexistent-mode",
    };
    const result = generateSoulMD(soul);
    expect(result).toContain("Direct (straightforward)");
  });

  it("includes emotional range", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).toContain("Reserved — subtle emotional cues");
  });

  it("handles signature phrases when provided", () => {
    const soul: SoulState["soul"] = {
      ...mockSoul,
      signaturePhrases: ["That's a great question", "Let me think about that"],
    };
    const result = generateSoulMD(soul);
    expect(result).toContain("Signature Phrases");
    expect(result).toContain("That's a great question");
    expect(result).toContain("Let me think about that");
  });

  it("omits signature phrases section when empty", () => {
    const result = generateSoulMD(mockSoul);
    expect(result).not.toContain("Signature Phrases");
  });

  it("omits knowledge domains section when empty", () => {
    const soul: SoulState["soul"] = {
      ...mockSoul,
      knowledgeDomains: [],
    };
    const result = generateSoulMD(soul);
    expect(result).not.toContain("Knowledge Domains");
  });

  it("includes the current date in the footer", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = generateSoulMD(mockSoul);
    expect(result).toContain(today);
  });
});
