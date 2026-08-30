# Legacy Site Audit — ghpolsterei.de

**Audit date:** 2026-08-30  
**Method:** CLI crawl (`curl`), WordPress sitemap + REST API (`/wp-json/wp/v2/`), HTML parsing  
**Live site:** https://ghpolsterei.de/

---

## Workspace State

| Item | Value |
|------|-------|
| **Project path** | `/Users/enesxunal/Desktop/3 Kare Ajans/Cursor/ghpolsterei` |
| **Git** | Not initialized (no `.git` directory) |
| **Existing code** | None — empty workspace |
| **package.json** | Not present |
| **Framework/config** | Not present |
| **Files in workspace** | `docs/legacy-site-audit.md` (this file only, created by audit task) |

---

## Existing Routes

### Published pages (WordPress sitemap + REST API)

| URL | Slug | WP ID | HTTP | Last modified | Notes |
|-----|------|-------|------|---------------|-------|
| https://ghpolsterei.de/ | `home` | 906 | 200 | 2024-11-08 | Front page |
| https://ghpolsterei.de/leistungsangebot/ | `leistungsangebot` | 912 | 200 | 2024-10-25 | Services |
| https://ghpolsterei.de/projekte/ | `projekte` | 910 | 200 | 2024-10-25 | Project gallery |
| https://ghpolsterei.de/kontakt/ | `kontakt` | 914 | 200 | 2024-11-07 | Contact |
| https://ghpolsterei.de/impressum/ | `impressum` | 1473 | 200 | 2025-12-23 | Impressum **and** Datenschutzerklärung combined |

### Other discoverable URLs

| URL | HTTP | Notes |
|-----|------|-------|
| https://ghpolsterei.de/hello-world/ | — | Default WordPress sample post in post sitemap; crawl intermittently failed (SSL/connection reset) |
| https://ghpolsterei.de/ueber-uns/ | 404 | No dedicated page; “Über Uns” content lives on homepage |
| https://ghpolsterei.de/datenschutz/ | 404 | Privacy policy merged into `/impressum/` |
| https://ghpolsterei.de/feed/ | — | RSS feed (linked in `<head>`) |
| https://ghpolsterei.de/wp-json/ | 200 | WordPress REST API exposed |
| https://ghpolsterei.de/wp-sitemap.xml | 200 | Sitemap index |

**Total live content pages:** 5  
**Total URLs in sitemaps:** 6 (5 pages + 1 post)

---

## Navigation

### Header (primary)

| Label (DE) | URL |
|------------|-----|
| Home (logo) | https://ghpolsterei.de/ |
| Leistungsangebot | https://ghpolsterei.de/leistungsangebot/ |
| Projekte | https://ghpolsterei.de/projekte/ |
| Kontakt | https://ghpolsterei.de/kontakt/ |

### Header social icons (placeholder)

Facebook and Instagram icon buttons are rendered in the header/footer builder, but all link to `href="#"` — **no real profile URLs configured**.

### Footer

| Section | Items |
|---------|-------|
| **Über Uns** | Short company blurb (same themes as homepage) |
| **Our Service** | Phone: `0163 6924387` |
| **Quick Links** | Impressum → https://ghpolsterei.de/impressum/ |
| **Copyright** | `© 2026 GH Polsterei \| Sattlerei` |

Footer logo links to `#` (non-functional).

---

## Business Information

| Field | Value |
|-------|-------|
| **Business name** | GH Polsterei |
| **Tagline / brand** | GH Polsterei \| Sattlerei — A. Ghoul |
| **Owner** | Abdalrazak Ghoul |
| **Address** | Industriestraße 45, 50389 Wesseling, Deutschland |
| **Phone** | 0163 / 6924387 (also shown as `0163 6924387`) |
| **Email** | gh.polsterei@gmail.com |
| **Website** | https://ghpolsterei.de |
| **Business type** | Handwerksbetrieb (upholstery / saddlery) |
| **Chamber** | Handwerkskammer zu Köln |
| **Trade register no.** | 1234150 |
| **VAT ID (USt-IdNr.)** | DE364438920 |
| **Opening hours** | Mo – Sa: 09:00 – 17:00 Uhr (shown on Kontakt page) |
| **Promo** | 20% Rabatt für Neukunden (homepage hero) |
| **Google Maps** | Embedded iframe: `maps.google.com/maps?q=GH Polsterei` (homepage z=12, kontakt z=17) |

