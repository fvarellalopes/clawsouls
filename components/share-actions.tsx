"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Share2, Check, ArrowRight } from "lucide-react";

interface ShareActionsProps {
  dataParam: string;
}

export function ShareActions({ dataParam }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share?data=${dataParam}`
    : `/share?data=${dataParam}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-2xl font-semibold mb-4">Copy Share Link</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Anyone with this link can load this personality into ClawSouls.
        </p>
        <div className="flex space-x-2">
          <Input readOnly value={shareUrl} className="flex-1" />
          <Button onClick={handleCopy} variant={copied ? "default" : "outline"}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-2xl font-semibold mb-4">Load in Editor</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Want to customize this personality? Open it in the editor.
        </p>
        <Button asChild className="w-full">
          <Link href={`/editor?data=${dataParam}`}>
            Open in Editor
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
