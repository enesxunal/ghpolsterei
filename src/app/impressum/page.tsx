import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/legal/LegalShell";
import { impressumPage, legalAddressLine } from "@/data/legal";
import { site } from "@/data/site";
import { getMailtoHref, getTelHref } from "@/lib/links";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: impressumPage.metadata.title,
  description: impressumPage.metadata.description,
  path: "/impressum",
  noindex: true,
});

export default function ImpressumPage() {
  return (
    <LegalShell
      eyebrow={impressumPage.title}
      heading={impressumPage.heading}
      intro="Angaben zum Anbieter dieser Website."
    >
      <LegalSection heading="Anbieter">
        <p>
          {site.name}
          <br />
          Inhaber: {site.owner}
          <br />
          {legalAddressLine}
        </p>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <p>
          Telefon:{" "}
          <a
            href={getTelHref()}
            className="underline decoration-border underline-offset-4 transition-colors hover:decoration-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {site.phoneFormatted}
          </a>
          <br />
          E-Mail:{" "}
          <a
            href={getMailtoHref()}
            className="break-all underline decoration-border underline-offset-4 transition-colors hover:decoration-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {site.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="Umsatzsteuer">
        <p>Umsatzsteuer-Identifikationsnummer: {site.vatId}</p>
      </LegalSection>

      <LegalSection heading="Handwerkskammer">
        <p>
          {site.chamber}
          <br />
          Handwerksrolle Nr. {site.tradeRegisterNo}
        </p>
      </LegalSection>
    </LegalShell>
  );
}