### Homepage stats (animated counters)

| Stat | Value |
|------|-------|
| Jahre im Geschäft | 15+ |
| Zufriedene Kunden | 1.500+ |
| Auftrag abgeschlossen | 2.500+ |
| Geschultes Personal | 150+ |

---

## Services

Six services appear on `/leistungsangebot/` and are summarized on the homepage.

| # | Service name (DE) | Description summary | Image on `/leistungsangebot/` | Best/original asset URL | Dimensions | File size |
|---|-------------------|---------------------|-------------------------------|-------------------------|------------|-----------|
| 1 | **Neu Bezug von Polstermöbeln** | Neubezug für zeitlose Eleganz | Stock photo (car seat sewing) | https://ghpolsterei.de/wp-content/uploads/2024/10/sewing-car-seat-cover-2022-09-26-21-05-47-utc-scaled.jpg | 2560×1707 | ~375 KB |
| 2 | **Cabrio neu beziehen** | Maßgeschneiderte Cabrio-Verdecke | Custom PNG | https://ghpolsterei.de/wp-content/uploads/2024/10/polster-2.png | 1707×1127 | ~2.4 MB |
| 3 | **Aufpolstern** | Professionelles Aufpolstern für neuen Komfort | Custom PNG | https://ghpolsterei.de/wp-content/uploads/2024/10/aufpolstern.png | 1707×1127 | ~1.4 MB |
| 4 | **Markisen** | Markisen-Restaurierung; Planen für LKW/Anhänger | Custom PNG | https://ghpolsterei.de/wp-content/uploads/2024/10/3.png | 1500×1000 | ~1.9 MB |
| 5 | **Neubau/Restaurierung von Gastronomie Sitzbänken** | Maßgeschneiderte Sitzbänke für Gastronomie | Custom PNG | https://ghpolsterei.de/wp-content/uploads/2024/10/polster-1.png | 1707×1127 | ~1.6 MB |
| 6 | **Sattlerei Arbeiten wie Autositze neu beziehen/Restaurieren** | Autositze beziehen/restaurieren | Custom PNG | https://ghpolsterei.de/wp-content/uploads/2024/10/1.png | 1500×1000 | ~1.6 MB |

**Homepage service list** (text only, no per-service images in cards):

- Neu Bezug von Polstermöbeln  
- Aufpolstern  
- Neubau/Restaurierung von Gastronomie Sitzbänken  
- Markisen / PVC Plane *(wording differs slightly from Leistungsangebot page)*  
- Sattlerei Arbeiten wie Autositze neu beziehen/Restaurieren  
- Cabrio neu beziehen  

**Homepage services intro:** Experte für hochwertige und maßgeschneiderte Innenausstattung; Möbel erneuern/restaurieren; gastronomische Sitzbänke; Sattlerarbeiten für Autositze und Cabrios.

---

## Projects / Gallery Assets

The `/projekte/` page displays a **12-image gallery** with no per-image captions, titles, or categories. All images are served directly at full filename (no WordPress `-150x150` thumbnail suffix in markup). WordPress media library confirms **1500×1500 px** as the registered full size for each.

