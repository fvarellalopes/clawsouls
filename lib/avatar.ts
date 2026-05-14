import { KNOWN_AVATARS } from "./avatars.generated";

const FALLBACK_AVATAR = "/avatars/placeholder.svg";

export interface SoulAvatarFields {
  name?: string;
  emoji?: string;
  creature?: string;
}

/**
 * Resolve a static avatar URL based on the soul's name.
 * Avatars são gerados em batch via Colab (Z-Image-Turbo) e armazenados em /public/avatars/.
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
 * Verifica se existe um avatar gerado para este nome.
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
    return `/avatars/${slug}.webp`; // tenta WebP primeiro; servidor faz fallback para PNG se não existir
  }

  return FALLBACK_AVATAR;
}
