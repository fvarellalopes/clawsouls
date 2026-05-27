"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

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
  summary: { errors: number; warnings: number; passed: number };
  quality?: {
    sectionsFound: string[];
    sectionsMissing: string[];
    suggestions: string[];
    llmAnalysis?: string;
  };
}

const RATING_CONFIG = {
  verified:    { label: "Verified",   icon: "verified",    color: "var(--color-accent)",  bg: "var(--color-accent)",  glow: "0 0 24px rgba(168,85,247,0.25)" },
  "low-risk":  { label: "Low Risk",   icon: "warning",     color: "#facc15",              bg: "#facc15",              glow: "0 0 20px rgba(250,204,21,0.2)" },
  medium:      { label: "Medium",      icon: "report",      color: "#f97316",              bg: "#f97316",              glow: "0 0 20px rgba(249,115,22,0.2)" },
  "high-risk": { label: "High Risk",   icon: "gpp_bad",     color: "#ef4444",              bg: "#ef4444",              glow: "0 0 20px rgba(239,68,68,0.25)" },
  blocked:     { label: "Blocked",      icon: "block",       color: "#dc2626",              bg: "#dc2626",              glow: "0 0 24px rgba(220,38,38,0.3)" },
};

const SECTION_LABELS: Record<string, string> = {
  identity: "Identity",
  "core-truths": "Core Truths",
  worldview: "Worldview",
  voice: "Voice",
  expertise: "Expertise",
  boundaries: "Boundaries",
  "memory-policy": "Memory Policy",
  "pet-peeves": "Pet Peeves",
};

const SECTION_ICONS: Record<string, string> = {
  identity: "fingerprint",
  "core-truths": "psychology",
  worldview: "public",
  voice: "record_voice_over",
  expertise: "school",
  boundaries: "shield",
  "memory-policy": "memory",
  "pet-peeves": "do_not_disturb",
};

const STAGES = [
  { icon: "shield", title: "Security Scan", desc: "58 regex patterns — prompt injection, code execution, XSS, secrets, privilege escalation" },
  { icon: "checklist", title: "Best Practices", desc: "8 recommended sections: Identity, Core Truths, Worldview, Voice, Expertise, Boundaries, Memory Policy, Pet Peeves" },
  { icon: "auto_awesome", title: "Content Quality", desc: "Length, structure, and completeness scoring against best practices" },
  { icon: "psychology", title: "LLM Deep Analysis", desc: "AI-powered semantic scan — weak areas, missing opinions, actionable improvements" },
  { icon: "bar_chart", title: "Scoring Engine", desc: "Base 100. Security error: -25. Warning: -5. Section bonus: +10" },
];

