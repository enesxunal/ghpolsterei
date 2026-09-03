import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { homepage } from "@/data/homepage";

export function RegionSection() {
  const { localSeo } = homepage;

  return (
    <section
      aria-labelledby="region-heading"
      className="bg-dark py-16 text-ivory sm:py-20"
    >
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
            {localSeo.eyebrow}
          </p>
          <h2
            id="region-heading"
            className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] text-ivory sm:text-4xl"
          >
            {localSeo.heading}
          </h2>
          {localSeo.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
          <p className="mt-8">
            <Link
              href="/einsatzgebiet"
              className="text-[0.9375rem] font-medium text-gold underline-offset-4 transition-colors hover:text-ivory hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
            >
              Einsatzgebiet ansehen
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
