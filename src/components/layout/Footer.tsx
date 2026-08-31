import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";
import { getMailtoHref, getTelHref } from "@/lib/links";

export function Footer() {
  const addressLine = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

  return (
    <footer className="bg-navy-deep text-ivory">
      <Container as="footer" className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="relative flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <BrandLogo
                variant="white"
                className="h-[86px] w-auto max-w-none lg:h-[100px]"
              />
            </Link>
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-ivory/75">
              {site.tagline} — Handwerksbetrieb für Polsterei und Sattlerei in
              Wesseling.
            </p>
          </div>

          <div>
            <h2 className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
              Kontakt
            </h2>
            <address className="mt-4 space-y-2.5 not-italic text-[0.9375rem] leading-relaxed text-ivory/85">
              <p>{addressLine}</p>
              <p>
                <a
                  href={getTelHref()}
                  className="transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
                >
                  {site.phoneFormatted}
                </a>
              </p>
              <p>
                <a
                  href={getMailtoHref()}
                  className="break-all transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
                >
                  {site.email}
                </a>
              </p>
              <p className="text-ivory/65">{site.openingHours}</p>
            </address>
          </div>

          <div>
            <h2 className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
              Navigation
            </h2>
            <ul className="mt-4 space-y-2.5">
              {site.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-ivory/85 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/impressum"
                  className="text-[0.9375rem] text-ivory/85 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-[0.9375rem] text-ivory/85 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
              Rechtliches
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem] leading-relaxed text-ivory/80">
              <li className="break-words">{site.chamber}</li>
              <li>Handwerksrolle Nr. {site.tradeRegisterNo}</li>
              <li className="break-all">USt-IdNr. {site.vatId}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gold/25 pt-6 sm:mt-14 sm:pt-8">
          <p className="text-sm text-ivory/55">{site.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
