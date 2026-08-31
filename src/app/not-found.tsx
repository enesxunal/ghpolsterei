import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-navy py-20 text-ivory sm:py-24 lg:py-32">
          <Container>
            <div className="max-w-2xl">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
                404
              </p>
              <h1 className="mt-4 font-serif text-[2.25rem] font-semibold leading-[1.08] text-ivory sm:text-4xl lg:text-[3.15rem]">
                Diese Seite wurde nicht gefunden.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
                Die Adresse existiert nicht oder wurde verschoben. Zurück zur
                Startseite, zu den Leistungen oder direkt zur Kontaktaufnahme.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href="/" variant="gold" className="w-full sm:w-auto">
                  Zur Startseite
                </ButtonLink>
                <ButtonLink href="/leistungen" variant="inverse" className="w-full sm:w-auto">
                  Leistungen ansehen
                </ButtonLink>
                <ButtonLink href="/kontakt" variant="inverse" className="w-full sm:w-auto">
                  Kontakt
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
