# Pre-deploy readiness — GH Polsterei

**Date:** 2026-08-31  
**Application status:** Production build succeeds. Legal, SEO, contact, and visual QA pass. **Not deployed.**

## Remaining required ENV (Vercel Production + Preview)

Set before the first live deploy. Hosted production **fails closed** if these are missing.

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
CONTACT_FORM_SECRET         # long random value, not the local fallback
```

Optional: `CONTACT_ALLOWED_ORIGIN` if the public origin is not `https://ghpolsterei.de`.

## Contact upload — final limits

| Stage | Limit |
| --- | --- |
| Source files (browser) | Max 5, JPG/PNG/WebP, **8 MB** each |
| Client optimization | Longest edge ~1600 px, JPEG ~0.8; skip JPEG/WebP already ≤ 650 KB |
| Processed payload (authoritative) | Max 5, **1 MB**/file, **3.5 MB** total |
| HTTP `Content-Length` | Over **4 MB** → 413 generic |
| Mail | Validated files are attached; no object storage |

Vercel function body cap is 4.5 MB. Client compression plus the 4 MB app ceiling is the mitigation — not Blob/S3.

## Security headers

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`
- `poweredByHeader: false` — no `X-Powered-By`
- CSP not shipped (Turnstile + Next.js inline scripts)

## Sitemap / robots

- `https://ghpolsterei.de/sitemap.xml` — indexable routes only, **no `lastmod`**
- `https://ghpolsterei.de/robots.txt` — allow `/`, disallow `/api/`, sitemap URL as above
- `/impressum` and `/datenschutz` — `noindex, follow`, not in the sitemap
- `/hello-world` — 410
- `/leistungsangebot` — 308 → `/leistungen`

## Trackers / cookies

No analytics, pixels, or first-party cookies. No cookie banner. Client third party: Cloudflare Turnstile on `/kontakt` only. See `docs/privacy-tech-audit.md`.

## Legal review reminders

See `docs/legal-review-required.md` before treating Impressum/Datenschutz as final (VSBG, DPAs, mailbox, Vercel region after go-live).

## Asset audit (`public/images`)

Files **over 1 MB** (originals kept; `next/image` serves runtime variants):

| File | Size |
| --- | --- |
| `services/polster-2.png` | 2.4 MB |
| `services/3.png` | 1.9 MB |
| `services/polster-1.png` | 1.6 MB |
| `services/1.png` | 1.6 MB |
| `legacy/photo-texture-sofa-upholstery.jpg` | 1.5 MB |
| `legacy/sewing-car-seat-cover-unscaled.jpg` | 1.5 MB |
| `services/aufpolstern.png` | 1.4 MB |

No bulk conversion this pass. Open Graph on service PNG pages omits `og:image` so crawlers do not fetch 1.4–2.4 MB originals. The JPEG service (`neu-bezug-von-polstermoebeln`) still has an OG image.

Project JPEGs are 129–454 KB. Logos are under 90 KB.

## Lighthouse baseline (production `localhost`, 2026-08-31)

Saved under `docs/lighthouse/`. Not a ship gate.

| Page | Form | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | desktop | 100 | 96 | 100 | 100 | 0.65s | 0 | 0 |
| `/` | mobile | 91 | 96 | 100 | 100 | 3.4s | 0 | 6ms |
| `/kontakt` | mobile | 92 | 97 | 100 | 100 | 3.4s | 0 | 2ms |

INP was not reported in these runs. Mobile LCP is dominated by large legacy/service photography (see asset audit).

## DNS / preview checklist (before pointing the domain)

- [ ] Preview deploy with all ENV set
- [ ] Turnstile works on the preview host
- [ ] SMTP delivers a real form mail with a photo
- [ ] `/datenschutz` 200, contact privacy link works
- [ ] Canonical URLs are `https://ghpolsterei.de/...` (not the Vercel URL)
- [ ] Headers and `X-Powered-By` absence confirmed on the preview host
- [ ] `CONTACT_ALLOWED_ORIGIN` if preview origin must POST to the API

## Smoke tests after DNS cutover

- [ ] `/` `/ueber-uns` `/leistungen` `/projekte` `/kontakt` `/impressum` `/datenschutz` → 200
- [ ] Unknown path → 404
- [ ] `/hello-world` → 410
- [ ] `/leistungsangebot` → 308 `/leistungen`
- [ ] `sitemap.xml` / `robots.txt` → 200, production canonicals
- [ ] Phone form: 1–5 photos, success mail in the workshop inbox
- [ ] Honeypot / too-fast submit does not send mail
