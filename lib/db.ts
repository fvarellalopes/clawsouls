import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'database.sqlite');

export type Preset = {
  id: string;
  name: string;
  creature: string;
  vibe?: string;
  emoji?: string;
  avatar?: string;
  core_truths_helpful?: boolean;
  core_truths_opinions?: boolean;
  core_truths_resourceful?: boolean;
  core_truths_trustworthy?: boolean;
  core_truths_respectful?: boolean;
  boundaries_private?: boolean;
  boundaries_ask_before_acting?: boolean;
  boundaries_no_half_baked?: boolean;
  boundaries_not_voice_proxy?: boolean;
  vibe_style?: string;
  humor?: number;
  formality?: number;
  emoji_usage?: number;
  verbosity?: number;
  consciousness?: number;
  questioning?: number;
  description?: string;
  tags?: string[];
  source?: string;
  created_at?: string;
  updated_at?: string;
};

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(DB_PATH);
  return db;
}

function rowToPreset(row: any): Preset {
  return {
    id: row.id,
    name: row.name,
    creature: row.creature,
    vibe: row.vibe,
    emoji: row.emoji,
    avatar: row.avatar,
    core_truths_helpful: Boolean(row.core_truths_helpful),
    core_truths_opinions: Boolean(row.core_truths_opinions),
    core_truths_resourceful: Boolean(row.core_truths_resourceful),
    core_truths_trustworthy: Boolean(row.core_truths_trustworthy),
    core_truths_respectful: Boolean(row.core_truths_respectful),
    boundaries_private: Boolean(row.boundaries_private),
    boundaries_ask_before_acting: Boolean(row.boundaries_ask_before_acting),
    boundaries_no_half_baked: Boolean(row.boundaries_no_half_baked),
    boundaries_not_voice_proxy: Boolean(row.boundaries_not_voice_proxy),
    vibe_style: row.vibe_style,
    humor: Number(row.humor),
    formality: Number(row.formality),
    emoji_usage: Number(row.emoji_usage),
    verbosity: Number(row.verbosity),
    consciousness: Number(row.consciousness),
    questioning: Number(row.questioning),
    description: row.description,
    tags: row.tags ? JSON.parse(row.tags) : [],
    source: row.source,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function list_presets(
  limit: number = 50,
  offset: number = 0,
  creature?: string,
  source?: string,
  tags?: string[],
  search?: string
): Preset[] {
  const database = getDb();

  let query = 'SELECT * FROM presets WHERE 1=1';
  const params: any[] = [];

  if (creature) {
    query += ' AND creature = ?';
    params.push(creature);
  }
  if (source) {
    query += ' AND source = ?';
    params.push(source);
  }
  if (search) {
    query += ' AND (name LIKE ? OR vibe LIKE ? OR description LIKE ?)';
    const searchPat = `%${search}%`;
    params.push(searchPat, searchPat, searchPat);
  }
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      query += " AND tags LIKE ?";
      params.push(`%"${tag}"%`);
    }
  }

  query += ' ORDER BY name LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = database.prepare(query);
  const rows = stmt.all(...params);
  return rows.map(rowToPreset);
}

export function get_preset_by_id(preset_id: string): Preset | null {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM presets WHERE id = ?');
  const row = stmt.get(preset_id);
  return row ? rowToPreset(row) : null;
}

export function count_presets(
  creature?: string,
  source?: string,
  tags?: string[],
  search?: string
): number {
  const database = getDb();

  let query = 'SELECT COUNT(*) as cnt FROM presets WHERE 1=1';
  const params: any[] = [];

  if (creature) {
    query += ' AND creature = ?';
    params.push(creature);
  }
  if (source) {
    query += ' AND source = ?';
    params.push(source);
  }
  if (search) {
    query += ' AND (name LIKE ? OR vibe LIKE ? OR description LIKE ?)';
    const searchPat = `%${search}%`;
    params.push(searchPat, searchPat, searchPat);
  }
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      query += " AND tags LIKE ?";
      params.push(`%"${tag}"%`);
    }
  }

  const stmt = database.prepare(query);
  const row = stmt.get(...params) as { cnt: number };
  return row ? Number(row.cnt) : 0;
}

export function get_creature_types(): string[] {
  const database = getDb();
  const stmt = database.prepare('SELECT DISTINCT creature FROM presets ORDER BY creature');
  const rows = stmt.all() as { creature: string }[];
  return rows.map(r => r.creature);
}

export function get_sources(): string[] {
  const database = getDb();
  const stmt = database.prepare('SELECT DISTINCT source FROM presets ORDER BY source');
  const rows = stmt.all() as { source: string }[];
  return rows.map(r => r.source);
}

export function insert_preset(preset: Preset): boolean {
  const database = getDb();

  const sql = `
    INSERT INTO presets (
      id, name, creature, vibe, emoji, avatar,
      core_truths_helpful, core_truths_opinions, core_truths_resourceful,
      core_truths_trustworthy, core_truths_respectful,
      boundaries_private, boundaries_ask_before_acting,
      boundaries_no_half_baked, boundaries_not_voice_proxy,
      vibe_style, humor, formality, emoji_usage, verbosity,
      consciousness, questioning, description, tags, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const stmt = database.prepare(sql);
    stmt.run(
      preset.id,
      preset.name,
      preset.creature || 'Human',
      preset.vibe || null,
      preset.emoji || '😊',
      preset.avatar || null,
      preset.core_truths_helpful ?? true ? 1 : 0,
      preset.core_truths_opinions ?? true ? 1 : 0,
      preset.core_truths_resourceful ?? true ? 1 : 0,
      preset.core_truths_trustworthy ?? true ? 1 : 0,
      preset.core_truths_respectful ?? true ? 1 : 0,
      preset.boundaries_private ?? true ? 1 : 0,
      preset.boundaries_ask_before_acting ?? false ? 1 : 0,
      preset.boundaries_no_half_baked ?? false ? 1 : 0,
      preset.boundaries_not_voice_proxy ?? true ? 1 : 0,
      preset.vibe_style || 'balanced',
      preset.humor ?? 50,
      preset.formality ?? 50,
      preset.emoji_usage ?? 10,
      preset.verbosity ?? 50,
      preset.consciousness ?? 50,
      preset.questioning ?? 30,
      preset.description || null,
      JSON.stringify(preset.tags || []),
      preset.source || 'character'
    );
    return true;
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return false;
    }
    throw err;
  }
}

export function health_check(): { status: string; total_presets: number; creature_types: number; sources: number; db_path: string } {
  const database = getDb();

  const totalRow = database.prepare('SELECT COUNT(*) as cnt FROM presets').get() as { cnt: number };
  const creatureRow = database.prepare('SELECT COUNT(DISTINCT creature) as cnt FROM presets').get() as { cnt: number };
  const sourcesRow = database.prepare('SELECT COUNT(DISTINCT source) as cnt FROM presets').get() as { cnt: number };

  return {
    status: 'healthy',
    total_presets: Number(totalRow.cnt),
    creature_types: Number(creatureRow.cnt),
    sources: Number(sourcesRow.cnt),
    db_path: DB_PATH
  };
}
