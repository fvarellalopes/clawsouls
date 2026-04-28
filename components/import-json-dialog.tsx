"use client";

import { useState, useRef } from "react";
import { useSoulStore } from "@/store/soulStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileJson, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { parseSoulMD } from "@/lib/soulParser";
import { useTranslations } from "next-intl";

export function ImportJsonDialog() {
  const t = useTranslations("importJson");
  const [open, setOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const { importSoul } = useSoulStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const mdFileRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    const r = importSoul(jsonText);
    setResult(r);
    if (r.success) {
      setTimeout(() => {
        setOpen(false);
        setJsonText("");
        setResult(null);
      }, 1000);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setJsonText(ev.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleMdFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const parsed = parseSoulMD(text);
        if (parsed) {
          importSoul(JSON.stringify(parsed));
          setResult({ success: true });
          setTimeout(() => {
            setOpen(false);
            setResult(null);
          }, 1500);
        } else {
          setResult({ success: false, error: t("parseError") });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setJsonText(ev.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-purple-500/20">
          <Upload className="mr-2 h-4 w-4" />
          {t("importJson")}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a0f2e] border-purple-500/30 max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider flex items-center gap-2">
            <FileJson className="h-5 w-5 text-purple-400" />
            {t("importSoulConfig")}
          </DialogTitle>
          <DialogDescription>
            {t("importSoulConfigDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-purple-500/20 rounded-xl p-6 text-center hover:border-purple-400/40 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-purple-400/30 mx-auto mb-2" />
            <p className="text-sm text-purple-300/50">
              {t("dropJsonFile")}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json,.md,text/markdown"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <Textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='{"name": "MyBot", "creature": "AI Assistant", "emoji": "🤖", ...}'
            rows={8}
            className="bg-[#0d0820]/80 border-purple-500/20 rounded-xl resize-none font-mono text-sm"
          />

          {result && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                result.success
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-red-500/10 text-red-300"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">
                {result.success ? t("soulImported") : result.error}
              </span>
            </div>
          )}
        </div>

        {/* SOUL.md Import */}
        <div className="border-t border-purple-500/10 pt-4">
          <p className="text-xs text-purple-400/40 mb-3 uppercase tracking-wider">
            {t("orImportSoulMd")}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-purple-500/20"
            onClick={() => mdFileRef.current?.click()}
          >
            <FileText className="mr-2 h-4 w-4" />
            {t("importSoulMd")}
          </Button>
          <input
            ref={mdFileRef}
            type="file"
            accept=".md,text/markdown"
            className="hidden"
            onChange={handleMdFileSelect}
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!jsonText.trim()}
            className="bg-purple-600 text-white"
          >
            {t("import")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
