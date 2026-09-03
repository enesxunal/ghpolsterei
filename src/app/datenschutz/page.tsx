import type { Metadata } from "next";
import Link from "next/link";
import { LegalSection, LegalShell } from "@/components/legal/LegalShell";
import { datenschutzPage, legalAddressLine } from "@/data/legal";
import { site } from "@/data/site";
import { CONTACT_LIMITS } from "@/lib/contact/constants";
import { getMailtoHref, getTelHref } from "@/lib/links";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: datenschutzPage.metadata.title,
  description: datenschutzPage.metadata.description,
  path: "/datenschutz",
  noindex: true,
});

const rateLimitMinutes = CONTACT_LIMITS.rateLimitWindowMs / 60000;
const formTokenHours = CONTACT_LIMITS.maxFormAgeMs / (60 * 60 * 1000);

const linkClass =
  "underline decoration-border underline-offset-4 transition-colors hover:decoration-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export default function DatenschutzPage() {
  return (
    <LegalShell
      eyebrow={datenschutzPage.title}
      heading={datenschutzPage.heading}
      intro="Diese Erklärung beschreibt, welche personenbezogenen Daten wir verarbeiten, wenn Sie diese Website nutzen oder uns über das Kontaktformular schreiben."
    >
      <LegalSection heading="Verantwortlicher">
        <p>
          {site.name}
          <br />
          Inhaber: {site.owner}
          <br />
          {legalAddressLine}
        </p>
        <p>
          Telefon:{" "}
          <a href={getTelHref()} className={linkClass}>
            {site.phoneFormatted}
          </a>
          <br />
          E-Mail:{" "}
          <a href={getMailtoHref()} className={`${linkClass} break-all`}>
            {site.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="Hosting">
        <p>
          Diese Website ist für den Betrieb bei Vercel Inc. (USA) vorgesehen.
          Vercel stellt die technische Infrastruktur bereit und verarbeitet
          dabei technische Zugriffsdaten, soweit das für den Betrieb, die
          Auslieferung und die Absicherung der Website erforderlich ist.
        </p>
        <p>
          Zum Zeitpunkt dieser Erklärung ist die Production-Umgebung noch nicht
          abschließend live geschaltet. Die folgende Beschreibung gilt für die
          geplante Hosting-Architektur und wird bei der Inbetriebnahme erneut
          geprüft.
        </p>
      </LegalSection>

      <LegalSection heading="Server-Logfiles">
        <p>
          Beim Aufruf der Website fallen übliche technische Protokolldaten an.
          Dazu können insbesondere gehören:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit der Anfrage</li>
          <li>aufgerufene Adresse / Request</li>
          <li>HTTP-Status</li>
          <li>Browser- bzw. User-Agent-Angaben</li>
          <li>Referrer, soweit übermittelt</li>
        </ul>
        <p>
          Diese Daten dienen dem technischen Betrieb, der Fehleranalyse und der
          Sicherheit der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
          DSGVO. Eine feste Aufbewahrungsdauer in Tagen legen wir hier nicht
          fest; die Speicherung richtet sich nach den technischen Erfordernissen
          des Hosting-Anbieters und nach dem Zweck der Verarbeitung.
        </p>
      </LegalSection>

      <LegalSection heading="Kontaktaufnahme">
        <p>
          Über das Formular auf der Seite{" "}
          <Link href="/kontakt" className={linkClass}>
            Kontakt
          </Link>{" "}
          können Sie eine Anfrage senden. Dabei können folgende Angaben
          verarbeitet werden:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Name</li>
          <li>E-Mail-Adresse</li>
          <li>Telefonnummer</li>
          <li>gewählte Leistung / Anliegen</li>
          <li>Nachricht</li>
          <li>optional hochgeladene Fotos</li>
        </ul>
        <p>
          Zweck ist die Bearbeitung Ihrer Anfrage und — soweit gewünscht — die
          Vorbereitung eines Angebots. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
          DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage hin).
        </p>
        <p>
          Für den Schutz des Formulars vor Missbrauch (Spam, automatisierte
          Angriffe) verarbeiten wir zusätzlich technische Angaben. Rechtsgrundlage
          dafür ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection heading="Foto-Upload">
        <p>
          Sie können dem Formular Bilder beifügen (JPG, PNG oder WebP), damit wir
          Zustand und Umfang besser einschätzen können. Vor dem Versand können
          die ausgewählten Bilder im Browser verkleinert und optimiert werden;
          an uns geht die vorbereitete Fassung.
        </p>
        <p>
          Die Bilder dienen der Bewertung Ihrer Anfrage und werden mit der
          Werkstatt-E-Mail übermittelt. Ein dauerhafter Objekt-Speicher ist
          nicht eingerichtet: Die Dateien liegen nur während der Anfrage im
          Arbeitsspeicher und werden nicht bei uns abgelegt.
        </p>
      </LegalSection>

      <LegalSection heading="Cloudflare Turnstile">
        <p>
          Zum Schutz des Kontaktformulars vor Bots setzen wir Cloudflare
          Turnstile der Cloudflare, Inc. (USA) ein. Turnstile prüft, ob die
          Anfrage von einem Menschen stammt. Dafür können technische Signale
          wie IP-Adresse, User-Agent, TLS- und Browser-Eigenschaften verarbeitet
          werden.
        </p>
        <p>
          Turnstile liest den Inhalt Ihrer Nachricht nicht. Die Einbindung dient
          ausschließlich der Spam- und Bot-Abwehr sowie der Sicherheit des
          Formulars. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection heading="Upstash">
        <p>
          Zur Begrenzung der Absendehäufigkeit nutzen wir Upstash Redis (Upstash
          Inc., USA), sofern die Production-Zugangsdaten hinterlegt sind. Dabei
          wird ein Zähler zu einem technischen Schlüssel gespeichert, der die
          IP-Adresse der Anfrage enthält. Der Inhalt des Formulars (Name,
          Nachricht, Fotos) wird nicht in Redis abgelegt.
        </p>
        <p>
          Der Eintrag läuft nach {rateLimitMinutes} Minuten ab. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. f DSGVO (Missbrauchsprävention).
        </p>
      </LegalSection>

      <LegalSection heading="E-Mail-Zustellung">
        <p>
          Die Nachricht aus dem Kontaktformular wird über den SMTP-Server des
          bestehenden Website-Hostings (cPanel, Mailserver mail.ghpolsterei.de)
          an das Werkstatt-Postfach {site.email} zugestellt. Dabei werden der
          Inhalt der Anfrage und — soweit angehängt — die Fotos übermittelt,
          damit wir Ihre Nachricht erhalten und beantworten können.
        </p>
        <p>
          Ein gesonderter Versanddienstleister für Transaktions-E-Mails wird
          dafür nicht eingesetzt.
        </p>
      </LegalSection>

      <LegalSection heading="Drittlandübermittlung">
        <p>
          Vercel, Cloudflare und Upstash haben Sitz oder Verarbeitungsorte auch
          außerhalb der EU, insbesondere in den USA. Es gilt nicht, dass alle
          Daten in Deutschland verbleiben.
        </p>
        <p>
          Soweit eine Übermittlung in ein Drittland erfolgt, stützt sie sich auf
          geeignete Garantien nach Art. 46 DSGVO, insbesondere
          Standardvertragsklauseln, soweit der jeweilige Anbieter diese
          bereitstellt, und ergänzend auf etwaige weitere von der EU-Kommission
          anerkannte Transfermechanismen.
        </p>
      </LegalSection>

      <LegalSection heading="Speicherdauer">
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es für den
          jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten
          bestehen. Eine pauschale Frist in Tagen legen wir hier nicht fest.
        </p>
        <p>
          Technisch bekannte Fristen: Rate-Limit-Einträge in Redis entfallen nach{" "}
          {rateLimitMinutes} Minuten. Das Zeitfenster für ein gültiges
          Formular-Token beträgt höchstens {formTokenHours} Stunden; das Token
          selbst wird nicht als Nutzerprofil gespeichert.
        </p>
        <p>
          Anfragen, die als E-Mail bei uns eingehen, folgen der Aufbewahrung des
          Werkstatt-Postfachs und etwaiger handels- oder steuerrechtlicher Pflichten.
        </p>
      </LegalSection>

      <LegalSection heading="Ihre Rechte">
        <p>Sie haben nach der DSGVO insbesondere das Recht auf:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Auskunft über die zu Ihrer Person gespeicherten Daten</li>
          <li>Berichtigung unrichtiger Daten</li>
          <li>Löschung, soweit keine Aufbewahrungspflicht entgegensteht</li>
          <li>Einschränkung der Verarbeitung</li>
          <li>Datenübertragbarkeit</li>
          <li>Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO</li>
        </ul>
        <p>
          Zur Ausübung dieser Rechte reicht eine Nachricht an{" "}
          <a href={getMailtoHref()} className={`${linkClass} break-all`}>
            {site.email}
          </a>
          .
        </p>
        <p>
          Sie haben außerdem das Recht, sich bei einer Datenschutzaufsichtsbehörde
          zu beschweren. Für den Standort in Nordrhein-Westfalen ist das die
          Landesbeauftragte für Datenschutz und Informationsfreiheit
          Nordrhein-Westfalen (LDI NRW), Kavalleriestraße 2–4, 40213 Düsseldorf.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies und Tracking">
        <p>
          Diese Website setzt keine eigenen nicht-essentiellen Cookies und keine
          Analyse- oder Werbe-Tracker ein. Es gibt kein Cookie-Banner, weil keine
          entsprechenden Tracking-Dienste eingebunden sind.
        </p>
        <p>
          Cloudflare Turnstile kann für die Bot-Prüfung technische Daten im
          Browser verarbeiten. Das dient der Sicherheit des Formulars, nicht der
          Reichweitenmessung oder Werbung.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
