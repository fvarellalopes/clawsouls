import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';

const home = homedir();

export interface AgentConfig {
  name: string;
  displayName: string;
  soulPaths: string[];
  defaultSoulPath: string;
  detectInstalled: () => boolean;
}

export const agents: Record<string, AgentConfig> = {
  'claude-code': {
    name: 'claude-code',
    displayName: 'Claude Code',
    soulPaths: [join(home, '.claude', 'CLAUDE.md'), join(home, '.claude', 'SOUL.md')],
    defaultSoulPath: join(home, '.claude', 'SOUL.md'),
    detectInstalled: () => existsSync(join(home, '.claude')),
  },
  hermes: {
    name: 'hermes',
    displayName: 'Hermes Agent',
    soulPaths: [join(home, '.hermes', 'SOUL.md')],
    defaultSoulPath: join(home, '.hermes', 'SOUL.md'),
    detectInstalled: () => existsSync(join(home, '.hermes')),
  },
  cursor: {
    name: 'cursor',
    displayName: 'Cursor',
    soulPaths: [join(process.cwd(), '.cursorrules'), join(home, '.cursor', 'SOUL.md')],
    defaultSoulPath: join(process.cwd(), '.cursorrules'),
    detectInstalled: () => existsSync(join(process.cwd(), '.cursorrules')) || existsSync(join(home, '.cursor')),
  },
  codex: {
    name: 'codex',
    displayName: 'OpenAI Codex',
    soulPaths: [join(home, '.codex', 'instructions.md'), join(home, '.codex', 'SOUL.md')],
    defaultSoulPath: join(home, '.codex', 'SOUL.md'),
    detectInstalled: () => existsSync(join(home, '.codex')),
  },
  cline: {
    name: 'cline',
    displayName: 'Cline',
    soulPaths: [join(home, '.cline', 'SOUL.md')],
    defaultSoulPath: join(home, '.cline', 'SOUL.md'),
    detectInstalled: () => existsSync(join(home, '.cline')),
  },
  windsurf: {
    name: 'windsurf',
    displayName: 'Windsurf',
    soulPaths: [join(process.cwd(), '.windsurfrules'), join(home, '.windsurf', 'SOUL.md')],
    defaultSoulPath: join(process.cwd(), '.windsurfrules'),
    detectInstalled: () => existsSync(join(process.cwd(), '.windsurfrules')) || existsSync(join(home, '.windsurf')),
  },
  roo: {
    name: 'roo',
    displayName: 'Roo Code',
    soulPaths: [join(home, '.roo', 'SOUL.md')],
    defaultSoulPath: join(home, '.roo', 'SOUL.md'),
    detectInstalled: () => existsSync(join(home, '.roo')),
  },
  opencode: {
    name: 'opencode',
    displayName: 'OpenCode',
    soulPaths: [join(home, '.opencode', 'SOUL.md')],
    defaultSoulPath: join(home, '.opencode', 'SOUL.md'),
    detectInstalled: () => existsSync(join(home, '.opencode')),
  },
};

export function getInstalledAgents(): AgentConfig[] {
  return Object.values(agents).filter(a => a.detectInstalled());
}

export function getAllAgents(): AgentConfig[] {
  return Object.values(agents);
}
