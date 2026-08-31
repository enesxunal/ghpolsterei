import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homepage } from "@/data/homepage";

export function ProcessSection() {
  const { process } = homepage;

  return (
    <section
      aria-labelledby="ablauf-heading"
      className="border-y border-border bg-surface py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <SectionHeading
          id="ablauf-heading"
          eyebrow={process.title}
          title={process.heading}
          align="center"
          className="mx-auto"
        />

        <ol className="mt-12 grid gap-0 sm:mt-14 sm:grid-cols-3">
          {process.steps.map((step, index) => (
            <li
              key={step.number}
              className={`relative flex flex-col py-8 sm:px-6 sm:py-0 lg:px-10 ${
                index > 0
                  ? "border-t border-gold/40 sm:border-l sm:border-t-0"
                  : ""
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
  );
}
