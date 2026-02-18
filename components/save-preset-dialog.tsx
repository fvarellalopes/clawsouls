"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSoulStore } from "@/store/soulStore";
import { useMyPresetsStore } from "@/store/myPresetsStore";
import { Save, Check } from "lucide-react";

export function SavePresetDialog() {
  const t = useTranslations("editor");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  
  const soul = useSoulStore((state) => state.soul);
  const addPreset = useMyPresetsStore((state) => state.add);

  const handleSave = () => {
    if (!name.trim()) return;
    
    addPreset({
      name: name.trim(),
      soul: soul,
    });
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
      setName("");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          {t("save") || "Save"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("savePreset") || "Save Preset"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="preset-name">{t("presetName") || "Preset Name"}</Label>
            <Input
              id="preset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={soul.name || "My Custom Preset"}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!name.trim() || saved}
            className="w-full gap-2"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                {t("saved") || "Saved!"}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t("saveToMyPresets") || "Save to My Presets"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
