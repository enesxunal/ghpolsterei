import Image from "next/image";
import { BreadcrumbNav } from "@/components/leistungen/BreadcrumbNav";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { aboutPage } from "@/data/about";
import { projectAltText, projects } from "@/data/projects";

const gallery = [
  projects[0],
  projects[1],
  projects[2],
  projects[4],
];

export function AboutContent() {
  const { workshop, craft, consultation, process, materials, gallery: galleryCopy, cta } =
    aboutPage;

  return (
    <>
      <section
        aria-labelledby="about-heading"
        className="bg-navy py-12 text-ivory sm:py-16 lg:py-20"
      >
        <Container>
          <BreadcrumbNav
            tone="on-navy"
            items={[
              { label: "Startseite", href: "/" },
              { label: aboutPage.title },
            ]}
          />

          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6 xl:col-span-5">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
                {aboutPage.eyebrow}
              </p>
              <h1
                id="about-heading"
                className="mt-3 font-serif text-[2.25rem] font-semibold leading-[1.08] text-ivory sm:text-4xl lg:text-[3.15rem]"
              >
                {aboutPage.heading}
              </h1>
              <p className="mt-4 font-serif text-xl font-medium leading-snug text-ivory/90 sm:text-2xl">
                {aboutPage.lead}
              </p>
              <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">
                {aboutPage.intro}
              </p>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:col-span-6 lg:aspect-[5/4] xl:col-span-7">
              <Image
                src="/images/projects/4.jpg"
                alt="Polsterarbeit aus der Werkstatt der GH Polsterei"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="werkstatt-heading" className="bg-ivory py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark sm:text-[0.8125rem]">
                Standort
              </p>
              <h2
                id="werkstatt-heading"
                className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] text-navy sm:text-4xl"
              >
                {workshop.heading}
              </h2>
              {workshop.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative lg:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4]">
                <Image
                  src="/images/legacy/photo-texture-sofa-upholstery.jpg"
                  alt="Nahaufnahme eines Polsterbezugs aus der Werkstatt"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="handwerk-about-heading" className="border-y border-border bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark sm:text-[0.8125rem]">
              Leistungen
            </p>
            <h2
              id="handwerk-about-heading"
              className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] text-navy sm:text-4xl"
            >
              {craft.heading}
            </h2>
            {craft.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                {paragraph}
              </p>
            ))}
            <div className="mt-8">
              <ButtonLink href="/leistungen" variant="secondary">
                Alle Leistungen
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="beratung-heading" className="bg-ivory py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="relative mb-4 lg:col-span-6 lg:order-2 lg:mb-0">
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4]">
                <Image
                  src="/images/legacy/color-samples-upholstery-fabric.jpg"
                  alt="Stoffmuster für Polsterarbeiten — Farb- und Materialauswahl"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="lg:col-span-6 lg:order-1">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark sm:text-[0.8125rem]">
                Gespräch
              </p>
              <h2
                id="beratung-heading"
                className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] text-navy sm:text-4xl"
              >
                {consultation.heading}
              </h2>
              {consultation.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="gallery-heading" className="bg-navy py-16 text-ivory sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
              Werkstatt
            </p>
            <h2
              id="gallery-heading"
              className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] text-ivory sm:text-4xl"
            >
              {galleryCopy.heading}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">
              {galleryCopy.intro}
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {gallery.map((project) => (
              <li key={project.id} className="relative aspect-square overflow-hidden">
                <Image
                  src={project.image}
                  alt={projectAltText(project.id)}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="/projekte" variant="inverse">
              Projekte ansehen
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="ablauf-about-heading" className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark sm:text-[0.8125rem]">
              Ablauf
            </p>
            <h2
              id="ablauf-about-heading"
              className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] text-navy sm:text-4xl"
            >
              {process.heading}
            </h2>
          </div>
          <ol className="mt-12 grid gap-0 sm:grid-cols-3">
            {process.steps.map((step, index) => (
              <li
                key={step.number}
                className={`relative flex flex-col py-8 sm:px-6 sm:py-0 lg:px-10 ${
                  index > 0 ? "border-t border-gold/40 sm:border-l sm:border-t-0" : ""
                }`}
              >
                <span
                  className="font-serif text-6xl leading-none text-gold sm:text-7xl"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <h3 className="mt-5 font-serif text-2xl text-navy sm:text-[1.65rem]">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="material-heading" className="bg-ivory py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark sm:text-[0.8125rem]">
              Bezüge
            </p>
            <h2
              id="material-heading"
              className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] text-navy sm:text-4xl"
            >
              {materials.heading}
            </h2>
            {materials.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy py-12 text-ivory sm:py-16">
        <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl text-ivory sm:text-3xl">{cta.heading}</h2>
            <p className="mt-3 text-base leading-relaxed text-ivory/75">{cta.body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/kontakt" variant="gold" className="shrink-0">
              Kontakt aufnehmen
            </ButtonLink>
            <ButtonLink href="/projekte" variant="inverse" className="shrink-0">
              Projekte ansehen
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
