import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { getAllAgents, getInstalledAgents, type AgentConfig } from '../agents.js';
import { loadState, saveState, type SoulRecord } from '../state.js';
import { searchPresets, getPresetBySlug, getAllPresets } from '../presets.js';
import { generateSoulMd } from '../soulGenerator.js';

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function selectAgents(): Promise<AgentConfig[]> {
  const allAgents = getAllAgents();
  const installed = getInstalledAgents();
  const installedNames = new Set(installed.map(a => a.name));

  const { selected } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selected',
    message: 'Select agents to install the soul into:',
    choices: allAgents.map(a => ({
      name: `${a.displayName}${installedNames.has(a.name) ? chalk.green(' (detected)') : ''}`,
      value: a.name,
      checked: installedNames.has(a.name),
    })),
    validate: (input: string[]) => input.length > 0 || 'Select at least one agent',
  }]);

  return selected.map((name: string) => allAgents.find(a => a.name === name)!);
}

async function resolveInstallPath(agent: AgentConfig): Promise<{ path: string; mode: 'replace' | 'append' }> {
  for (const soulPath of agent.soulPaths) {
    if (existsSync(soulPath)) {
      const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: `${agent.displayName}: Found existing file at ${chalk.cyan(soulPath)}`,
        choices: [
          { name: 'Replace (backup original as .backup)', value: 'replace' },
          { name: 'Append soul to end of file', value: 'append' },
        ],
      }]);
      return { path: soulPath, mode: action };
    }
  }
  return { path: agent.defaultSoulPath, mode: 'replace' };
}

// ─── ADD ──────────────────────────────────────────────────────────────
export async function addCommand(presetSlug?: string) {
  if (!presetSlug) {
    const { query } = await inquirer.prompt([{
      type: 'input',
      name: 'query',
      message: 'Search for a soul (name or keyword):',
    }]);

    const results = searchPresets(query);
    if (results.length === 0) {
      console.log(chalk.yellow('No souls found.'));
      return;
    }

    const { chosen } = await inquirer.prompt([{
      type: 'list',
      name: 'chosen',
      message: 'Select a soul:',
      choices: results.slice(0, 20).map(p => ({
        name: `${p.emoji || '🎭'} ${p.name} — ${p.creature} ${chalk.dim(`(${p.vibeStyle || 'balanced'})`)}`,
        value: p.id,
      })),
      pageSize: 15,
    }]);
    presetSlug = chosen;
  }

  const preset = getPresetBySlug(presetSlug!);
  if (!preset) {
    console.log(chalk.red(`Soul "${presetSlug}" not found.`));
    return;
  }

  // Generate SOUL.md locally
  const soulContent = generateSoulMd(preset);
  console.log(chalk.green(`✓ Generated SOUL.md for "${preset.name}"`));

  // Select agents
  const selectedAgents = await selectAgents();
  if (selectedAgents.length === 0) {
    console.log(chalk.yellow('No agents selected.'));
    return;
  }

  // Install
  const state = loadState();
  const record: SoulRecord = {
    preset: presetSlug!,
    agents: [],
    installedAt: new Date().toISOString(),
  };

  for (const agent of selectedAgents) {
    const { path: installPath, mode } = await resolveInstallPath(agent);
    const backupPath = installPath + '.backup';

    if (existsSync(installPath)) {
      copyFileSync(installPath, backupPath);
      console.log(chalk.dim(`  ↳ Backup: ${backupPath}`));
    }

    ensureDir(dirname(installPath));
    if (mode === 'append') {
      const existing = readFileSync(installPath, 'utf-8');
      writeFileSync(installPath, existing + '\n\n' + soulContent);
    } else {
      writeFileSync(installPath, soulContent);
    }

    console.log(chalk.green(`  ✓ ${agent.displayName}: ${installPath}`));
    record.agents.push({
      name: agent.name,
      soulPath: installPath,
      backupPath: existsSync(backupPath) ? backupPath : undefined,
    });
  }

  const filtered = state.filter(r => r.preset !== presetSlug);
  filtered.push(record);
  saveState(filtered);

  console.log(chalk.green(`\n✓ Soul "${presetSlug}" installed into ${selectedAgents.length} agent(s)`));
  console.log(chalk.dim(`  Run ${chalk.white('agentsouls remove ' + presetSlug)} to restore backups`));
}

// ─── REMOVE ───────────────────────────────────────────────────────────
export async function removeCommand(presetSlug?: string) {
  const state = loadState();
  if (state.length === 0) {
    console.log(chalk.yellow('No souls installed.'));
    return;
  }

  if (!presetSlug) {
    const { chosen } = await inquirer.prompt([{
      type: 'list',
      name: 'chosen',
      message: 'Select a soul to remove:',
      choices: state.map(r => ({
        name: `${r.preset} → ${r.agents.map(a => a.name).join(', ')}`,
        value: r.preset,
      })),
    }]);
    presetSlug = chosen;
  }

  const record = state.find(r => r.preset === presetSlug);
  if (!record) {
    console.log(chalk.yellow(`Soul "${presetSlug}" not found.`));
    return;
  }

  for (const agent of record.agents) {
    if (agent.backupPath && existsSync(agent.backupPath)) {
      const backup = readFileSync(agent.backupPath, 'utf-8');
      ensureDir(dirname(agent.soulPath));
      writeFileSync(agent.soulPath, backup);
      unlinkSync(agent.backupPath);
      console.log(chalk.green(`  ✓ ${agent.name}: Restored backup`));
    } else if (existsSync(agent.soulPath)) {
      unlinkSync(agent.soulPath);
      console.log(chalk.green(`  ✓ ${agent.name}: Removed`));
    }
  }

  saveState(state.filter(r => r.preset !== presetSlug));
  console.log(chalk.green(`\n✓ Soul "${presetSlug}" removed`));
}

