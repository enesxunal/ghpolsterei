# Leistungen SEO QA — GH Polsterei

**Date:** 2026-08-31  
**Scope:** `/leistungen` overview + 6 service detail pages (SSG)

---

## Routes

| Route | Type | Status |
|-------|------|--------|
| `/leistungen` | Overview | 200 |
| `/leistungen/neu-bezug-von-polstermoebeln` | Detail | 200 |
| `/leistungen/cabrio-neu-beziehen` | Detail | 200 |
| `/leistungen/aufpolstern` | Detail | 200 |
| `/leistungen/markisen` | Detail | 200 |
| `/leistungen/neubau-restaurierung-gastronomie-sitzbaenke` | Detail | 200 |
| `/leistungen/sattlerei-autositze` | Detail | 200 |

### Service slugs

1. `neu-bezug-von-polstermoebeln`
2. `cabrio-neu-beziehen`
3. `aufpolstern`
4. `markisen`
5. `neubau-restaurierung-gastronomie-sitzbaenke`
6. `sattlerei-autositze`

---

## Title & H1 summary

| Route | `<title>` | H1 |
|-------|-----------|-----|
| `/leistungen` | Leistungen — Polsterei & Sattlerei in Wesseling \| GH Polsterei | Leistungen der GH Polsterei |
| `/leistungen/neu-bezug-von-polstermoebeln` | Polstermöbel neu beziehen in Wesseling \| GH Polsterei | Neu Bezug von Polstermöbeln |
| `/leistungen/cabrio-neu-beziehen` | Cabrio-Verdeck neu beziehen — Sattlerei Wesseling \| GH Polsterei | Cabrio neu beziehen |
| `/leistungen/aufpolstern` | Möbel aufpolstern in Wesseling \| GH Polsterei | Aufpolstern |
| `/leistungen/markisen` | Markisen & Planen — Restaurierung in Wesseling \| GH Polsterei | Markisen |
| `/leistungen/neubau-restaurierung-gastronomie-sitzbaenke` | Gastronomie-Sitzbänke — Neubau & Restaurierung Wesseling \| GH Polsterei | Neubau/Restaurierung von Gastronomie Sitzbänken |
| `/leistungen/sattlerei-autositze` | Autositze neu beziehen — Sattlerei Wesseling \| GH Polsterei | Sattlerei Arbeiten wie Autositze neu beziehen/Restaurieren |

Each page has a unique `meta description`, `canonical` URL, and OpenGraph basics (`title`, `description`, `url`, `locale`, `type`, `siteName`; detail pages include `images`).

---

## Redirect

| Source | Target | Notes |
|--------|--------|-------|
| `/leistungsangebot` | `/leistungen` | 308 permanent (`next.config.ts` + `src/middleware.ts`) |
| `/leistungsangebot/` | `/leistungen` | Two-hop via trailing-slash normalization → `/leistungsangebot` → `/leistungen`; final path is `/leistungen` (200) |

---

## Structured data

| Page | JSON-LD |
|------|---------|
| `/leistungen` | `BreadcrumbList` (Startseite → Leistungen) |
| Detail pages | `BreadcrumbList` (Startseite → Leistungen → Service) + `Service` |

**Service schema:** `name`, `description`, `url`, `image`, `provider` (`LocalBusiness` from `site.ts`: name, telephone, email, postal address, url). `areaServed` limited to verified city **Wesseling** only. No `rating`, `review`, `price`, or `Product` schema.

---

## Internal linking

- Header / Footer nav: **Leistungen** → `/leistungen`
- Homepage hero CTA + 6 service cards → `/leistungen` and `/leistungen/[slug]`
- Detail pages: related services, `/projekte`, `/kontakt`, `tel:` CTA
- No empty or `#` hrefs (QA verified)

---

## QA results

**Script:** `npm run qa:leistungen` (`scripts/visual-qa-leistungen.mjs`)  
**Report:** `docs/screenshots/leistungen-dom-check-results.json`  
**Result:** All checks passed

| Check | Result |
|-------|--------|
| `/leistungen` → 200 | Pass |
| 6 detail routes → 200 | Pass |
| `/leistungsangebot/` redirect → `/leistungen` | Pass (chain) |
| Single H1 per page | Pass |
| Unique detail titles | Pass |
| All `img` have `alt` | Pass |
| No empty/`#` href | Pass |
| 390px horizontal overflow | Pass |
| BreadcrumbList JSON-LD | Pass |
| Service JSON-LD on detail pages | Pass |
| Homepage 6 service links → 200 | Pass |

**Build / lint:** `npm run build` and `npm run lint` — pass.

---

## Screenshots

| File | Description |
|------|-------------|
| `docs/screenshots/leistungen-1440x1200.png` | Overview desktop |
| `docs/screenshots/leistungen-390x844.png` | Overview mobile |
| `docs/screenshots/leistungen-neu-bezug-von-polstermoebeln-1440x1200.png` | Detail desktop (Polstermöbel) |
| `docs/screenshots/leistungen-neu-bezug-von-polstermoebeln-390x844.png` | Detail mobile (Polstermöbel) |
| `docs/screenshots/leistungen-cabrio-neu-beziehen-1440x1200.png` | Detail desktop (Cabrio) |

---

## Deferred (out of scope)

- `/kontakt` page, contact form, rate-limit, mail delivery
- Impressum / Datenschutz refresh
- Deploy / production DNS
- `middleware` → Next.js 16 `proxy` migration (deprecation warning only)
- Single-hop redirect for `/leistungsangebot/` (currently two 308 hops; SEO-safe, final URL correct)
