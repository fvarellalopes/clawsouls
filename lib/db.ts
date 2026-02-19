import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Types
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

// Supabase client (singleton)
let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceRoleKey) {
    supabase = createClient(url, serviceRoleKey);
    return supabase;
  }

  return null;
}

// SQLite fallback
const DB_PATH = path.join(process.cwd(), 'data', 'database.sqlite');
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
    tags: row.tags || [],
    source: row.source,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// API functions (async)
export async function list_presets(
  limit: number = 50,
  offset: number = 0,
  creature?: string,
  source?: string,
  tags?: string[],
  search?: string
): Promise<Preset[]> {
  const supabaseClient = getSupabase();
  if (supabaseClient) {
    let query = supabaseClient.from('presets').select('*');

    if (creature) query = query.eq('creature', creature);
    if (source) query = query.eq('source', source);
    if (search) query = query.or(`name.ilike.%${search}%,vibe.ilike.%${search}%,description.ilike.%${search}%`);
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        query = query.contains('tags', [tag]);
      }
    }

    query = query.range(offset, offset + limit - 1).order('name', { ascending: true });

    const { data, error } = await query;
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    return (data || []).map(rowToPreset);
  }

  // SQLite fallback (sync)
  return list_presets_sync(limit, offset, creature, source, tags, search);
}

function list_presets_sync(
  limit: number,
  offset: number,
  creature?: string,
  source?: string,
  tags?: string[],
  search?: string
): Preset[] {
  const database = getDb();
  let sql = 'SELECT * FROM presets WHERE 1=1';
  const params: any[] = [];

  if (creature) {
    sql += ' AND creature = ?';
    params.push(creature);
  }
  if (source) {
    sql += ' AND source = ?';
    params.push(source);
  }
  if (search) {
    sql += ' AND (name LIKE ? OR vibe LIKE ? OR description LIKE ?)';
    const searchPat = `%${search}%`;
    params.push(searchPat, searchPat, searchPat);
  }
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      sql += " AND tags LIKE ?";
      params.push(`%"${tag}"%`);
    }
  }

  sql += ' ORDER BY name LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = database.prepare(sql);
  const rows = stmt.all(...params);
  return rows.map(rowToPreset);
}

export async function get_preset_by_id(preset_id: string): Promise<Preset | null> {
  const supabaseClient = getSupabase();
  if (supabaseClient) {
    const { data, error } = await supabaseClient.from('presets').select('*').eq('id', preset_id).single();
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Supabase error:', error);
      return null;
    }
    return data ? rowToPreset(data) : null;
  }

  const database = getDb();
  const stmt = database.prepare('SELECT * FROM presets WHERE id = ?');
  const row = stmt.get(preset_id);
  return row ? rowToPreset(row) : null;
}

export async function count_presets(
  creature?: string,
  source?: string,
  tags?: string[],
  search?: string
): Promise<number> {
  const supabaseClient = getSupabase();
  if (supabaseClient) {
    let query = supabaseClient.from('presets').select('*', { count: 'exact', head: true });

    if (creature) query = query.eq('creature', creature);
    if (source) query = query.eq('source', source);
    if (search) query = query.or(`name.ilike.%${search}%,vibe.ilike.%${search}%,description.ilike.%${search}%`);
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        query = query.contains('tags', [tag]);
      }
    }

    const { count, error } = await query;
    if (error) {
      console.error('Supabase error:', error);
      return 0;
    }
    return Number(count) || 0;
  }

  // SQLite fallback
  const database = getDb();
  let sql = 'SELECT COUNT(*) as cnt FROM presets WHERE 1=1';
  const params: any[] = [];

  if (creature) {
    sql += ' AND creature = ?';
    params.push(creature);
  }
  if (source) {
    sql += ' AND source = ?';
    params.push(source);
  }
  if (search) {
    sql += ' AND (name LIKE ? OR vibe LIKE ? OR description LIKE ?)';
    const searchPat = `%${search}%`;
    params.push(searchPat, searchPat, searchPat);
  }
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      sql += " AND tags LIKE ?";
      params.push(`%"${tag}"%`);
    }
  }

  const stmt = database.prepare(sql);
  const row = stmt.get(...params) as { cnt: number };
  return row ? Number(row.cnt) : 0;
}

