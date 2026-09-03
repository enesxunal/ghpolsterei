import { buildLlmsTxt } from "@/lib/llms-txt";

const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};

export function GET() {
  return new Response(buildLlmsTxt(), {
    status: 200,
    headers: TEXT_HEADERS,
  });
}

export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: TEXT_HEADERS,
  });
}