| # | Display URL (same as full) | Best / original URL | Dimensions | File size | Alt text |
|---|---------------------------|---------------------|------------|-----------|----------|
| 1 | https://ghpolsterei.de/wp-content/uploads/2024/10/1.jpg | *(same)* | 1500×1500 | 275 KB | *(empty)* |
| 2 | https://ghpolsterei.de/wp-content/uploads/2024/10/2.jpg | *(same)* | 1500×1500 | 129 KB | *(empty)* |
| 3 | https://ghpolsterei.de/wp-content/uploads/2024/10/3.jpg | *(same)* | 1500×1500 | 217 KB | *(empty)* |
| 4 | https://ghpolsterei.de/wp-content/uploads/2024/10/4.jpg | *(same)* | 1500×1500 | 229 KB | *(empty)* |
| 5 | https://ghpolsterei.de/wp-content/uploads/2024/10/5.jpg | *(same)* | 1500×1500 | 454 KB | *(empty)* |
| 6 | https://ghpolsterei.de/wp-content/uploads/2024/10/6.jpg | *(same)* | 1500×1500 | 236 KB | *(empty)* |
| 7 | https://ghpolsterei.de/wp-content/uploads/2024/10/7.jpg | *(same)* | 1500×1500 | 327 KB | *(empty)* |
| 8 | https://ghpolsterei.de/wp-content/uploads/2024/10/8.jpg | *(same)* | 1500×1500 | 281 KB | *(empty)* |
| 9 | https://ghpolsterei.de/wp-content/uploads/2024/10/9.jpg | *(same)* | 1500×1500 | 441 KB | *(empty)* |
| 10 | https://ghpolsterei.de/wp-content/uploads/2024/10/10.jpg | *(same)* | 1500×1500 | 220 KB | *(empty)* |
| 11 | https://ghpolsterei.de/wp-content/uploads/2024/10/11.jpg | *(same)* | 1500×1500 | 431 KB | *(empty)* |
| 12 | https://ghpolsterei.de/wp-content/uploads/2024/10/12.jpg | *(same)* | 1500×1500 | 307 KB | *(empty)* |

**Page headings:** Projekte → Unsere Projekte → Inspiration für Ihr nächstes Projekt

**Note:** No higher-resolution variants exist in the media library for these 12 files. Filenames are generic (`1.jpg`–`12.jpg`); project type/client metadata is not available on the live site.

---

## Logos & Brand Assets

| Asset | Role | Display URL | Best / original URL | Dimensions | File size |
|-------|------|-------------|---------------------|------------|-----------|
| **Abudi-Polsterei-g.png** | Header logo (dark/colored), WP `site_logo` ID 7 | `…/Abudi-Polsterei-g-120x88.png` | https://ghpolsterei.de/wp-content/uploads/2024/10/Abudi-Polsterei-g.png | 834×610 | ~88 KB |
| **Abudi-Polsterei-w.png** | Footer logo (white) | `…/Abudi-Polsterei-w.png` | https://ghpolsterei.de/wp-content/uploads/2024/10/Abudi-Polsterei-w.png | 834×610 | ~38 KB |

**Logo srcset variants (header):**

- 120w: `Abudi-Polsterei-g-120x88.png`
- 300w: `Abudi-Polsterei-g-300x219.png`
- 768w: `Abudi-Polsterei-g-768x562.png`
- 834w: `Abudi-Polsterei-g.png` ← **use this**

**Favicon / site icon:** Not configured (`site_icon: 0` in WP JSON). `/favicon.ico` returns **404**. No `apple-touch-icon` found.

---

## Other Images

### Homepage hero / section imagery

| Usage | Display URL | Best / original URL | Dimensions | File size |
|-------|-------------|---------------------|------------|-----------|
| Hero / about texture | `…/photo-texture-of-the-sofa-upholstery-close-up-2021-08-26-15-52-51-utc-1024x682.jpg` | https://ghpolsterei.de/wp-content/uploads/2024/10/photo-texture-of-the-sofa-upholstery-close-up-2021-08-26-15-52-51-utc.jpg | 2464×1640 | ~1.3 MB (displayed variant) / full per WP media |
| Hero / craft photo | `…/sewing-car-seat-cover-2022-09-26-21-05-47-utc.jpg` | https://ghpolsterei.de/wp-content/uploads/2024/10/sewing-car-seat-cover-2022-09-26-21-05-47-utc-scaled.jpg *(WP registered full: 2560×1707)* | 2560×1707 | ~1.5 MB (unscaled `.jpg` on page) / ~375 KB (scaled) |
| Fabric samples | `…/color-samples-of-the-upholstery-fabric-in-the-asso-2022-03-15-05-56-12-utc-683x1024.jpg` | https://ghpolsterei.de/wp-content/uploads/2024/10/color-samples-of-the-upholstery-fabric-in-the-asso-2022-03-15-05-56-12-utc-scaled.jpg | 1707×2560 | ~176 KB (displayed) / full per WP media |

