"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ParchmentPreviewProps {
  content: string;
  name: string;
  emoji: string;
}

export function ParchmentPreview({ content, name, emoji }: ParchmentPreviewProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      {/* Parchment container */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Glow border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 via-amber-500/20 to-purple-500/30 p-[1px]">
          <div className="w-full h-full rounded-2xl bg-[#1a0f2e]" />
        </div>

        {/* Content */}
        <div className="relative p-6 md:p-8">
          {/* Header with emoji and name */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <motion.span
                className="text-4xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {emoji || "✨"}
              </motion.span>
              <div>
                <h3 className="text-xl font-bold text-gradient font-display">
                  {name || "Unnamed Soul"}
                </h3>
                <p className="text-sm text-purple-300/60">SOUL.md Preview</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="text-purple-300 hover:text-purple-100"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* Rendered markdown */}
          <div className="space-y-3 font-body text-[15px] leading-relaxed">
            {sections.map((section, i) => {
              if (section.type === "title") {
                return (
                  <motion.h2
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="text-2xl font-display font-bold text-amber-400/90 tracking-wider uppercase mt-4 first:mt-0"
                  >
                    {section.content}
                  </motion.h2>
                );
              }
              if (section.type === "section") {
                return (
                  <motion.h3
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="text-lg font-display font-semibold text-purple-300 tracking-wide uppercase mt-5 mb-2 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500/60" />
                    {section.content}
                  </motion.h3>
                );
              }
              if (section.type === "divider") {
                return (
                  <div key={i} className="my-4 flex items-center gap-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                    <span className="text-purple-500/40 text-xs">✦</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                  </div>
                );
              }
              if (section.type === "item") {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-start gap-2 pl-2 text-purple-100/80"
                  >
                    <span className="text-amber-500/60 mt-1 text-xs">▸</span>
                    <span>{section.content}</span>
                  </motion.div>
                );
              }
              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="text-purple-100/70"
                >
                  {section.content}
                </motion.p>
              );
            })}
          </div>

          {/* Footer watermark */}
          <div className="mt-6 pt-4 border-t border-purple-500/10 text-center">
            <span className="text-[10px] text-purple-500/30 tracking-widest uppercase font-display">
              Forged in ClawSouls ✦ {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
