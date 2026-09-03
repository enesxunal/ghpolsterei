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
| **WhatsApp** | Outbound `https://wa.me/…` links only. No WhatsApp SDK or embed. | Visitor-initiated chat. |
| **Google Fonts via `next/font`** | `DM_Sans` and `Cormorant_Garamond` are loaded at build time and self-hosted. No runtime request to fonts.googleapis.com in the app code. | Typography. |

No other client-side third-party scripts or embeds (no Maps iframe, no video embeds, no chat widgets).

## Server-side processors (contact flow)

Documented for privacy copy; not trackers:

| Processor | Role in code | Data actually sent |
| --- | --- | --- |
| **Application memory** | Rate limit key `contact-rl:${ip}` with an in-process counter. Window **10 minutes**. | IP (or `"unknown"`) and a counter. Form body is not stored. Lost on instance restart. |
| **cPanel SMTP** | Nodemailer to `SMTP_HOST` when host, port, secure flag, user, password, from- and to-address are set. | Name, email, phone, service, message, timestamp; processed photos attached (client-optimized, ≤ 3.5 MB total). |
| **Vercel** | Planned production host. Request logs / platform telemetry as provided by Vercel. | Typical HTTP metadata (IP, URL, user-agent, timestamp). Retention is not hard-coded in this repo. |
| **Workshop mailbox** | Default `CONTACT_TO_EMAIL` is `info@ghpolsterei.de` on the cPanel mail host. | Mailbox of the workshop after SMTP delivery. |

Local/dev without SMTP uses console mail. Hosted Vercel production fails closed without SMTP credentials. Rate limiting uses in-process memory in all environments.

## Cookies

- **First-party cookies:** none set by application code.
- **No cookie consent UI** is implemented, by design, because there are no non-essential trackers.

Re-audit if any analytics, embeds, or marketing pixels are added later.
