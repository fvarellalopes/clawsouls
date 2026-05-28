import fs from "fs";
import path from "path";

const PRESETS_FILE = "./data/presets.ts";
const MESSAGES_DIR = "./messages/";
const LANGUAGES = ["en", "pt", "es", "fr", "de", "ja", "zh"];

function parsePresetsFromTS(content) {
  const presets = [];
  const regex =
    /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*creature:\s*"([^"]+)",\s*vibe:\s*"([^"]+)",/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    presets.push({
      id: match[1],
      name: match[2],
      creature: match[3],
      vibe: match[4],
    });
  }

  return presets;
}

function readJsonFile(filepath) {
  const content = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(content);
}

function writeJsonFile(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + "\n");
}

function main() {
  console.log("Reading presets.ts...");
  const presetsContent = fs.readFileSync(PRESETS_FILE, "utf-8");
  const tsPresets = parsePresetsFromTS(presetsContent);
  console.log(`Found ${tsPresets.length} presets in presets.ts`);

  const tsPresetIds = new Set(tsPresets.map((p) => p.id));

  const languageData = {};

  console.log("Reading language files...");
  for (const lang of LANGUAGES) {
    const filepath = path.join(MESSAGES_DIR, `${lang}.json`);
    languageData[lang] = readJsonFile(filepath);

    const existingPresetIds = languageData[lang].presets
      ? Object.keys(languageData[lang].presets)
      : [];
    console.log(`  ${lang}.json: ${existingPresetIds.length} presets`);
  }

  const enPresetIds = new Set(Object.keys(languageData.en.presets || {}));

  const newPresets = tsPresets.filter((p) => !enPresetIds.has(p.id));
  console.log(`\nFound ${newPresets.length} NEW presets (not in en.json)`);

  if (newPresets.length > 0) {
    console.log("New preset IDs:", newPresets.map((p) => p.id).join(", "));

    for (const lang of LANGUAGES) {
      if (!languageData[lang].presets) {
        languageData[lang].presets = {};
      }

      for (const preset of newPresets) {
        languageData[lang].presets[preset.id] = {
          name: preset.name,
          creature: preset.creature,
          vibe: preset.vibe,
          description: preset.vibe,
        };
      }

      console.log(
        `  ${lang}.json: now has ${Object.keys(languageData[lang].presets).length} presets`,
      );
    }

    console.log("\nWriting updated language files...");
    for (const lang of LANGUAGES) {
      const filepath = path.join(MESSAGES_DIR, `${lang}.json`);
      writeJsonFile(filepath, languageData[lang]);
      console.log(`  Updated ${lang}.json`);
    }

    console.log(
      "\n✅ Done! All language files now have the same preset count.",
    );
  } else {
    console.log(
      "\n✅ All presets already exist in en.json. No updates needed.",
    );
  }

  for (const lang of LANGUAGES) {
    const count = Object.keys(languageData[lang].presets || {}).length;
    console.log(`  ${lang}: ${count} presets`);
  }
}

main();
