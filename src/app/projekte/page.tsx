import type { Metadata } from "next";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BreadcrumbNav } from "@/components/leistungen/BreadcrumbNav";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { projects, projectsPage } from "@/data/projects";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: projectsPage.metadata.title,
  description: projectsPage.metadata.description,
  path: "/projekte",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Startseite", path: "/" },
  { name: projectsPage.title, path: "/projekte" },
]);

export default function ProjektePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <section
          aria-labelledby="projekte-page-heading"
          className="bg-dark py-12 text-ivory sm:py-16 lg:py-20"
        >
          <Container>
            <BreadcrumbNav
              tone="on-dark"
              items={[
                { label: "Startseite", href: "/" },
                { label: projectsPage.title },
              ]}
            />

            <div className="max-w-2xl">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
                {projectsPage.title}
              </p>
              <h1
                id="projekte-page-heading"
                className="mt-3 font-serif text-[2.15rem] font-semibold leading-[1.1] text-ivory sm:text-4xl lg:text-[3rem]"
              >
                {projectsPage.heading}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">
                {projectsPage.intro}
              </p>
            </div>
          </Container>
        </section>

        <section
          aria-label="Projektgalerie"
          className="bg-ivory py-12 sm:py-16 lg:py-20"
        >
          <Container>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-muted">
              {projectsPage.subheading}. Klicken Sie auf ein Bild, um es zu
              vergrößern.
            </p>
            <ProjectsGallery projects={projects} />
          </Container>
        </section>

        <section className="bg-dark py-12 text-ivory sm:py-16">
          <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="font-serif text-2xl text-ivory sm:text-3xl">
                Ihr Projekt als Nächstes?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ivory/75">
                Wir beraten Sie gerne zu Material, Umfang und Termin — telefonisch
                oder per E-Mail.
              </p>
            </div>
            <ButtonLink href="/kontakt" variant="gold" className="shrink-0">
              Kontakt aufnehmen
            </ButtonLink>
          </Container>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
