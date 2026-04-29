"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Share2, Check, ArrowRight, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

interface ShareActionsProps {
  dataParam: string;
}

export function ShareActions({ dataParam }: ShareActionsProps) {
  const t = useTranslations("share");
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

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "ClawSouls — AI Personality",
        text: "Check out this AI personality on ClawSouls!",
        url: shareUrl,
      });
    } catch {
      // User cancelled or share failed — fallback to copy
      handleCopy();
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-2xl font-semibold mb-4">{t("copyShareLink")}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t("copyShareLinkDesc")}
        </p>
        <div className="flex space-x-2">
          <label htmlFor="share-url-input" className="sr-only">Share URL</label>
          <Input id="share-url-input" readOnly value={shareUrl} className="flex-1" aria-label="Share URL" />
          <Button onClick={handleCopy} variant={copied ? "default" : "outline"}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t("copied")}
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                {t("copy")}
              </>
            )}
          </Button>
        </div>
        {canNativeShare && (
          <Button onClick={handleNativeShare} variant="outline" className="w-full mt-3">
            <Smartphone className="mr-2 h-4 w-4" />
            {t("shareVia")}
          </Button>
        )}
      </div>

      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-2xl font-semibold mb-4">{t("loadInEditor")}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t("loadInEditorDesc")}
        </p>
        <Button asChild className="w-full">
          <Link href={`/editor?data=${dataParam}`}>
            {t("openInEditor")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
