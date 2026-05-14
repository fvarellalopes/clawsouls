import { KNOWN_AVATARS } from "./avatars.generated";

const FALLBACK_AVATAR = "/avatars/placeholder.svg";

export interface SoulAvatarFields {
  name?: string;
  emoji?: string;
  creature?: string;
}

/**
 * Normaliza um nome para slug de arquivo:
 * - remove acentos (á → a, ç → c, etc.)
 * - lowercase
 * - remove tudo que não for a-z, 0-9, underscore
 */
function makeSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // strip combining marks (accents)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]+/g, "");
}

/**
 * Resolve a static avatar URL based on the soul's name.
 */
export function resolveAvatarUrl(soul: SoulAvatarFields): string {
  if (!soul?.name?.trim()) return FALLBACK_AVATAR;
  return `/avatars/${makeSlug(soul.name)}.webp`;
}

/**
 * Verifica se existe um avatar gerado para este nome.
 */
export function hasAvatar(soul: SoulAvatarFields): boolean {
  if (!soul?.name?.trim()) return false;
  return KNOWN_AVATARS.has(makeSlug(soul.name));
}

/**
 * Retorna o URL do avatar ou o fallback, pronto para uso em <img>.
 */
export function avatarUrl(soul: SoulAvatarFields): string {
  if (!soul?.name?.trim()) return FALLBACK_AVATAR;
  const slug = makeSlug(soul.name);
  if (KNOWN_AVATARS.has(slug)) {
    return `/avatars/${slug}.webp`;
  }
  return FALLBACK_AVATAR;
}
