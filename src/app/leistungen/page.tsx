import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BreadcrumbNav } from "@/components/leistungen/BreadcrumbNav";
import { ServicesOverviewGrid } from "@/components/leistungen/ServicesOverviewGrid";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { leistungenPage, services } from "@/data/services";
import { site } from "@/data/site";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { getTelHref } from "@/lib/links";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: leistungenPage.metadata.title,
  description: leistungenPage.metadata.description,
  path: "/leistungen",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Startseite", path: "/" },
  { name: leistungenPage.title, path: "/leistungen" },
]);

export default function LeistungenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <section
          aria-labelledby="leistungen-page-heading"
          className="bg-navy py-12 text-ivory sm:py-16 lg:py-20"
        >
          <Container>
            <BreadcrumbNav
              tone="on-navy"
              items={[
                { label: "Startseite", href: "/" },
                { label: leistungenPage.title },
              ]}
            />

            <div className="max-w-3xl">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
                {leistungenPage.title}
              </p>
              <h1
                id="leistungen-page-heading"
                className="mt-3 font-serif text-[2.15rem] font-semibold leading-[1.1] text-ivory sm:text-4xl lg:text-[3rem]"
              >
                {leistungenPage.heading}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">
                {leistungenPage.intro}
              </p>
            </div>
          </Container>
        </section>

        <section
          aria-label="Leistungsübersicht"
          className="bg-ivory py-12 sm:py-16 lg:py-20"
        >
          <Container>
            <ServicesOverviewGrid services={services} />
          </Container>
        </section>

        <section className="bg-navy py-12 text-ivory sm:py-16">
          <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="font-serif text-2xl text-ivory sm:text-3xl">
                Projekt anfragen
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ivory/75">
                Wir beraten Sie zu Material, Umfang und Termin — telefonisch oder
                per E-Mail aus Wesseling.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href="/kontakt" variant="gold" className="shrink-0">
                Projekt anfragen
              </ButtonLink>
              <ButtonLink href={getTelHref()} variant="inverse" className="shrink-0">
                {site.phoneFormatted}
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
