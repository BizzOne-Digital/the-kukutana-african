// Simple in-memory rate limiter for serverless single-instance protection
// against basic form spam. Not a substitute for a distributed limiter under
// real load, but sufficient to slow down naive bots.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > limit;
}
