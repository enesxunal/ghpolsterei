import Image from "next/image";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/leistungen/BreadcrumbNav";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { einzugsgebietPlaces, type RegionPlace } from "@/data/regions";
import { site } from "@/data/site";
import { getTelHref } from "@/lib/links";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: readonly string[];
};

type HeroImage = {
  src: string;
  alt: string;
};

type RelatedLink = {
  href: string;
  label: string;
};

type EditorialArticleProps = {
  eyebrow: string;
  heading: string;
  intro: string;
  breadcrumb: BreadcrumbItem[];
  heroImage?: HeroImage;
  sections: readonly ArticleSection[];
  relatedLinks?: readonly RelatedLink[];
  showRegionGrid?: boolean;
  regionGridHeading?: string;
  regionGridIntro?: string;
  facts?: readonly { label: string; value: string }[];
  cta: {
    heading: string;
    body: string;
  };
};

export function EditorialArticle({
  eyebrow,
  heading,
  intro,
  breadcrumb,
  heroImage,
  sections,
  relatedLinks,
  showRegionGrid = false,
  regionGridHeading,
  regionGridIntro,
  facts,
  cta,
}: EditorialArticleProps) {
  return (
    <>
      <section
        aria-labelledby="editorial-heading"
        className="bg-dark py-12 text-ivory sm:py-16 lg:py-20"
      >
        <Container>
          <BreadcrumbNav tone="on-dark" items={breadcrumb} />

          <div
            className={
              heroImage
                ? "grid items-center gap-10 lg:grid-cols-12 lg:gap-12"
                : "max-w-3xl"
            }
          >
            <div className={heroImage ? "lg:col-span-6 xl:col-span-5" : undefined}>
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
                {eyebrow}
              </p>
              <h1
                id="editorial-heading"
                className="mt-3 font-serif text-[2.15rem] font-semibold leading-[1.1] text-ivory sm:text-4xl lg:text-[3rem]"
              >
                {heading}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">
                {intro}
              </p>
            </div>
            {heroImage ? (
              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-6 lg:aspect-[5/4] xl:col-span-7">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {facts && facts.length > 0 ? (
        <section aria-label="Betriebsangaben" className="border-b border-border bg-surface py-10 sm:py-12">
          <Container>
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-0 border-t border-gold/40 pt-4">
                  <dt className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-gold-dark">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 break-words text-[0.9375rem] leading-relaxed text-dark">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      <section className="bg-ivory py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
            {sections.map((section) => (
              <article key={section.id}>
                <h2 className="font-serif text-2xl font-semibold text-dark sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted sm:text-[1.0625rem]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {showRegionGrid ? (
        <section
          aria-labelledby="einzugsgebiet-heading"
          className="border-y border-border bg-surface py-12 sm:py-16 lg:py-20"
        >
          <Container>
            <div className="max-w-2xl">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark sm:text-[0.8125rem]">
                Region
              </p>
              <h2
                id="einzugsgebiet-heading"
                className="mt-3 font-serif text-2xl font-semibold text-dark sm:text-3xl"
              >
                {regionGridHeading}
              </h2>
              {regionGridIntro ? (
                <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                  {regionGridIntro}
                </p>
              ) : null}
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {einzugsgebietPlaces.map((place) => (
                <li key={place.name} className="min-w-0 border-t border-gold/50 pt-4">
                  <RegionPlaceItem place={place} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {relatedLinks && relatedLinks.length > 0 ? (
        <section
          aria-labelledby="editorial-links-heading"
          className="bg-ivory py-12 sm:py-16"
        >
          <Container>
            <h2
              id="editorial-links-heading"
              className="font-serif text-2xl text-dark sm:text-3xl"
            >
              Weiterlesen
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {relatedLinks.map((link) => (
                <li key={link.href} className="border-t border-gold/50 pt-6">
                  <Link
                    href={link.href}
                    className="group block text-[0.9375rem] font-medium text-gold-dark underline-offset-4 transition-colors hover:text-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="bg-dark py-12 text-ivory sm:py-16">
        <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl text-ivory sm:text-3xl">{cta.heading}</h2>
            <p className="mt-3 text-base leading-relaxed text-ivory/75">{cta.body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/kontakt" variant="gold" className="shrink-0">
              Angebot anfragen
            </ButtonLink>
            <ButtonLink href={getTelHref()} variant="inverse" className="shrink-0">
              {site.phoneFormatted}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

function RegionPlaceItem({ place }: { place: RegionPlace }) {
  const nameClass =
    "font-serif text-xl text-dark sm:text-[1.35rem]";

  return (
    <>
      {place.href ? (
        <Link
          href={place.href}
          className={`${nameClass} transition-colors hover:text-gold-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none`}
        >
          {place.name}
        </Link>
      ) : (
        <p className={nameClass}>{place.name}</p>
      )}
      {place.note ? (
        <p className="mt-1 text-sm text-muted">{place.note}</p>
      ) : null}
    </>
  );
}
