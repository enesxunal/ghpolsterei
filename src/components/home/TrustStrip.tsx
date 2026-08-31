import { Container } from "@/components/ui/Container";
import { homepage } from "@/data/homepage";
import { site } from "@/data/site";

export function TrustStrip() {
  return (
    <>
      <section aria-label="Standort und Arbeitsweise" className="bg-navy-deep text-ivory">
        <Container className="py-8 sm:py-10">
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {homepage.trustBand.map((item) => (
              <li key={item} className="min-w-0 border-l-2 border-gold pl-4">
                <p className="font-serif text-lg font-medium leading-snug text-ivory sm:text-xl lg:text-[1.35rem]">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="Unsere Stärken" className="border-b border-border bg-ivory">
        <Container className="py-8 sm:py-10">
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {site.trustReasons.map((reason) => (
              <li
                key={reason}
                className="flex min-w-0 items-start gap-3 text-[0.9375rem] leading-snug text-navy"
              >
                <span
                  className="mt-2.5 h-px w-6 shrink-0 bg-gold"
                  aria-hidden="true"
                />
                <span className="min-w-0 break-words">{reason}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
