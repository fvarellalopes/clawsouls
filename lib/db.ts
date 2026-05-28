import { getServerSupabase } from './supabase';

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
  openness?: number;
  conscientiousness?: number;
  extraversion?: number;
  agreeableness?: number;
  neuroticism?: number;
  description?: string;
  tags?: string[];
  source?: string;
  worldview?: string;
  expertise?: any;
  memory_policy?: string;
  pet_peeves?: string[];
  voice_rules?: string;
  communication_mode?: string;
  knowledge_domains?: string[];
  signature_phrases?: string[];
  emotional_range?: number;
  speech_patterns?: any;
  role?: string;
  role_description?: string;
  mandate_rules?: string[];
  voice_private?: string;
  voice_public?: string;
  autonomy_auto?: string;
  autonomy_require_approval?: string;
  active_projects?: string;
  custom_core_truths?: string[];
  custom_boundaries?: string[];
  created_at?: string;
  updated_at?: string;
};

export async function list_presets(
  limit: number = 50,
  offset: number = 0,
  creature?: string,
  source?: string,
  tags?: string[],
  search?: string
): Promise<Preset[]> {
  const supabaseClient = getServerSupabase();
  if (!supabaseClient) {
    console.error('No Supabase client available');
    return [];
  }

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
  return (data || []) as Preset[];
}

export async function get_preset_by_id(preset_id: string): Promise<Preset | null> {
  const supabaseClient = getServerSupabase();
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient.from('presets').select('*').eq('id', preset_id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Supabase error:', error);
    return null;
  }
  return data as Preset;
}
