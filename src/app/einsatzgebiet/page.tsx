import type { Metadata } from "next";
import { EditorialArticle } from "@/components/content/EditorialArticle";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { einsatzgebietPage } from "@/data/einsatzgebiet";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: einsatzgebietPage.metadata.title,
  description: einsatzgebietPage.metadata.description,
  path: "/einsatzgebiet",
  ogImages: [
    {
      url: einsatzgebietPage.heroImage.src,
      alt: einsatzgebietPage.heroImage.alt,
    },
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Startseite", path: "/" },
  { name: einsatzgebietPage.title, path: "/einsatzgebiet" },
]);

export default function EinsatzgebietPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <EditorialArticle
          eyebrow={einsatzgebietPage.eyebrow}
          heading={einsatzgebietPage.heading}
          intro={einsatzgebietPage.intro}
          breadcrumb={[
            { label: "Startseite", href: "/" },
            { label: einsatzgebietPage.title },
          ]}
          heroImage={einsatzgebietPage.heroImage}
          sections={einsatzgebietPage.sections}
          showRegionGrid
          regionGridHeading={einsatzgebietPage.grid.heading}
          regionGridIntro={einsatzgebietPage.grid.intro}
          relatedLinks={[
            { href: "/polsterei-koeln", label: "Polsterei für Köln" },
            { href: "/polsterei-bonn", label: "Polsterei für Bonn" },
            { href: "/polsterei-rhein-erft-kreis", label: "Rhein-Erft-Kreis" },
            { href: "/gh-polsterei", label: "Betrieb im Überblick" },
            { href: "/leistungen", label: "Leistungen" },
            { href: "/kontakt", label: "Kontakt" },
          ]}
          cta={einsatzgebietPage.cta}
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
