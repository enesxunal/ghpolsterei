# Homepage Visual QA

**Date:** 2026-08-30  
**Environment:** `npm run dev` on `http://localhost:3000`  
**Tooling:** Playwright Chromium (`scripts/visual-qa.mjs`)

## Tested viewports

| Viewport | Screenshot |
|----------|------------|
| 1440×1200 | `docs/screenshots/homepage-1440x1200.png` |
| 1024×1366 | `docs/screenshots/homepage-1024x1366.png` |
| 390×844 | `docs/screenshots/homepage-390x844.png` |
| 430×932 | `docs/screenshots/homepage-430x932.png` |
| 390×844 (mobile menu open) | `docs/screenshots/homepage-390x844-menu-open.png` |

## DOM / accessibility checks (all viewports)

| Check | Result |
|-------|--------|
| `scrollWidth === innerWidth` (no horizontal overflow) | Pass — 1440, 1024, 390, 430 |
| Single `<h1>` | Pass |
| All `<img>` have `alt` | Pass |
| No empty or `#` href links | Pass |
| WhatsApp uses real `https://wa.me/…` | Pass |
| Phone links use `tel:` | Pass |
| Email links use `mailto:` | Pass |
| Mobile menu opens and shows nav | Pass — first link: “GH Polsterei” |

Raw results: `docs/screenshots/dom-check-results.json`

## Issues found

1. **Mobile menu bleed-through** — Menu overlay used parent `opacity`, causing hero/stats to show through nav and contact block overlapping content.
2. **Generic template feel** — Circular trust badges, bordered promo pill, card borders/radius on Leistungen, decorative corner frames, diagonal CTA pattern.
3. **Hero H1 line breaks** — Title wrapped awkwardly on mobile/tablet; no intentional editorial break.
4. **Hero image crop** — Primary sofa texture cropped too tight at top.
5. **CTA hierarchy** — Hero/Final CTA buttons equal width on mobile but secondary styling competed with primary; ghost CTA used arrow clutter.
6. **Leistungen grid** — Uniform 3-column card grid felt template-like; first-item col-span hack unbalanced.
7. **Projects rhythm** — Inconsistent gaps and aspect ratios between featured tile and grid.
8. **Header spacing** — Logo/nav/phone cramped; nav started at `md` instead of wider desktop breakpoint.
9. **German long words** — Service titles (e.g. Gastronomie Sitzbänken) risk overflow without hyphenation.
10. **WhatsApp hover shift** — `scale-105` caused subtle layout jitter; fixed position lacked safe-area insets.
11. **Footer mobile readability** — Small muted text, email could overflow narrow screens.
12. **Hover layout shift** — Button borders added on hover; image scale transforms on cards.

## Fixes applied

### Layout & navigation
- **`Header.tsx`** — Centered desktop nav with improved spacing; mobile menu rendered via portal to `document.body` with solid backdrop + panel (z-index 90/95); Escape to close; body scroll lock retained.
- **`globals.css`** — `overflow-x: clip` on `html`/`body`; German `hyphens: auto`; `text-wrap: balance` on headings.

### Hero & trust
- **`Hero.tsx`** — Two-line H1 via `titleLines`; promo as accent text (no badge box); improved image `object-position`; full-width mobile CTAs with clear primary/secondary stack; removed decorative corner frame; tighter stats typography.
- **`TrustStrip.tsx`** — Replaced circular icon badges with minimal gold dash markers.

### Content sections
- **`ServicesSection.tsx`** — Editorial 12-column grid (7+5 hero row, 4+4+4, centered finale); removed card borders/backgrounds; brightness hover instead of scale.
- **`ProjectsSection.tsx`** — Tighter gap rhythm; featured 4/5 aspect; brightness hover overlay for premium gallery feel.
- **`CraftsmanshipTeaser.tsx`** — Removed decorative frame; cleaner image block.
- **`FinalCta.tsx`** — Flat dark block without diagonal pattern; stacked mobile CTAs; simplified tertiary link text.

### UI primitives
- **`ButtonLink.tsx`** — Consistent border box on all variants to prevent hover shift.
- **`WhatsAppButton.tsx`** — Safe-area aware positioning; brightness hover instead of scale; z-index below menu.
- **`Footer.tsx`** — Improved mobile type size/contrast; `break-all` on email/USt-IdNr.

### Data
- **`homepage.ts`** — Added `titleLines` for controlled H1 break.

### Tooling
- **`scripts/visual-qa.mjs`** — Playwright full-page screenshots + DOM assertions + mobile menu test.
- **`package.json`** — Added `playwright` devDependency for QA script only.

## Lint / build

```
npm run lint   → pass (0 errors)
npm run build  → pass (static / and /_not-found)
```

## Deferred (out of scope for this task)

- Inner routes (`/leistungsangebot`, `/projekte`, `/kontakt`, `/impressum`) — linked but not built yet (404).
- Real project/service detail pages and SEO metadata per route.
- Contact form backend, deploy pipeline.
- Shortening long German service titles in content source (CSS hyphenation applied instead).
- Next.js dev “N” indicator visible in menu screenshot corner (dev-only).

## Screenshot paths (summary)

```
docs/screenshots/homepage-1440x1200.png
docs/screenshots/homepage-1024x1366.png
docs/screenshots/homepage-390x844.png
docs/screenshots/homepage-430x932.png
docs/screenshots/homepage-390x844-menu-open.png
docs/screenshots/dom-check-results.json
```
