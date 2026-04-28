"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { generateSoulMD } from "@/lib/soulGenerator";

import { SoulState } from "@/store/soulStore";

interface SoulPreviewProps {
  soul: SoulState["soul"];
}

export function SoulPreview({ soul }: SoulPreviewProps) {
  const markdown = generateSoulMD(soul);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SOUL.md Preview</CardTitle>
        <CardDescription>
          This is the exact Markdown that will be used by OpenClaw.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
          {markdown}
        </pre>
      </CardContent>
    </Card>
  );
}