// ─── LIST ─────────────────────────────────────────────────────────────
export async function listCommand() {
  const state = loadState();
  if (state.length === 0) {
    console.log(chalk.yellow('No souls installed.'));
    console.log(chalk.dim(`  Run ${chalk.white('agentsouls add')} to install a soul`));
    return;
  }

  console.log(chalk.bold('\nInstalled Souls:\n'));
  for (const record of state) {
    const agentNames = record.agents.map(a =>
      existsSync(a.soulPath) ? chalk.green(a.name) : chalk.red(a.name + ' (missing)')
    );
    console.log(`  ${chalk.cyan(record.preset)} → ${agentNames.join(', ')}`);
    console.log(chalk.dim(`    Installed: ${new Date(record.installedAt).toLocaleDateString()}`));
  }
  console.log('');
}

// ─── BROWSE ───────────────────────────────────────────────────────────
export async function browseCommand() {
  const presets = getAllPresets();
  console.log(chalk.green(`✓ Loaded ${presets.length} souls from local data`));

  const groups = new Map<string, typeof presets>();
  for (const p of presets) {
    const key = p.creature || 'Unknown';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }

  const { category } = await inquirer.prompt([{
    type: 'list',
    name: 'category',
    message: 'Browse by category:',
    choices: [...groups.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([creature, presets]) => ({
        name: `${creature} (${presets.length})`,
        value: creature,
      })),
    pageSize: 20,
  }]);

  const categoryPresets = groups.get(category) || [];
  const { chosen } = await inquirer.prompt([{
    type: 'list',
    name: 'chosen',
    message: `${category} — Select a soul:`,
    choices: categoryPresets.map(p => ({
      name: `${p.emoji || '🎭'} ${p.name} — ${p.description?.slice(0, 60) || p.creature}`,
      value: p.id,
    })),
    pageSize: 20,
  }]);

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: `Install "${chosen}"?`,
    choices: [
      { name: 'Install now', value: 'install' },
      { name: 'Go back', value: 'back' },
    ],
  }]);

  if (action === 'install') await addCommand(chosen);
}

// ─── SEARCH ───────────────────────────────────────────────────────────
export async function searchCommand(query?: string) {
  if (!query) {
    const answer = await inquirer.prompt([{
      type: 'input',
      name: 'query',
      message: 'Search for a soul:',
    }]);
    query = answer.query;
  }

  const results = searchPresets(query!);
  if (results.length === 0) {
    console.log(chalk.yellow(`No souls found for "${query}".`));
    return;
  }

  console.log(chalk.bold(`\nFound ${results.length} souls:\n`));

  const { chosen } = await inquirer.prompt([{
    type: 'list',
    name: 'chosen',
    message: 'Select a soul:',
    choices: results.slice(0, 30).map(p => ({
      name: `${p.emoji || '🎭'} ${p.name} — ${p.creature} ${chalk.dim(`(${p.vibeStyle || 'balanced'})`)}`,
      value: p.id,
    })),
    pageSize: 15,
  }]);

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: `Install "${chosen}"?`,
    choices: [
      { name: 'Install now', value: 'install' },
      { name: 'Go back', value: 'back' },
    ],
  }]);

  if (action === 'install') await addCommand(chosen);
}

// ─── DIFF ─────────────────────────────────────────────────────────────
export async function diffCommand(presetSlug?: string) {
  const state = loadState();
  if (state.length === 0) {
    console.log(chalk.yellow('No souls installed.'));
    return;
  }

  if (!presetSlug) {
    const { chosen } = await inquirer.prompt([{
      type: 'list',
      name: 'chosen',
      message: 'Select a soul to diff:',
      choices: state.map(r => ({
        name: `${r.preset} → ${r.agents.map(a => a.name).join(', ')}`,
        value: r.preset,
      })),
    }]);
    presetSlug = chosen;
  }

  const record = state.find(r => r.preset === presetSlug);
  if (!record) {
    console.log(chalk.yellow(`Soul "${presetSlug}" not found.`));
    return;
  }

  for (const agent of record.agents) {
    console.log(chalk.bold(`\n${agent.name}:`));

    if (!agent.backupPath || !existsSync(agent.backupPath)) {
      console.log(chalk.dim('  No backup found (first install)'));
      continue;
    }
    if (!existsSync(agent.soulPath)) {
      console.log(chalk.red('  Soul file missing!'));
      continue;
    }

    const current = readFileSync(agent.soulPath, 'utf-8');
    const backup = readFileSync(agent.backupPath, 'utf-8');

    if (current === backup) {
      console.log(chalk.green('  No changes'));
      continue;
    }

    const currentLines = current.split('\n');
    const backupLines = backup.split('\n');
    let diffCount = 0;
    for (let i = 0; i < Math.max(currentLines.length, backupLines.length) && diffCount < 20; i++) {
      if (currentLines[i] !== backupLines[i]) {
        diffCount++;
        if (backupLines[i] !== undefined) console.log(chalk.red(`  - ${i + 1}: ${backupLines[i].slice(0, 80)}`));
        if (currentLines[i] !== undefined) console.log(chalk.green(`  + ${i + 1}: ${currentLines[i].slice(0, 80)}`));
      }
    }
    console.log(chalk.dim(`  Lines: ${backupLines.length} → ${currentLines.length}`));
  }
  console.log('');
}
