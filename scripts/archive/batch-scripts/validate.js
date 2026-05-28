#!/usr/bin/env node
/**
 * ClawSouls project validator
 * Checks for common issues before commit/deploy
 */

import fs from "fs";
import path from "path";

const checks = [];
const errors = [];
const warnings = [];

// Check required files
const requiredFiles = [
  "package.json",
  "next.config.js",
  "tsconfig.json",
  "tailwind.config.ts",
  "app/layout.tsx",
  "store/soulStore.ts",
  "data/presets.ts",
  "lib/soulGenerator.ts",
  "middleware.ts",
  "messages/en.json",
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  if (!exists) {
    errors.push(`Missing required file: ${file}`);
  } else {
    checks.push(`✅ ${file}`);
  }
});

// Check that all presets have required fields
const presetsFile = fs.readFileSync(path.join(process.cwd(), "data/presets.ts"), "utf-8");
const presetMatch = presetsFile.match(/export const presets = (\[[\s\S]*?\]);/);
if (presetMatch) {
  try {
    // eslint-disable-next-line no-eval
    const presets = eval(presetMatch[1]);
    presets.forEach((preset, i) => {
      if (!preset.id) errors.push(`Preset ${i} missing id`);
      if (!preset.name) errors.push(`Preset ${i} missing name`);
      if (!preset.vibe) errors.push(`Preset ${i} missing vibe`);
    });
    checks.push(`✅ ${presets.length} presets validated`);
  } catch (e) {
    warnings.push("Could not parse presets file");
  }
}

// Check translation files have same keys
const en = JSON.parse(fs.readFileSync("messages/en.json", "utf-8"));
const pt = JSON.parse(fs.readFileSync("messages/pt.json", "utf-8"));
const es = JSON.parse(fs.readFileSync("messages/es.json", "utf-8"));
const ja = JSON.parse(fs.readFileSync("messages/ja.json", "utf-8"));

const keys = Object.keys(en.common).sort();
if (JSON.stringify(Object.keys(pt.common).sort()) !== JSON.stringify(keys)) {
  warnings.push("PT translation missing some common keys");
}
if (JSON.stringify(Object.keys(es.common).sort()) !== JSON.stringify(keys)) {
  warnings.push("ES translation missing some common keys");
}
if (JSON.stringify(Object.keys(ja.common).sort()) !== JSON.stringify(keys)) {
  warnings.push("JA translation missing some common keys");
}
checks.push("✅ Translation files structure OK");

// Summary
console.log("\n🔍 ClawSouls Validation Report\n");
console.log("Checks passed:");
checks.forEach(c => console.log(c));

if (warnings.length) {
  console.log("\n⚠️  Warnings:");
  warnings.forEach(w => console.log(`  ${w}`));
}

if (errors.length) {
  console.log("\n❌ Errors:");
  errors.forEach(e => console.log(`  ${e}`));
  process.exit(1);
}

console.log("\n✅ Project looks good to go!\n");
process.exit(0);
