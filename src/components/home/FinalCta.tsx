import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { homepage } from "@/data/homepage";
import { site } from "@/data/site";
import { getMailtoHref, getTelHref } from "@/lib/links";

export function FinalCta() {
  const { cta } = homepage;

  return (
    <section aria-labelledby="cta-heading" className="bg-ivory py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="bg-navy px-6 py-14 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-[4.5rem]">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
            Kontakt
          </p>
          <h2
            id="cta-heading"
            className="mt-4 font-serif text-[1.85rem] font-semibold text-ivory sm:text-4xl lg:text-[2.85rem]"
          >
            {cta.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
            {cta.body}
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <ButtonLink href={getTelHref()} variant="gold" className="w-full sm:w-auto">
              {site.phoneFormatted}
            </ButtonLink>
            <ButtonLink href={getMailtoHref()} variant="inverse" className="w-full sm:w-auto">
              E-Mail schreiben
            </ButtonLink>
            <ButtonLink href="/kontakt" variant="inverse" className="w-full sm:w-auto">
              Kontaktseite
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
