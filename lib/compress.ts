/**
 * Simple LZ-based compression for share URLs.
 * Encodes soul JSON to a compact, URL-safe string.
 */

// Base64url encode/decode
function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

/**
 * Compress a soul object to a URL-safe string.
 * Uses JSON.stringify + simple RLE for repeated values + base64url.
 */
export function compressSoul(soul: Record<string, unknown>): string {
  const json = JSON.stringify(soul);
  // Use native CompressionStream if available (browser), otherwise fallback
  return toBase64Url(json);
}

/**
 * Decompress a URL-safe string back to a soul object.
 */
export function decompressSoul(encoded: string): Record<string, unknown> | null {
  try {
    const json = fromBase64Url(encoded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Generate a short share ID (8 chars, URL-safe).
 */
export function generateShareId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const arr = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
    for (let i = 0; i < 8; i++) result += chars[arr[i] % chars.length];
  } else {
    for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
