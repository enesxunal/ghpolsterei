import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homepage } from "@/data/homepage";

export function CraftsmanshipTeaser() {
  const { craftsmanship } = homepage;

  return (
    <section aria-labelledby="handwerk-heading" className="bg-ivory py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative mb-8 lg:col-span-7 lg:order-2 lg:mb-10">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/3]">
              <Image
                src={craftsmanship.image}
                alt="Polsterarbeit aus der Werkstatt — bezogenes Möbelstück"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <div className="absolute -bottom-6 right-4 hidden w-[38%] overflow-hidden border-[6px] border-ivory shadow-[0_12px_40px_rgba(13,21,43,0.18)] sm:block lg:-bottom-8 lg:right-8">
              <div className="relative aspect-[4/5]">
                <Image
                  src={craftsmanship.detailImage}
                  alt="Stoffmuster für Polsterarbeiten — Farb- und Materialauswahl"
                  fill
                  className="object-cover object-center"
                  sizes="22vw"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:order-1 lg:pr-4">
            <SectionHeading
              id="handwerk-heading"
              eyebrow={craftsmanship.title}
              title={craftsmanship.heading}
            />
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {craftsmanship.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/ueber-uns" variant="gold">
                Über unsere Werkstatt
              </ButtonLink>
              <ButtonLink href="/kontakt" variant="secondary">
                Beratung anfragen
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
