const FALLBACK_AVATAR = "/avatars/placeholder.svg";

export interface SoulAvatarFields {
  name?: string;
  emoji?: string;
  creature?: string;
}

/**
 * Resolve a static avatar URL based on the soul's name.
 * Avatars são gerados em batch via Colab (SDXL) e armazenados em /public/avatars/.
 * Nome do arquivo: {nome_em_lowercase_sem_espacos}.png
 */
export function resolveAvatarUrl(soul: SoulAvatarFields): string {
  if (!soul?.name?.trim()) return FALLBACK_AVATAR;

  const slug = soul.name
    .toLowerCase()
    .trim()
    .replace(/[^\wáàâãéèêíïóôõöúçñ]+/g, "");

  return `/avatars/${slug}.png`;
}

/**
 * Lista de presets cujos avatars já foram gerados em batch.
 * Atualizar após cada execução do collab_batch_gen.py.
 */
const KNOWN_AVATARS = new Set([
  "jack",
  "doc",
  "glados",
  "zen",
  "radd",
  "pony",
  "kira",
  "dev",
  "sage",
  "luffy",
  "spike",
  "yoda",
  "geralt",
]);

/**
 * Verifica se provavelmente existe um avatar gerado para este nome.
 * Usar para decidir se mostra o avatar ou o placeholder.
 */
export function hasAvatar(soul: SoulAvatarFields): boolean {
  if (!soul?.name?.trim()) return false;

  const slug = soul.name
    .toLowerCase()
    .trim()
    .replace(/[^\wáàâãéèêíïóôõöúçñ]+/g, "");

  return KNOWN_AVATARS.has(slug);
}

/**
 * Retorna o URL do avatar ou o fallback, pronto para uso em <img>.
 */
export function avatarUrl(soul: SoulAvatarFields): string {
  if (!soul?.name?.trim()) return FALLBACK_AVATAR;

  const slug = soul.name
    .toLowerCase()
    .trim()
    .replace(/[^\wáàâãéèêíïóôõöúçñ]+/g, "");

  if (KNOWN_AVATARS.has(slug)) {
    return `/avatars/${slug}.png`;
  }

  return FALLBACK_AVATAR;
}