import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BreadcrumbNav } from "@/components/leistungen/BreadcrumbNav";
import { Container } from "@/components/ui/Container";
import type { ReactNode } from "react";

type LegalShellProps = {
  eyebrow: string;
  heading: string;
  intro?: string;
  children: ReactNode;
};

export function LegalShell({ eyebrow, heading, intro, children }: LegalShellProps) {
  return (
    <>
      <Header />
      <main id="main-content">
        <section
          aria-labelledby="legal-heading"
          className="bg-dark py-12 text-ivory sm:py-16 lg:py-20"
        >
          <Container>
            <BreadcrumbNav
              tone="on-dark"
              items={[
                { label: "Startseite", href: "/" },
                { label: eyebrow },
              ]}
            />
            <div className="max-w-2xl">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gold sm:text-[0.8125rem]">
                {eyebrow}
              </p>
              <h1
                id="legal-heading"
                className="mt-3 font-serif text-[2.15rem] font-semibold leading-[1.1] text-ivory sm:text-4xl lg:text-[3rem]"
              >
                {heading}
              </h1>
              {intro ? (
                <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">
                  {intro}
                </p>
              ) : null}
            </div>
          </Container>
        </section>

        <section className="bg-ivory py-12 sm:py-16 lg:py-20">
          <Container>
            <div className="max-w-[42rem] text-[1.0625rem] leading-[1.75] text-dark/90">
              {children}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-serif text-2xl font-semibold text-dark sm:text-[1.65rem]">
        {heading}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
