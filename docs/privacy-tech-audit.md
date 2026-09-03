# Privacy & tracker audit — GH Polsterei

**Audit date:** 2026-08-31  
**Scope:** application source under `src/`, `scripts/`, `next.config.ts`, `package.json`.  
**Method:** repository search for analytics, pixels, storage APIs, third-party scripts, and cookies.

## Result

No cookie banner is required for the current codebase.

There are no Google Analytics, Google Tag Manager, Meta Pixel, Hotjar, advertising, or similar tracking scripts. The application does not write `document.cookie`, `localStorage`, or `sessionStorage`.

## First-party processing

| Surface | What happens |
| --- | --- |
| Contact form | Fields posted to `POST /api/contact` (name, email, phone, service, message, privacy flag, optional photos). |
| Honeypot | Hidden field `company_website`; not shown to visitors. |
| Time trap | HMAC-signed timestamp in a hidden field; verified server-side. Not a cookie. |
| Session | No login, no first-party session cookie. |

## Client-side third parties

| Third party | How it appears | Purpose |
| --- | --- | --- |
| **Cloudflare Turnstile** | `next/script` loads `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit` on `/kontakt` when a site key is present. Widget appearance: `interaction-only`. | Bot protection for the contact form. |
| **WhatsApp** | Outbound `https://wa.me/…` links only. No WhatsApp SDK or embed. | Visitor-initiated chat. |
| **Google Fonts via `next/font`** | `DM_Sans` and `Cormorant_Garamond` are loaded at build time and self-hosted. No runtime request to fonts.googleapis.com in the app code. | Typography. |

No other client-side third-party scripts or embeds (no Maps iframe, no video embeds, no chat widgets).

## Server-side processors (contact flow)

Documented for privacy copy; not trackers:

| Processor | Role in code | Data actually sent |
| --- | --- | --- |
| **Cloudflare Turnstile** | `siteverify` with token and optional `remoteip`. | Challenge token, IP if known. Not the form message. |
| **Upstash Redis** | Rate limit key `contact-rl:${ip}` with INCR + EXPIRE. TTL **10 minutes**. | IP (or `"unknown"`) and a counter. Form body is not stored. |
| **cPanel SMTP** | Nodemailer to `SMTP_HOST` when host, port, secure flag, user, password, from- and to-address are set. | Name, email, phone, service, message, timestamp; processed photos attached (client-optimized, ≤ 3.5 MB total). |
| **Vercel** | Planned production host. Request logs / platform telemetry as provided by Vercel. | Typical HTTP metadata (IP, URL, user-agent, timestamp). Retention is not hard-coded in this repo. |
| **Workshop mailbox** | Default `CONTACT_TO_EMAIL` is `info@ghpolsterei.de` on the cPanel mail host. | Mailbox of the workshop after SMTP delivery. |

Local/dev without Upstash/SMTP/Turnstile keys uses in-memory rate limiting, console mail, and Turnstile bypass. Hosted Vercel production fails closed without those credentials.

## Cookies

- **First-party cookies:** none set by application code.
- **Turnstile:** may use technically necessary challenge storage on Cloudflare’s domain. It is not used here for advertising or analytics.
- **No cookie consent UI** is implemented, by design, because there are no non-essential trackers.

Re-audit if any analytics, embeds, or marketing pixels are added later.
