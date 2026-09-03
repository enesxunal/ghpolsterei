import { site } from "@/data/site";

const PRODUCTION_ORIGINS = [
  "https://ghpolsterei.de",
  "https://www.ghpolsterei.de",
] as const;

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;

  const allowed = new Set<string>([
    site.website,
    ...PRODUCTION_ORIGINS,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    allowed.add(`https://${vercelUrl}`);
  }

  const extra = process.env.CONTACT_ALLOWED_ORIGIN?.trim();
  if (extra) allowed.add(extra.replace(/\/$/, ""));

  return allowed.has(origin.replace(/\/$/, ""));
}
