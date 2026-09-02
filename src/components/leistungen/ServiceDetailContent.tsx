import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import type { Service } from "@/data/services";
import { getRelatedServices } from "@/data/services";
import { site } from "@/data/site";
import { getTelHref } from "@/lib/links";
import { BreadcrumbNav } from "./BreadcrumbNav";

type ServiceDetailContentProps = {
  service: Service;
};

const heroLayouts = {
  "split-right": {
    section: "lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center",
    text: "lg:col-span-5 lg:order-1",
    image: "mt-8 lg:mt-0 lg:col-span-7 lg:order-2",
    imageAspect: "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/4]",
  },
  "split-left": {
    section: "lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center",
    text: "lg:col-span-5 lg:order-2",
    image: "mt-8 lg:mt-0 lg:col-span-7 lg:order-1",
    imageAspect: "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/4]",
  },
  stacked: {
    section: "",
    text: "max-w-2xl",
    image: "mt-10",
    imageAspect: "aspect-[16/9] sm:aspect-[21/9]",
  },
  offset: {
    section: "lg:grid lg:grid-cols-12 lg:gap-8",
    text: "lg:col-span-6 lg:pt-8",
    image: "mt-8 lg:mt-16 lg:col-span-6",
    imageAspect: "aspect-[4/3] sm:aspect-[3/2]",
  },
  "wide-image": {
    section: "",
    text: "max-w-3xl",
    image: "mt-10 -mx-4 sm:mx-0",
    imageAspect: "aspect-[16/10] sm:aspect-[2/1]",
  },
  "narrow-image": {
    section: "lg:grid lg:grid-cols-12 lg:gap-10",
    text: "lg:col-span-7",
    image: "mt-8 lg:mt-0 lg:col-span-5 lg:max-w-md lg:justify-self-end",
    imageAspect: "aspect-[3/4] sm:aspect-[4/5]",
  },
} as const;

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  const related = getRelatedServices(service);
  const layout = heroLayouts[service.layoutVariant];

  return (
    <>
      <section
        aria-labelledby="service-detail-heading"
        className="bg-navy py-12 text-ivory sm:py-16 lg:py-20"
      >
        <Container>
          <BreadcrumbNav
            tone="on-navy"
            items={[
              { label: "Startseite", href: "/" },
              { label: "Leistungen", href: "/leistungen" },
              { label: service.title },
            ]}
          />

          <div className={layout.section}>
            <div className={layout.text}>
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
                {service.eyebrow}
              </p>
              <h1
                id="service-detail-heading"
                className="mt-3 font-serif text-[2.15rem] font-semibold leading-[1.1] text-ivory sm:text-4xl lg:text-[3rem]"
              >
                {service.title}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">
                {service.intro}
              </p>
            </div>

            <div className={layout.image}>
              <div className={`relative overflow-hidden ${layout.imageAspect}`}>
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ivory py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
            {service.sections.map((section) => (
              <article key={section.heading}>
                <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted sm:text-[1.0625rem]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
                {section.listItems && (
                  <ul className="mt-5 space-y-2.5 border-l-2 border-gold pl-5 text-base leading-relaxed text-muted">
                    {section.listItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>

      {service.workshopImages && service.workshopImages.length > 0 ? (
        <section
          aria-labelledby="workshop-insights-heading"
          className="bg-surface py-12 sm:py-16 lg:py-20"
        >
          <Container>
            <div className="max-w-2xl">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark sm:text-[0.8125rem]">
                Werkstatt
              </p>
              <h2
                id="workshop-insights-heading"
                className="mt-3 font-serif text-2xl font-semibold text-navy sm:text-3xl"
              >
                Einblicke aus der Werkstatt
              </h2>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {service.workshopImages.map((image) => (
                <li key={image.src} className="min-w-0 overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="h-auto w-full"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section
        aria-labelledby="service-process-heading"
        className="bg-navy py-12 text-ivory sm:py-16 lg:py-20"
      >
        <Container>
          <div className="max-w-2xl">
            <h2
              id="service-process-heading"
              className="font-serif text-2xl text-ivory sm:text-3xl"
            >
              {service.process.heading}
            </h2>
          </div>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {service.process.steps.map((step, index) => (
              <li key={step.title} className="min-w-0">
                <p className="font-serif text-3xl leading-none text-gold">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-serif text-xl text-ivory sm:text-[1.35rem]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ivory/75">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {related.length > 0 && (
        <section
          aria-labelledby="related-services-heading"
          className="bg-ivory py-12 sm:py-16"
        >
          <Container>
            <h2
              id="related-services-heading"
              className="font-serif text-2xl text-navy sm:text-3xl"
            >
              Weitere Leistungen
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug} className="border-t border-gold/50 pt-6">
                  <Link
                    href={`/leistungen/${item.slug}`}
                    className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  >
                    <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-2 font-serif text-xl text-navy transition-colors group-hover:text-gold-dark motion-reduce:transition-none">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="bg-navy py-12 text-ivory sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="font-serif text-2xl text-ivory sm:text-3xl">
              Referenzen ansehen
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-ivory/75">
              Im Bereich Projekte zeigen wir abgeschlossene Arbeiten aus unserer
              Werkstatt — von Polstermöbeln bis Sattlerarbeiten.
            </p>
            <ButtonLink href="/projekte" variant="inverse" className="mt-6">
              Zu den Projekten
            </ButtonLink>
          </div>
          <div className="border-t border-ivory/15 pt-10 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <h2 className="font-serif text-2xl text-ivory sm:text-3xl">
              Projekt anfragen
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-ivory/75">
              Interesse an {service.title}? Rufen Sie uns an oder schreiben Sie
              uns — wir beraten Sie gerne.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/kontakt" variant="gold">
                Projekt anfragen
              </ButtonLink>
              <ButtonLink href={getTelHref()} variant="inverse">
                {site.phoneFormatted}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
