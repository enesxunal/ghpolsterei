# Technical SEO — GH Polsterei

**Date:** 2026-08-31  
**Canonical base:** https://ghpolsterei.de

## Indexable routes

| Path | Title (unique, absolute) |
| --- | --- |
| `/` | GH Polsterei \| Sattlerei — Polstermöbel & Sattlerarbeiten in Wesseling |
| `/ueber-uns` | Über GH Polsterei \| Polsterei & Sattlerei Wesseling |
| `/leistungen` | Leistungen — Polsterei & Sattlerei in Wesseling |
| `/leistungen/neu-bezug-von-polstermoebeln` | Polstermöbel neu beziehen in Wesseling |
| `/leistungen/cabrio-neu-beziehen` | Cabrio-Verdeck neu beziehen — Sattlerei Wesseling |
| `/leistungen/aufpolstern` | Möbel aufpolstern in Wesseling |
| `/leistungen/markisen` | Markisen & Planen — Restaurierung in Wesseling |
| `/leistungen/neubau-restaurierung-gastronomie-sitzbaenke` | Gastronomie-Sitzbänke — Neubau & Restaurierung Wesseling |
| `/leistungen/sattlerei-autositze` | Autositze neu beziehen — Sattlerei Wesseling |
| `/projekte` | Projekte — Polster- & Sattlerarbeiten |
| `/kontakt` | Kontakt & Angebot anfragen \| GH Polsterei Wesseling |

Each of these has a unique meta description, canonical `https://ghpolsterei.de{path}`, Open Graph title/description/url, `lang="de"`, and a single H1.

## Noindex routes

| Path | Robots |
| --- | --- |
| `/impressum` | `noindex, follow` |
| `/datenschutz` | `noindex, follow` |
| `/api/*` | disallowed in robots.txt |

Legal pages are omitted from the sitemap.

## Redirects and legacy URLs

| Incoming | Behaviour |
| --- | --- |
| `/leistungsangebot` and `/leistungsangebot/` | Permanent redirect (308) to `/leistungen` via `next.config.ts` and `src/proxy.ts` |
| `/kontakt/`, `/projekte/`, `/impressum/`, `/ueber-uns/`, `/datenschutz/` | Next.js default trailing-slash normalization (no extra redirect table) |
| `/hello-world` | **410 Gone** (WordPress sample post; not a business page) |
| Unknown paths | Custom `src/app/not-found.tsx`, HTTP 404 |

`src/middleware.ts` was replaced by `src/proxy.ts` (Next.js 16 file convention). Redirect behaviour for `/leistungsangebot` is unchanged.

## Sitemap

`src/app/sitemap.ts` → `https://ghpolsterei.de/sitemap.xml`

Contains only the indexable routes above. `lastModified` is omitted (no
per-URL content timestamp source). No API routes, no legal pages, no legacy URLs.

## Robots

`src/app/robots.ts` → `https://ghpolsterei.de/robots.txt`

- Allow `/`
- Disallow `/api/`
- Sitemap: `https://ghpolsterei.de/sitemap.xml`

## JSON-LD

| Page | Types |
| --- | --- |
| `/` | LocalBusiness (verified name, url, telephone, email, address, opening hours from the live Kontakt page) |
| `/kontakt` | LocalBusiness (same payload) + BreadcrumbList |
| `/ueber-uns`, `/leistungen`, `/projekte`, service details | BreadcrumbList |
| Service detail pages | Service + BreadcrumbList (provider is LocalBusiness without ratings) |

Not present: `aggregateRating`, `review`, invented `priceRange`. Opening hours are only those published on the legacy Kontakt page (`Mo–Sa 09:00–17:00`).

## Metadata implementation

`src/lib/seo.ts` builds absolute titles (no `| GH Polsterei` template duplication), canonicals from `site.website` (never localhost), and matching Open Graph fields. Root layout sets `lang="de"` and `metadataBase` to `https://ghpolsterei.de`.

## Privacy technology

See `docs/privacy-tech-audit.md`. No non-essential cookies or trackers; no cookie banner. Contact privacy checkbox acknowledges `/datenschutz` without implying extra consent.

## Security headers

Applied in `next.config.ts` to `/:path*`:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`

**Content-Security-Policy was not added.** Next.js hydration uses inline scripts. A strict CSP needs a carefully tested policy so it does not break the production app.

## Performance (quick pass, no redesign)

- `next/image` is used for brand, hero, services, projects, and about photography; containers have `fill` + `sizes` or explicit width/height.
- `priority` is limited to LCP-adjacent assets (home hero, header logo, kontakt hero, service detail hero, about hero).
- Fonts: `next/font` with `display: "swap"` (DM Sans, Cormorant Garamond).
- Client components: Header (mobile menu), ContactForm, Lightbox, ProjectsGallery. No extra marketing scripts.
- Remaining payload risk: large service PNGs inherited from the legacy site. Not resized in this pass (redesign freeze).

## Remaining production requirements

- Set Vercel env vars from `.env.example` / `docs/contact-form-security.md`.
- Confirm cPanel SMTP on the live project.
- Re-check Datenschutz hosting wording after the first Vercel deploy.
- DNS and go-live are out of scope for this change set.
