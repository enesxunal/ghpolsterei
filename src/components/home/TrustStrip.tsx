import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { homepage } from "@/data/homepage";
import { site } from "@/data/site";

const reasonIcons: Record<(typeof site.trustReasons)[number], ReactNode> = {
  "Hochwertiges Material": <MaterialIcon />,
  Zertifikat: <CertificateIcon />,
  "Sorgfältige Ausführung": <CraftIcon />,
  "Zeitliche Verfügbarkeit": <ClockIcon />,
  "Schnelle Antwort": <PhoneIcon />,
  Lieferservice: <DeliveryIcon />,
};

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

      <section aria-labelledby="advantages-heading" className="border-b border-border bg-ivory">
        <Container className="py-10 sm:py-12 lg:py-14">
          <div className="mb-8 max-w-2xl sm:mb-10">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold-dark sm:text-[0.8125rem]">
              Werkstatt
            </p>
            <h2
              id="advantages-heading"
              className="mt-3 font-serif text-[1.65rem] font-semibold leading-[1.12] text-navy sm:text-3xl"
            >
              Sechs Gründe
            </h2>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {site.trustReasons.map((reason) => (
              <li key={reason} className="h-full min-w-0">
                <div className="flex h-full min-h-[5.5rem] items-center gap-4 border border-navy/12 bg-white px-5 py-5 sm:min-h-[6.25rem] sm:px-6">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/70 text-gold-dark"
                    aria-hidden="true"
                  >
                    {reasonIcons[reason]}
                  </span>
                  <p className="min-w-0 font-serif text-[1.0625rem] font-medium leading-snug text-navy sm:text-lg">
                    {reason}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

function MaterialIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="square" />
      <path d="M17 12v8h3" strokeLinecap="square" />
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <rect x="5" y="3.5" width="14" height="17" />
      <path d="M8.5 9h7M8.5 12.5h7" strokeLinecap="square" />
      <path d="M9.5 16.5 11 18l3.5-3.5" strokeLinecap="square" />
    </svg>
  );
}

function CraftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M5 19 14.5 9.5" strokeLinecap="square" />
      <path d="M13 8l3 3 3.5-3.5-3-3z" />
      <path d="M5 19h4" strokeLinecap="square" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 2" strokeLinecap="square" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path
        d="M8 5.5h3.2l.8 2.2-1.6 1.1a11 11 0 0 0 5.8 5.8l1.1-1.6 2.2.8V16a1.5 1.5 0 0 1-1.5 1.5A12.5 12.5 0 0 1 6.5 5.5 1.5 1.5 0 0 1 8 4"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M3 16V8h10v8H3z" />
      <path d="M13 10.5h4l3 3V16h-7" />
      <circle cx="7" cy="16.5" r="1.7" />
      <circle cx="17" cy="16.5" r="1.7" />
    </svg>
  );
}
