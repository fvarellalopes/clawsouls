#!/usr/bin/env node

/**
 * ClawSouls CLI - Generate SOUL.md from preset or JSON
 *
 * Usage:
 *   npx clawsouls generate --preset="Luffy"
 *   npx clawsouls generate --file=preset.json
 *   npx clawsouls list-presets
 *   npx clawsouls export --preset="GLaDOS" --format=json
 */

import { program } from 'commander';
import { presets } from '../data/presets.js';
import { generateSoulMD } from '../lib/soulGenerator.js';
import { readFileSync, writeFileSync } from 'fs';

program
  .name('clawsouls')
  .description('CLI for ClawSouls - generate SOUL.md personalities')
  .version('0.1.0');

program
  .command('generate')
  .description('Generate a SOUL.md from a preset')
  .option('--preset <name>', 'Preset name to use')
  .option('--file <path>', 'JSON file with soul data')
  .action(async (options) => {
    let soul;

    if (options.file) {
      try {
        const data = readFileSync(options.file, 'utf-8');
        soul = JSON.parse(data);
      } catch (e) {
        console.error('Failed to read file:', e.message);
        process.exit(1);
      }
    } else if (options.preset) {
      const preset = presets.find(p => 
        p.name.toLowerCase() === options.preset.toLowerCase()
      );
      if (!preset) {
        console.error(`Preset "${options.preset}" not found.`);
        console.log('Available presets:', presets.map(p => p.name).join(', '));
        process.exit(1);
      }
      soul = preset;
    } else {
      console.error('Either --preset or --file is required.');
      process.exit(1);
    }

    const md = generateSoulMD(soul);
    process.stdout.write(md);
  });

program
  .command('list-presets')
  .description('List available presets')
  .action(() => {
    console.log('Available presets:');
    presets.forEach(p => {
      console.log(`  - ${p.name} (${p.creature})`);
    });
  });

program
  .command('export')
  .description('Export preset to JSON file')
  .option('--preset <name>', 'Preset name to export')
  .option('--output <path>', 'Output file path', 'preset.json')
  .action((options) => {
    if (!options.preset) {
      console.error('--preset is required');
      process.exit(1);
    }
    const preset = presets.find(p => 
      p.name.toLowerCase() === options.preset.toLowerCase()
    );
    if (!preset) {
      console.error(`Preset "${options.preset}" not found.`);
      process.exit(1);
    }
    writeFileSync(options.output, JSON.stringify(preset, null, 2));
    console.log(`Exported to ${options.output}`);
  });

program.parse();
