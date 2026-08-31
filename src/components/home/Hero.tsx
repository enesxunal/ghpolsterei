import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { homepage } from "@/data/homepage";

export function Hero() {
  const { hero } = homepage;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-navy text-ivory"
    >
      <Container className="py-14 sm:py-16 lg:py-[4.75rem]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
              {hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="mt-4 font-serif text-[2.35rem] font-semibold leading-[1.06] text-ivory sm:text-5xl lg:text-[3.35rem] xl:text-[3.75rem]"
            >
              {hero.title}
            </h1>
            <p className="mt-4 font-serif text-xl font-medium leading-snug text-ivory/90 sm:text-2xl lg:text-[1.65rem]">
              {hero.supporting}
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/80 sm:text-lg">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <ButtonLink href="/kontakt" variant="gold" className="w-full sm:w-auto">
                Kontakt aufnehmen
              </ButtonLink>
              <ButtonLink href="/leistungen" variant="inverse" className="w-full sm:w-auto">
                Leistungen ansehen
              </ButtonLink>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div className="grid grid-cols-12 gap-3 sm:gap-4">
              <div className="relative col-span-8 aspect-[4/5] overflow-hidden sm:col-span-7">
                <Image
                  src={hero.primaryImage}
                  alt="Polsterstoff-Textur — Nahaufnahme eines bezogenen Sofas"
                  fill
                  className="object-cover object-[center_35%]"
                  priority
                  sizes="(max-width: 1024px) 66vw, 40vw"
                />
              </div>
              <div className="relative col-span-4 aspect-[3/4] overflow-hidden sm:col-span-5 sm:mt-12 lg:mt-16">
                <Image
                  src={hero.secondaryImage}
                  alt="Sattlerarbeit — Autositzbezug wird genäht"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 33vw, 22vw"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
