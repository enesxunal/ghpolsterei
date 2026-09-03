# Legal review required — GH Polsterei

This list is only what the business owner or a legal advisor should confirm before treating the legal pages as final. The website texts were written from verified public data and the actual application code. They are **not** a lawyer sign-off.

## Impressum

- [ ] Name, Inhaber, Anschrift, Telefon, E-Mail, USt-IdNr. und Handwerksrolle sind aktuell.
- [ ] Rechtsform bleibt Einzelunternehmen / Inhaberbetrieb (keine GmbH, UG, e.K. o. Ä. ohne Beleg).
- [ ] **Verbraucherschlichtung / VSBG:** Es ist nicht dokumentiert, ob der Betrieb an einem Streitbeilegungsverfahren teilnimmt oder verpflichtet wäre. Im Impressum steht dazu bewusst **keine** Aussage. Bitte klären und bei Bedarf einen Satz ergänzen lassen.
- [ ] Die EU-ODR-Plattform ist seit 20.07.2025 geschlossen; sie darf nicht wieder verlinkt werden.

## Datenschutzerklärung

- [ ] Endgültige juristische Freigabe der Datenschutzerklärung.
- [ ] Hosting: Production-Ziel ist **Vercel**. Nach dem ersten Live-Deploy Region, Account und tatsächliche Log-Praxis erneut gegen den Text prüfen.
- [ ] **Auftragsverarbeitung / DPA** in den Konten von Vercel, Cloudflare und Upstash abschließen bzw. bestätigen.
- [ ] Standardvertragsklauseln / EU-US-Transfer der jeweiligen Anbieter im Account nachweisen.
- [ ] Postfach ist `info@ghpolsterei.de` (cPanel-Hosting) — andernfalls Empfänger und Datenschutztext anpassen.
- [ ] Speicherung von Anfrage-E-Mails und etwaigen Anhängen: internes Verfahren festlegen (keine pauschalen 30/90/365-Tage-Fristen im Code).
- [ ] Aufsichtsbehörde LDI NRW wurde aus dem Standort Wesseling (NRW) abgeleitet. Bitte kurz bestätigen.

## Technik, die die Texte voraussetzen

- [ ] Cloudflare Turnstile Site Key + Secret in Production.
- [ ] Upstash Redis REST nur für Rate Limiting (kein Speichern von Formulardaten).
- [ ] SMTP (`mail.ghpolsterei.de`, Port 465) und `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` in Production gesetzt.
- [ ] Kein zusätzlicher Tracker, kein Cookie-Banner, solange der Stand in `docs/privacy-tech-audit.md` gilt.

## Inhalt, der bewusst nicht behauptet wird

Nicht in Impressum, Datenschutz oder Über uns übernehmen, solange unbelegt:

- Gründungsjahr, Generationenbetrieb, Mitarbeiterzahl
- „jahrzehntelange Erfahrung“, Zertifizierungen, Awards
- Kunden- oder Auftragszahlen, Garantien
- Teilnahme oder Nichtteilnahme an Verbraucherschlichtung (bis zur Klärung)
- „Alle Daten bleiben in Deutschland“
