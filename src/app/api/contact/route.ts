import { processContactForm } from "@/lib/contact/process";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const { status, body } = await processContactForm(request);
  return Response.json(body, { status });
}

export function GET() {
  return new Response(null, { status: 405 });
}