### Uploaded but not visibly used on main pages

These exist in the WP media library (`/wp-json/wp/v2/media`) but were **not referenced** on the five live pages crawled:

- `black-velveteen-upholstery-fabric-texture-backgrou-…-scaled-1.jpg` (2560×1707)
- `furniture-upholstery-and-manufacture-fabric-renova-…-1024x683-1.jpg` (1024×683)
- `interior-designer-desk-with-fabric-swatches-…-scaled.jpg` (2560×1709)
- `young-man-shoemaker-at-footwear-workshop-…-scaled.jpg` (1709×2560)
- Numerous legacy Astra starter-template assets under `/wp-content/uploads/2021/06/` (roofing/demo theme leftovers)

**Total unique image assets actively used on live pages:** ~24 (12 project + 6 service + 2 logos + 4 homepage hero/stock)

---

## Existing Form

Contact Form 7 (v6.1.7) with Google reCAPTCHA v3.

### Form A — Quick callback (homepage only)

| Field | Type | Name | Required |
|-------|------|------|----------|
| Name | text | `your-name` | No |
| Telefonnummer | tel | `your-tel` | No |
| Submit | submit | — | Label: **Senden** |

- CF7 form ID: **1463**
- Method: POST (AJAX via CF7)
- Hidden fields: `_wpcf7`, version, locale, unit tag, container post, recaptcha response

### Form B — Full contact (homepage + `/kontakt/`)

| Field | Type | Name | Required |
|-------|------|------|----------|
| Ihr Name | text | `your-name` | No |
| Ihre E-Mail-Adresse | email | `your-email` | No |
| Betreff | text | `your-subject` | No |
| Ihre Nachricht | textarea | `your-message` | Optional (label says optional) |
| Submit | submit | — | Label: **Senden** |

- CF7 form ID: **1465**
- reCAPTCHA site key visible in source: `6LdKavQqAAAAAAORMN0f0KwgTVcs9f-J1wkZoSV6`

---

## SEO / Technical Findings

| Topic | Finding |
|-------|---------|
| **CMS** | WordPress 7.1 |
| **Theme** | Astra 4.13.10 |
| **Page builder** | Ultimate Addons for Gutenberg (Spectra) 2.20.3 |
| **Forms** | Contact Form 7 6.1.7 |
| **Language** | `<html lang="en-US">` on all pages — **content is German** |
| **Meta descriptions** | **Missing** on all crawled pages |
| **Canonical URLs** | Present on all main pages |
| **robots.txt** | Allows `/`, disallows `/wp-admin/`; points to `https://ghpolsterei.de/wp-sitemap.xml` |
| **Sitemap** | WP sitemap index with pages, posts, categories, users |
| **Structured data** | Not observed |
| **SSL** | HTTPS active |
| **Performance** | Large PNG service images (1.4–2.5 MB each); no lazy-load issues noted |
| **Security exposure** | REST API, XML-RPC (`xmlrpc.php`), author archive in sitemap |
| **Sample post** | `/hello-world/` still in sitemap (should be removed or noindexed) |
| **Template leftovers** | English footer headings (“Our Service”, “Quick Links”); mixed EN/DE UI |

---

## Content Worth Keeping

