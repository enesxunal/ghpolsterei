import { CONTACT_LIMITS } from "@/lib/contact/constants";
import { getUpstashConfig, isHostedDeploy } from "@/lib/contact/env";

type RateLimitResult = {
  allowed: boolean;
  backend: "upstash" | "memory" | "unavailable";
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

async function upstashIncr(
  url: string,
  token: string,
  key: string,
  windowSec: number,
): Promise<number | null> {
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([["INCR", key]]),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as { result?: unknown }[];
  const incr = payload[0]?.result;
  if (typeof incr !== "number") return null;

  if (incr === 1) {
    await fetch(`${url}/expire/${encodeURIComponent(key)}/${windowSec}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  return incr;
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

export async function checkContactRateLimit(ip: string): Promise<RateLimitResult> {
  const key = `contact-rl:${ip || "unknown"}`;
  const limit = maxAttempts();
  const windowMs = CONTACT_LIMITS.rateLimitWindowMs;
  const upstash = getUpstashConfig();

  if (upstash) {
    try {
      const count = await upstashIncr(
        upstash.url,
        upstash.token,
        key,
        Math.ceil(windowMs / 1000),
      );
      if (count === null) {
        if (isHostedDeploy()) return { allowed: false, backend: "unavailable" };
        const fallback = memoryIncr(key, windowMs);
        return { allowed: fallback <= limit, backend: "memory" };
      }
      return { allowed: count <= limit, backend: "upstash" };
    } catch {
      if (isHostedDeploy()) return { allowed: false, backend: "unavailable" };
      const fallback = memoryIncr(key, windowMs);
      return { allowed: fallback <= limit, backend: "memory" };
    }
  }

  if (isHostedDeploy()) {
    return { allowed: false, backend: "unavailable" };
  }

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
