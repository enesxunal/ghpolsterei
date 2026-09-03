# Contact form security — GH Polsterei

This document describes the `/kontakt` form, spam controls, mail/upload
limits, and what must be configured before a Vercel production deploy.

## Form flow

1. `/kontakt` is rendered dynamically (`force-dynamic`) so each page view
   gets a fresh HMAC-signed timestamp token.
2. The visitor fills the editorial form (name, email and/or phone, service,
   message, privacy consent, optional photos).
3. The browser posts `multipart/form-data` to `POST /api/contact`.
4. The server runs cheap checks first (size, origin, honeypot, rate limit,
   time trap), then Turnstile, then Zod + file validation.
5. If everything passes, the workshop receives a plain-text email via the
   mail adapter (cPanel SMTP in production, console in local/dev).
6. The visitor sees a success state. There is **no auto-reply** to the sender
   in this version.

Known fields only are read. Extra fields are ignored. User input is never
rendered as HTML (plain-text mail only; header breaks stripped).

## Spam layers

| Layer | Behaviour | Bot-facing response |
| --- | --- | --- |
| Honeypot `company_website` | Hidden from people. If filled, mail is **not** sent. | HTTP 200 `{ ok: true }` (silent) |
| Time trap | Token issued at render. Reject if submitted in under 2.5s or older than 24h. HMAC-signed so clients cannot forge a delay. | Generic error |
| Rate limit | IP-based. Hosted: 5 / 10 minutes. Local/dev: 30 / 10 minutes. In-process memory (`contact-rl:${ip}`). | Generic error (HTTP 429) |
| Cloudflare Turnstile | `interaction-only` widget. Token verified at `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Secret never sent to the client. | Generic error |
| Payload limits | `Content-Length` over 22 MB rejected. Message max 4000 characters. | Generic / validation error |
| Origin check | Optional `Origin` must match the site, localhost, or `VERCEL_URL`. | Generic error |

Security rejections do **not** name the layer that fired.

### Turnstile env behaviour

- Keys present: always verified.
- Keys missing in **local/dev** (`VERCEL` unset): controlled bypass so the form can be exercised.
- Keys missing on a **Vercel deploy** (`VERCEL=1` and `NODE_ENV=production`): fail closed. The form returns “unavailable”. Silent bypass is not allowed.

### Rate limit env behaviour

- Always in-process memory. No Redis or Upstash.
- Hosted production uses the stricter 5 / 10 minutes cap. Local/dev uses 30 / 10 minutes.
- Counters are per instance and reset when the instance restarts. They are not a shared store.

## Mail provider

Adapter in `src/lib/contact/mail.ts`:

- **SMTP / Nodemailer** when `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` are all set.
- **Console** logger in local/dev when those SMTP vars are unset.
- Partial SMTP config (some `SMTP_*` vars set, but not a complete valid set) fails closed even in local/dev. **No fake success.**
- On Vercel without a complete SMTP config: fail closed. **No fake success.**

Use `SMTP_HOST=mail.ghpolsterei.de` (not the apex domain). The apex points at Vercel; `mail.ghpolsterei.de` still reaches the cPanel mail server. Port 465 requires `SMTP_SECURE=true`. TLS verification stays on.

`From` is `GH Polsterei Website <CONTACT_FROM_EMAIL>`.
`replyTo` is set to the visitor email when provided.

The workshop mail includes name, email, phone, service, message, ISO timestamp,
attachment metadata, and sanitized request origin / User-Agent. It does not
include which spam check passed. Body is plain text only.

## Uploads

Accepted: JPG/JPEG, PNG, WebP. Max **5** files.

**In the browser (selection):** each source file may be up to **8 MB**.

**Before POST:** the form resizes/compresses photos in the browser (longest edge
max 1600 px, JPEG ~quality 0.8). Small JPEG/WebP already under 650 KB are
left as-is. PNG photos are converted. If compression fails, the raw file is
**not** sent.

**Authoritative server limits (processed payload):**

- max 5 files
- max **1 MB** per file
- max **3.5 MB** total photo bytes
- request `Content-Length` over **4 MB** → HTTP 413 generic

Rejected by extension, declared MIME, **and** magic-byte sniffing (SVG, PDF,
executables and renamed binaries do not pass). A processed total over 3.5 MB
returns HTTP 413 generic (client bypass).

### Attachment strategy (small site)

No object storage. Files stay in memory for the request and are attached to
the SMTP (or local console) email. Processed totals stay under 3.5 MB, so
there is no “filenames only” fallback anymore.

### Vercel request-body limit

Vercel caps the function body at **4.5 MB**. Client optimization plus the 4 MB
app ceiling keep the multipart POST under that cap.

## Vercel environment variables

Set all of these in the Vercel project (Production + Preview):

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
SMTP_HOST=mail.ghpolsterei.de
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER
SMTP_PASSWORD
CONTACT_TO_EMAIL
CONTACT_FROM_EMAIL
CONTACT_FORM_SECRET
```

Optional: `CONTACT_ALLOWED_ORIGIN` if the public URL is not `https://ghpolsterei.de`.

## Production checklist

- [ ] Cloudflare Turnstile widget created; site key + secret set; no classic CAPTCHA theme.
- [ ] `CONTACT_FORM_SECRET` is a long random value (not the dev fallback).
- [ ] SMTP host is `mail.ghpolsterei.de`; port 465 with `SMTP_SECURE=true`.
- [ ] `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` are the workshop mailbox.
- [ ] `CONTACT_TO_EMAIL` delivers to `info@ghpolsterei.de` (or the inbox you choose).
- [ ] Submit a real test from a phone and from desktop (including several photos).
- [ ] Confirm honeypot/time-trap/Turnstile failures do not send mail.
- [ ] `/datenschutz` page exists before launch (the form already links there).
- [ ] Do not deploy with missing Turnstile/SMTP and expect the form
      to “just work” — hosted deploys fail closed on purpose.
