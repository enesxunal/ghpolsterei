import { getTurnstileSecret, isHostedDeploy } from "@/lib/contact/env";

type TurnstileResult = "ok" | "rejected" | "unavailable";

type SiteverifyResponse = {
  success?: boolean;
};

export async function verifyTurnstileToken(
  token: string | null,
  ip: string,
): Promise<TurnstileResult> {
  const secret = getTurnstileSecret();

  if (!secret) {
    if (isHostedDeploy()) return "unavailable";
    return "ok";
  }

  if (!token) return "rejected";

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );

    if (!response.ok) return "rejected";

    const payload = (await response.json()) as SiteverifyResponse;
    return payload.success === true ? "ok" : "rejected";
  } catch {
    return "rejected";
  }
}