export default function SoulGatePage() {
  const t = useTranslations("soulgate");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [deepLoading, setDeepLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  const runScan = async (deep: boolean) => {
    if (content.trim().length < 10) {
      setError(t("minLength") || "Paste at least 10 characters.");
      return;
    }
    setError("");
    setResult(null);
    if (deep) setDeepLoading(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/soulgate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, deep }),
      });
      if (!res.ok) throw new Error(`Scan failed (${res.status})`);
      const data = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setLoading(false);
      setDeepLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dim">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

        {/* ─── Hero ─── */}
        <section className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
            <span className="material-symbols-outlined text-primary text-lg">shield</span>
            <span className="font-label-caps text-label-caps text-primary tracking-widest">SOULGATE</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            {t("heroTitle") || "Who's scanning your agent's soul?"}
          </h1>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("heroDesc") || "Scan your SOUL.md for security vulnerabilities, prompt injection patterns, and quality issues. Free. No sign-in required."}
          </p>
        </section>

        {/* ─── Scan Form ─── */}
        <div className="cyber-glass overflow-hidden mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "color-mix(in srgb, var(--color-primary) 40%, transparent)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "color-mix(in srgb, var(--color-primary) 25%, transparent)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)" }} />
            <span className="ml-4 font-mono text-xs text-muted-foreground tracking-wide">soulgate.exe</span>
          </div>

          <div className="p-6">
            <label className="block font-label-caps text-label-caps text-primary tracking-widest uppercase mb-3">
              SOUL.md
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`# My Agent\n\n## Identity\nYou are a helpful coding assistant...\n\n## Core Truths\n- Be direct...\n\n## Voice\nConcise. No fluff.\n\n## Boundaries\n- Won't execute destructive commands`}
              className="w-full h-56 p-4 rounded-lg bg-background border border-border text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/40"
            />

            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <button
                onClick={() => runScan(false)}
                disabled={loading || deepLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-label-caps tracking-widest uppercase rounded-lg hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <span className="material-symbols-outlined text-xl">shield</span>
                )}
                {loading ? (t("scanning") || "Scanning...") : (t("runScan") || "Run SoulGate")}
              </button>

              <button
                onClick={() => runScan(true)}
                disabled={loading || deepLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-primary text-primary font-label-caps tracking-widest uppercase rounded-lg hover:bg-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 disabled:opacity-50"
              >
                {deepLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <span className="material-symbols-outlined text-xl">psychology</span>
                )}
                {deepLoading ? (t("deepScanning") || "Deep Analysis...") : (t("deepScan") || "Deep Scan (AI)")}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Results ─── */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">
            <ScoreCard result={result} />
            {result.quality && <SectionCheck quality={result.quality} />}
            {result.findings.length > 0 && <FindingsList findings={result.findings} />}
            {result.quality?.llmAnalysis && <LLMCard analysis={result.quality.llmAnalysis} />}
          </div>
        )}

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-3 gap-4 mt-16 mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <StatCard icon="shield" number="58" label={t("securityPatterns") || "Security Patterns"} />
          <StatCard icon="checklist" number="8" label={t("bestPractices") || "Best Practices"} />
          <StatCard icon="timeline" number="5" label={t("scanStages") || "Scan Stages"} />
        </div>

        {/* ─── How it works ─── */}
        <div className="cyber-glass p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="font-display text-xl text-foreground mb-6">{t("howItWorks") || "How SoulGate Works"}</h2>
          <div className="space-y-4">
            {STAGES.map((stage, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">{stage.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-foreground">{stage.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Score Card ─── */
function ScoreCard({ result }: { result: ScanResult }) {
  const config = RATING_CONFIG[result.rating];
  const scorePercent = result.score;

  return (
    <div className="cyber-glass overflow-hidden">
      {/* Glow header bar */}
      <div
        className="h-1"
        style={{ background: config.bg, boxShadow: config.glow }}
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: `color-mix(in srgb, ${config.color} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${config.color} 30%, transparent)`,
              }}
            >
              <span className="material-symbols-outlined text-3xl" style={{ color: config.color }}>
                {config.icon}
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono" style={{ color: config.color }}>{result.score}<span className="text-lg text-muted-foreground">/100</span></p>
              <p className="text-sm font-medium tracking-wide" style={{ color: config.color }}>{config.label}</p>
            </div>
          </div>

          <div className="text-right space-y-1.5">
            <p className="text-sm text-muted-foreground">
              <span className="font-mono font-bold text-red-400">{result.summary.errors}</span> errors
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono font-bold text-yellow-400">{result.summary.warnings}</span> warnings
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono font-bold text-green-400">{result.summary.passed}</span> passed
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${scorePercent}%`,
              background: config.bg,
              boxShadow: `0 0 12px color-mix(in srgb, ${config.color} 40%, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Section Check ─── */
function SectionCheck({ quality }: { quality: NonNullable<ScanResult["quality"]> }) {
  const allSections = Object.keys(SECTION_LABELS);
  const foundCount = quality.sectionsFound.length;

  return (
    <div className="cyber-glass p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg text-foreground">
          <span className="material-symbols-outlined text-primary mr-2 align-middle">checklist</span>
          Best Practices
        </h3>
        <span className="font-mono text-sm text-muted-foreground">{foundCount}/{allSections.length}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {allSections.map((key) => {
          const found = quality.sectionsFound.includes(key);
          return (
            <div
              key={key}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-colors ${
                found
                  ? "border-primary/30 bg-primary/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ color: found ? "var(--primary)" : "#ef4444" }}>
                {found ? SECTION_ICONS[key] || "check_circle" : "cancel"}
              </span>
              <span className="text-xs font-medium text-foreground/80">{SECTION_LABELS[key]}</span>
            </div>
          );
        })}
      </div>

      {quality.suggestions.length > 0 && (
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-xs font-label-caps text-primary tracking-widest uppercase mb-3">Suggestions</p>
          <ul className="space-y-2">
            {quality.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="material-symbols-outlined text-primary/60 text-base mt-0.5">lightbulb</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Findings List ─── */
function FindingsList({ findings }: { findings: ScanFinding[] }) {
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");

  return (
    <div className="cyber-glass p-6">
      <h3 className="font-display text-lg text-foreground mb-5">
        <span className="material-symbols-outlined text-primary mr-2 align-middle">bug_report</span>
        Findings
        <span className="ml-3 font-mono text-sm text-muted-foreground">({findings.length})</span>
      </h3>
      <div className="space-y-2">
        {errors.map((f, i) => <FindingRow key={`e-${i}`} finding={f} />)}
        {warnings.map((f, i) => <FindingRow key={`w-${i}`} finding={f} />)}
      </div>
    </div>
  );
}

function FindingRow({ finding }: { finding: ScanFinding }) {
  const isError = finding.severity === "error";
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-lg border"
      style={{
        borderColor: isError ? "rgba(239,68,68,0.15)" : "rgba(250,204,21,0.15)",
        background: isError ? "rgba(239,68,68,0.05)" : "rgba(250,204,21,0.05)",
      }}
    >
      <span className="material-symbols-outlined text-base mt-0.5" style={{ color: isError ? "#ef4444" : "#facc15" }}>
        {isError ? "error" : "warning"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{finding.description}</p>
        {finding.line && (
          <p className="text-xs font-mono text-muted-foreground/60 mt-1">
            Line {finding.line} · {finding.ruleId}
          </p>
        )}
        {finding.snippet && (
          <pre className="mt-1.5 text-xs font-mono text-muted-foreground/40 truncate p-2 rounded bg-background/50">
            {finding.snippet}
          </pre>
        )}
      </div>
    </div>
  );
}

/* ─── LLM Analysis Card ─── */
function LLMCard({ analysis }: { analysis: string }) {
  return (
    <div className="cyber-glass overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-primary/10">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ boxShadow: "0 0 6px var(--primary)" }} />
        <span className="font-mono text-xs text-primary tracking-wide">AI_DEEP_ANALYSIS.MD</span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">psychology</span>
          </div>
          <h3 className="font-display text-lg text-foreground">AI Deep Analysis</h3>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
          {analysis}
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon, number, label }: { icon: string; number: string; label: string }) {
  return (
    <div className="text-center p-5 rounded-xl border border-border bg-surface/40 backdrop-blur-sm hover:border-primary/30 transition-colors">
      <span className="material-symbols-outlined text-primary/60 text-xl mb-2 block">{icon}</span>
      <p className="font-display text-2xl text-foreground mb-1">{number}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
