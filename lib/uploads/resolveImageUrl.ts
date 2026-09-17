const PLACEHOLDER = "/images/placeholder-museum.svg";

/**
 * Normalizes any stored image URL for safe rendering.
 * Legacy `/uploads/...` paths from local-disk storage never survive a
 * serverless deploy, so they are swapped for a placeholder rather than
 * left to 404.
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return PLACEHOLDER;

  if (url.startsWith("https://") || url.startsWith("http://")) return url;
  if (url.startsWith("/uploads/")) return PLACEHOLDER;
  if (url.startsWith("/")) return url;

  return PLACEHOLDER;
}
