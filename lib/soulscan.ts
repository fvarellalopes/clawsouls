/**
 * SoulScan engine — scans SOUL.md content for security issues and quality.
 *
 * Security patterns: Apache 2.0 from github.com/clawsouls/scan-rules
 * Quality analysis: LLM-based via OpenGateway
 */

import scanRulesData from "./scan-rules.json";

interface ScanRule {
  id: string;
  category: string;
  severity: "error" | "warning" | "info";
  pattern: string;
  description: string;
}

interface ScanFinding {
  ruleId: string;
  category: string;
  severity: "error" | "warning" | "info";
  description: string;
  line?: number;
  snippet?: string;
}

interface ScanResult {
  score: number;
  rating: "verified" | "low-risk" | "medium" | "high-risk" | "blocked";
  findings: ScanFinding[];
  summary: {
    errors: number;
    warnings: number;
    passed: number;
  };
  quality?: {
    sectionsFound: string[];
    sectionsMissing: string[];
    suggestions: string[];
    llmAnalysis?: string;
  };
}

const rules: ScanRule[] = (scanRulesData as { rules: ScanRule[] }).rules;

// The 8 best-practice sections for a strong SOUL.md
const REQUIRED_SECTIONS = [
  { key: "identity", patterns: [/^#\s+.*identity|^##\s+identity|^#\s+.*who\s+are\s+you/i, /you\s+are\s+/i] },
  { key: "core-truths", patterns: [/^##\s+core\s+truths|^##\s+principles|^##\s+beliefs/i] },
  { key: "worldview", patterns: [/^##\s+worldview|^##\s+opinions|^##\s+takes/i] },
  { key: "voice", patterns: [/^##\s+voice|^##\s+tone|^##\s+style|^##\s+communication/i] },
  { key: "expertise", patterns: [/^##\s+expertise|^##\s+skills|^##\s+domains|^##\s+knowledge/i] },
  { key: "boundaries", patterns: [/^##\s+boundaries|^##\s+limits|^##\s+won't|^##\s+restrictions/i] },
  { key: "memory-policy", patterns: [/^##\s+memory|^##\s+persistence|^##\s+continuity/i] },
  { key: "pet-peeves", patterns: [/^##\s+pet\s+peeves|^##\s+never|^##\s+anti-patterns/i] },
];

/**
 * Run regex-based security scan on SOUL.md content.
 */
export function runSecurityScan(content: string): ScanFinding[] {
  const findings: ScanFinding[] = [];
  const lines = content.split("\n");

  // Filter out SoulSpec-specific rules (SEC100-102) that don't apply to generic SOUL.md
  const SKIP_RULES = new Set(["SEC100", "SEC101", "SEC102"]);

  for (const rule of rules) {
    if (SKIP_RULES.has(rule.id)) continue;
    try {
      const regex = new RegExp(rule.pattern, "gi");
      for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
          findings.push({
            ruleId: rule.id,
            category: rule.category,
            severity: rule.severity,
            description: rule.description,
            line: i + 1,
            snippet: lines[i].trim().substring(0, 120),
          });
          break; // One match per rule is enough
        }
      }
    } catch {
      // Skip invalid regex patterns
    }
  }

  return findings;
}

/**
 * Check which best-practice sections are present in the SOUL.md.
 */
export function checkSections(content: string): { found: string[]; missing: string[] } {
  const found: string[] = [];
  const missing: string[] = [];
  const lines = content.split("\n");

  for (const section of REQUIRED_SECTIONS) {
    const hasSection = section.patterns.some((p) => {
      // Test each line individually for ^ patterns, or full content for others
      const source = p.source;
      if (source.startsWith("^")) {
        return lines.some((line) => p.test(line));
      }
      return p.test(content);
    });
    if (hasSection) {
      found.push(section.key);
    } else {
      missing.push(section.key);
    }
  }

  return { found, missing };
}

/**
 * Calculate score from findings.
 * Base: 100. Each error: -25. Each warning: -5.
 */
export function calculateScore(findings: ScanFinding[]): {
  score: number;
  rating: ScanResult["rating"];
} {
  let score = 100;
  for (const f of findings) {
    if (f.severity === "error") score -= 25;
    else if (f.severity === "warning") score -= 5;
  }
  score = Math.max(0, Math.min(100, score));

  let rating: ScanResult["rating"];
  if (score >= 90) rating = "verified";
  else if (score >= 70) rating = "low-risk";
  else if (score >= 40) rating = "medium";
  else if (score > 0) rating = "high-risk";
  else rating = "blocked";

  return { score, rating };
}

/**
 * Full scan: security patterns + section analysis.
 * Does NOT call LLM (fast, client-safe).
 */
export function runLocalScan(content: string): ScanResult {
  const findings = runSecurityScan(content);
  const { score, rating } = calculateScore(findings);
  const { found, missing } = checkSections(content);

  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;

  // Bonus for having sections (up to +10 points, capped at 100)
  const sectionBonus = Math.min(10, found.length * 1.25);
  const finalScore = Math.min(100, Math.round(score + sectionBonus));

  return {
    score: finalScore,
    rating:
      finalScore >= 90
        ? "verified"
        : finalScore >= 70
          ? "low-risk"
          : finalScore >= 40
            ? "medium"
            : finalScore > 0
              ? "high-risk"
              : "blocked",
    findings,
    summary: { errors, warnings, passed: rules.length - findings.length },
    quality: {
      sectionsFound: found,
      sectionsMissing: missing,
      suggestions: missing.map(
        (s) => `Missing ## ${s} section — add it for a stronger SOUL.md`
      ),
    },
  };
}

/**
 * LLM-based deep analysis. Calls OpenGateway for semantic feedback.
 */
export async function runLLMAnalysis(
  content: string,
  localResult: ScanResult
): Promise<string> {
  const MODEL = "mimo-v2.5-pro";
  const BASE_URL = "https://opengateway.gitlawb.com/v1";

  const sectionsFound = localResult.quality?.sectionsFound.join(", ") || "none";
  const sectionsMissing = localResult.quality?.sectionsMissing.join(", ") || "none";
  const errorDescriptions = localResult.findings
    .filter((f) => f.severity === "error")
    .map((f) => `- ${f.description}`)
    .join("\n");

  const prompt = `You are a SOUL.md quality analyst. Analyze this AI agent persona file.

SECURITY SCORE: ${localResult.score}/100 (${localResult.rating})
SECTIONS FOUND: ${sectionsFound}
SECTIONS MISSING: ${sectionsMissing}
SECURITY ERRORS:
${errorDescriptions || "None"}

SOUL.md CONTENT:
${content.substring(0, 3000)}

Provide a concise analysis (3-5 bullet points, max 150 words) covering:
1. What's strong about this SOUL.md
2. What's missing or weak
3. Top 1-2 actionable improvements
4. Overall quality assessment (one word: excellent/good/average/weak/poor)

Be direct. No fluff. Write in English.`;

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITLAWB_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.5,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      console.error("LLM API error:", response.status, await response.text());
      return "LLM analysis unavailable.";
    }

    const data = await response.json();
    const msg = data.choices?.[0]?.message;
    return msg?.content || msg?.reasoning || "No analysis generated.";
  } catch (err) {
    console.error("LLM error:", err);
    return "LLM analysis unavailable.";
  }
}
