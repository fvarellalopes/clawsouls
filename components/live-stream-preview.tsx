"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

interface LiveStreamPreviewProps {
  content: string;
  name: string;
  emoji: string;
  toneAttributes?: {
    humor: number;
    formality: number;
    emojiUsage: number;
    verbosity: number;
    consciousness: number;
    questioning: number;
  };
}

export function LiveStreamPreview({ content, name, emoji, toneAttributes }: LiveStreamPreviewProps) {
  const [copied, setCopied] = useState(false);

  const sections = useMemo(() => {
    const lines = content.split("\n");
    const result: { type: "title" | "section" | "item" | "text" | "divider"; content: string }[] = [];

    for (const line of lines) {
      if (line.startsWith("# ") && !line.startsWith("## ")) {
        result.push({ type: "title", content: line.replace("# ", "") });
      } else if (line.startsWith("## ")) {
        result.push({ type: "section", content: line.replace("## ", "") });
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        result.push({ type: "item", content: line.replace(/^[-*]\s+/, "") });
      } else if (line.startsWith("---")) {
        result.push({ type: "divider", content: "" });
      } else if (line.trim()) {
        result.push({ type: "text", content: line });
      }
    }

    return result;
  }, [content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative font-mono" style={{ animation: "fadeInUp 0.4s ease-out" }}>
      {/* Terminal window */}
      <div className="relative rounded-2xl overflow-hidden bg-[#09090b] border border-white/10 shadow-[0_0_20px_rgba(250,204,21,0.05)]">
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#131315] border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-[12px] text-white/40 tracking-wider">
              LIVE_STREAM.MD
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors hover:text-[#facc15]"
            style={{ color: copied ? "#4ade80" : "rgba(255,255,255,0.4)" }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}>
          
          <div className="mb-8 flex items-center gap-4">
            <span className="text-3xl filter grayscale opacity-80">{emoji || "⚡"}</span>
            <div>
              <h3 className="text-lg text-[#facc15] font-bold tracking-tight">
                {name ? name.toUpperCase() : "UNNAMED_SOUL"}
              </h3>
              <p className="text-[10px] text-white/40 tracking-widest mt-1">STATUS: ONLINE</p>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
            {sections.map((section, i) => {
              if (section.type === "title") {
                return (
                  <div key={i} className="text-[#facc15] font-bold tracking-widest mt-6 first:mt-0 text-base">
                    # {section.content.toUpperCase()}
                  </div>
                );
              }
              if (section.type === "section") {
                return (
                  <div key={i} className="text-[#ffecb9] font-semibold mt-6 mb-2">
                    ## {section.content}
                  </div>
                );
              }
              if (section.type === "divider") {
                return (
                  <div key={i} className="my-6 border-t border-dashed border-white/20" />
                );
              }
              if (section.type === "item") {
                return (
                  <div key={i} className="flex items-start gap-2 pl-4">
                    <span className="text-[#facc15] mt-0.5">{`>`}</span>
                    <span className="text-white/80">{section.content}</span>
                  </div>
                );
              }
              return (
                <p key={i} className="text-white/60">
                  {section.content}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