export async function get_creature_types(): Promise<string[]> {
  const supabaseClient = getSupabase();
  if (supabaseClient) {
    const { data, error } = await supabaseClient.from('presets').select('creature').order('creature', { ascending: true });
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    const unique = new Set<string>();
    data?.forEach(row => unique.add(row.creature));
    return Array.from(unique).sort();
  }

  const database = getDb();
  const stmt = database.prepare('SELECT DISTINCT creature FROM presets ORDER BY creature');
  const rows = stmt.all() as { creature: string }[];
  return rows.map(r => r.creature);
}

export async function get_sources(): Promise<string[]> {
  const supabaseClient = getSupabase();
  if (supabaseClient) {
    const { data, error } = await supabaseClient.from('presets').select('source').order('source', { ascending: true });
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    const unique = new Set<string>();
    data?.forEach(row => unique.add(row.source));
    return Array.from(unique).sort();
  }

  const database = getDb();
  const stmt = database.prepare('SELECT DISTINCT source FROM presets ORDER BY source');
  const rows = stmt.all() as { source: string }[];
  return rows.map(r => r.source);
}

export async function insert_preset(preset: any): Promise<boolean> {
  const supabaseClient = getSupabase();
  if (supabaseClient) {
    const { error } = await supabaseClient.from('presets').insert([{
      id: preset.id,
      name: preset.name,
      creature: preset.creature || 'Human',
      vibe: preset.vibe || null,
      emoji: preset.emoji || '😊',
      avatar: preset.avatar || null,
      core_truths_helpful: preset.core_truths_helpful ?? true,
      core_truths_opinions: preset.core_truths_opinions ?? true,
      core_truths_resourceful: preset.core_truths_resourceful ?? true,
      core_truths_trustworthy: preset.core_truths_trustworthy ?? true,
      core_truths_respectful: preset.core_truths_respectful ?? true,
      boundaries_private: preset.boundaries_private ?? true,
      boundaries_ask_before_acting: preset.boundaries_ask_before_acting ?? false,
      boundaries_no_half_baked: preset.boundaries_no_half_baked ?? false,
      boundaries_not_voice_proxy: preset.boundaries_not_voice_proxy ?? true,
      vibe_style: preset.vibe_style || 'balanced',
      humor: preset.humor ?? 50,
      formality: preset.formality ?? 50,
      emoji_usage: preset.emojiUsage ?? preset.emoji_usage ?? 10,
      verbosity: preset.verbosity ?? 50,
      consciousness: preset.consciousness ?? 50,
      questioning: preset.questioning ?? 30,
      description: preset.description || null,
      tags: preset.tags || [],
      source: preset.source || 'character'
    }]);
    if (error) {
      if (error.code === '23505') { // unique_violation
        return false;
      }
      console.error('Supabase insert error:', error);
      throw error;
    }
    return true;
  }

  // SQLite fallback
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
      preset.emojiUsage ?? preset.emoji_usage ?? 10,
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

export async function health_check(): Promise<{ status: string; total_presets: number; creature_types: number; sources: number; db_type: string }> {
  const supabaseClient = getSupabase();
  if (supabaseClient) {
    const count = await count_presets();
    const creatures = (await get_creature_types()).length;
    const sources = (await get_sources()).length;
    return {
      status: 'healthy (supabase)',
      total_presets: count,
      creature_types: creatures,
      sources: sources,
      db_type: 'supabase'
    };
  }

  const database = getDb();
  const totalRow = database.prepare('SELECT COUNT(*) as cnt FROM presets').get() as { cnt: number };
  const creatureRow = database.prepare('SELECT COUNT(DISTINCT creature) as cnt FROM presets').get() as { cnt: number };
  const sourcesRow = database.prepare('SELECT COUNT(DISTINCT source) as cnt FROM presets').get() as { cnt: number };

  return {
    status: 'healthy (sqlite)',
    total_presets: Number(totalRow.cnt),
    creature_types: Number(creatureRow.cnt),
    sources: Number(sourcesRow.cnt),
    db_type: 'sqlite'
  };
}
