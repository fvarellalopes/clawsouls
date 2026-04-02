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
import { Upload, FileJson, AlertCircle, CheckCircle2 } from "lucide-react";

export function ImportJsonDialog() {
  const [open, setOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const { importSoul } = useSoulStore();
  const fileRef = useRef<HTMLInputElement>(null);

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
          Import JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a0f2e] border-purple-500/30 max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider flex items-center gap-2">
            <FileJson className="h-5 w-5 text-purple-400" />
            Import Soul Config
          </DialogTitle>
          <DialogDescription>
            Paste JSON or drag a .json file to load a soul configuration.
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
              Drop a .json file here or click to browse
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
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
                {result.success ? "Soul imported successfully!" : result.error}
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!jsonText.trim()}
            className="bg-purple-600 text-white"
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
