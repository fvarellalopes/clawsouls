import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface AgentInstall {
  name: string;
  soulPath: string;
  backupPath?: string;
}

export interface SoulRecord {
  preset: string;
  agents: AgentInstall[];
  installedAt: string;
}

const AGENTSOULS_DIR = join(homedir(), '.agentsouls');
const STATE_FILE_PATH = join(AGENTSOULS_DIR, 'souls-state.json');

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function loadState(): SoulRecord[] {
  ensureDir(AGENTSOULS_DIR);
  if (!existsSync(STATE_FILE_PATH)) return [];
  try {
    return JSON.parse(readFileSync(STATE_FILE_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

export function saveState(records: SoulRecord[]) {
  ensureDir(AGENTSOULS_DIR);
  writeFileSync(STATE_FILE_PATH, JSON.stringify(records, null, 2));
}
