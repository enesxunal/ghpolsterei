import { CONTACT_LIMITS } from "@/lib/contact/constants";
import { isHostedDeploy } from "@/lib/contact/env";

type RateLimitResult = {
  allowed: boolean;
  backend: "memory";
};

type MemoryEntry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, MemoryEntry>();

function pruneMemory(now: number) {
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt <= now) memoryStore.delete(key);
  }
}

function maxAttempts(): number {
  return isHostedDeploy() ? CONTACT_LIMITS.rateLimitMax : CONTACT_LIMITS.rateLimitMaxDev;
}

function memoryIncr(key: string, windowMs: number): number {
  const now = Date.now();
  pruneMemory(now);
  const existing = memoryStore.get(key);
  if (!existing || existing.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return 1;
  }
  existing.count += 1;
  return existing.count;
}

export function checkContactRateLimit(ip: string): RateLimitResult {
  const key = `contact-rl:${ip || "unknown"}`;
  const limit = maxAttempts();
  const windowMs = CONTACT_LIMITS.rateLimitWindowMs;
  const count = memoryIncr(key, windowMs);
  return { allowed: count <= limit, backend: "memory" };
}

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);
  return "unknown";
}
