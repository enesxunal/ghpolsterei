import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/kontakt/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BreadcrumbNav } from "@/components/leistungen/BreadcrumbNav";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { OpeningHours } from "@/components/ui/OpeningHours";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { contactAddressLine, contactPage } from "@/data/contact";
import { site } from "@/data/site";
import { getTurnstileSiteKey } from "@/lib/contact/env";
import { createFormTimestampToken } from "@/lib/contact/time-trap";
import { buildBreadcrumbJsonLd, buildLocalBusinessJsonLd } from "@/lib/jsonld";
import { getMailtoHref, getTelHref, getWhatsAppHref } from "@/lib/links";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: contactPage.metadata.title,
  description: contactPage.metadata.description,
  path: "/kontakt",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Startseite", path: "/" },
  { name: contactPage.title, path: "/kontakt" },
]);

const localBusinessJsonLd = buildLocalBusinessJsonLd();

export default function KontaktPage() {
  const timestampToken = createFormTimestampToken();
  const turnstileSiteKey = getTurnstileSiteKey() ?? null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <section
          aria-labelledby="kontakt-page-heading"
          className="bg-navy py-12 text-ivory sm:py-16 lg:py-20"
        >
          <Container>
            <BreadcrumbNav
              tone="on-navy"
              items={[
                { label: "Startseite", href: "/" },
                { label: contactPage.title },
              ]}
            />

            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6 xl:col-span-5">
                <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
                  {contactPage.title}
                </p>
                <h1
                  id="kontakt-page-heading"
                  className="mt-3 font-serif text-[2.25rem] font-semibold leading-[1.08] text-ivory sm:text-4xl lg:text-[3.15rem]"
                >
                  {contactPage.heading}
                </h1>
                <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">
                  {contactPage.intro}
                </p>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-6 lg:aspect-[5/4] xl:col-span-7">
                <Image
                  src="/images/legacy/sewing-car-seat-cover.jpg"
                  alt="Sattlerarbeit in der Werkstatt — Bezug wird genäht"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </Container>
        </section>

        <section
          aria-labelledby="kontakt-form-heading"
          className="bg-ivory pb-28 pt-12 sm:py-16 lg:pb-20 lg:pt-20"
        >
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">
              <aside className="lg:col-span-5">
                <div className="bg-navy px-6 py-8 text-ivory sm:px-8 sm:py-10">
                  <BrandLogo
                    variant="gold"
                    className="h-[72px] w-auto max-w-none"
                  />
                  <p className="mt-6 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold">
                    Direkter Kontakt
                  </p>
                  <h2 className="mt-3 font-serif text-2xl text-ivory sm:text-3xl">
                    {site.name}
                  </h2>

                  <dl className="mt-8 space-y-5 text-[0.9375rem] leading-relaxed">
                    <div>
                      <dt className="text-[0.75rem] uppercase tracking-[0.16em] text-gold">
                        Telefon
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={getTelHref()}
                          className="text-ivory transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        >
                          {site.phoneFormatted}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.75rem] uppercase tracking-[0.16em] text-gold">
                        E-Mail
                      </dt>
                      <dd className="mt-1 break-all">
                        <a
                          href={getMailtoHref()}
                          className="text-ivory transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        >
                          {site.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.75rem] uppercase tracking-[0.16em] text-gold">
                        Adresse
                      </dt>
                      <dd className="mt-1 text-ivory/85">{contactAddressLine}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.75rem] uppercase tracking-[0.16em] text-gold">
                        Öffnungszeiten
                      </dt>
                      <dd className="mt-1 text-ivory/85">
                        <OpeningHours />
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 flex flex-col gap-3">
                    <ButtonLink href={getTelHref()} variant="gold" className="w-full">
                      Jetzt anrufen
                    </ButtonLink>
                    <ButtonLink
                      href={getWhatsAppHref(
                        "Guten Tag, ich möchte ein Angebot bei GH Polsterei anfragen.",
                      )}
                      variant="inverse"
                      external
                      className="w-full"
                    >
                      WhatsApp schreiben
                    </ButtonLink>
                  </div>
                </div>
              </aside>

              <div className="lg:col-span-7">
                <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark sm:text-[0.8125rem]">
                  {contactPage.formEyebrow}
                </p>
                <h2
                  id="kontakt-form-heading"
                  className="mt-3 font-serif text-2xl leading-tight text-navy sm:text-3xl"
                >
                  {contactPage.formHeading}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
                  {contactPage.formIntro}
                </p>
                <div className="mt-8">
                  <ContactForm
                    timestampToken={timestampToken}
                    turnstileSiteKey={turnstileSiteKey}
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