- **Business identity:** GH Polsterei / Sattlerei, owner name, Wesseling address, phone, email, VAT ID, Handwerkskammer registration  
- **Service list and descriptions** (DE) — core offering is clear and comprehensive  
- **12 project photos** — real portfolio assets at 1500×1500  
- **Brand logos** (`Abudi-Polsterei-g.png`, `Abudi-Polsterei-w.png`)  
- **Impressum + Datenschutz legal text** (updated Jan 2025 per impressum page)  
- **Opening hours** (Mo–Sa 09:00–17:00)  
- **Google Maps embed** reference  
- **Neukunden 20% Rabatt** promotion  
- **Trust signals:** counter stats, “6 Gründe” list (Hochwertiges Material, Zertifiziert, Ausgebildete Arbeitskräfte, Zeitliche Verfügbarkeit, Schnelle Antwort, Lieferservice)  
- **About copy** on homepage (“generationenbetriebener Familien Betrieb”, quality materials, fair prices)

---

## Content That Should Be Rewritten

- **Language consistency:** UI lang `en-US`; footer sections in English; main content in German — unify to DE  
- **Typos / grammar:** e.g. “ihn Deutschland” → “in Deutschland”, “über unser Leistungen”, inconsistent capitalization (“Beziehen”)  
- **Service naming:** “Markisen / PVC Plane” (home) vs “Markisen” (Leistungsangebot) — align  
- **Stock vs custom imagery:** “Neu Bezug von Polstermöbeln” uses a car-seat stock photo — replace with relevant upholstery work  
- **Placeholder social links** (`href="#"`) — remove or connect real profiles  
- **Generic project filenames** — add captions/categories in new site  
- **Stats counters** (15+ years, 1500+ customers) — verify accuracy before republishing  
- **hello-world** sample post — delete or exclude  
- **Missing meta descriptions** — write unique DE descriptions per page  
- **Footer “Our Service / Quick Links”** — translate/localize

---

## URL Redirect Considerations

| Old URL | Recommended action |
|---------|-------------------|
| `/` | Keep as home |
| `/leistungsangebot/` | Keep or map to `/leistungen/` if slug changes |
| `/projekte/` | Keep or map to `/projekte/` / `/galerie/` |
| `/kontakt/` | Keep |
| `/impressum/` | Keep; serves **both** Impressum and Datenschutz |
| `/datenschutz/` | **301 → `/impressum/`** (currently 404) |
| `/ueber-uns/` | **301 → `/` or new `/ueber-uns/`** (currently 404; content on homepage) |
| `/hello-world/` | **301 → `/` or 410** (remove sample post) |
| `/feed/` | Optional redirect or leave for RSS consumers |
| `/wp-admin/*`, `/wp-json/*` | Do not redirect publicly in production |

---

## Missing / Unclear Items

| Item | Status |
|------|--------|
| **Dedicated Über uns page** | Not found (404); content embedded on homepage |
| **Dedicated Datenschutz page** | Not found (404); legal text inside Impressum |
| **Favicon** | Missing |
| **Meta descriptions** | Missing on all pages |
| **Social media URLs** | Icons present, links are `#` placeholders |
| **WhatsApp link** | Not found |
| **Project photo metadata** | No titles, categories, or descriptions for gallery items |
| **Service image for “Neu Bezug”** | Uses unrelated stock photo — may be intentional placeholder |
| **hello-world post** | In sitemap; live fetch failed intermittently during audit |
| **Email/phone click-to-action** | Phone/email shown as text; no consistent `tel:` / `mailto:` links in body |
| **Higher-res project images** | None found beyond 1500×1500 |
| **Opening hours on homepage** | Only on Kontakt page, not in footer |

---

## Crawl Summary

| Metric | Count |
|--------|-------|
| Live content pages | 5 |
| URLs in sitemap | 6 |
| Project gallery images (full res) | 12 |
| Service images (custom PNG/JPG) | 6 |
| Logo/brand assets | 2 |
| Homepage hero/stock images | 4 |
| Contact forms | 2 (CF7) |
| Social profiles linked | 0 |
