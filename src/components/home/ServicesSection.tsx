import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homepage } from "@/data/homepage";
import { services } from "@/data/services";

export function ServicesSection() {
  const { leistungen } = homepage;

  return (
    <section aria-labelledby="leistungen-heading" className="bg-ivory py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          id="leistungen-heading"
          eyebrow={leistungen.title}
          title={leistungen.heading}
          intro={leistungen.intro}
        />

        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} className="group flex min-w-0 flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover object-center transition-[transform,filter] duration-500 group-hover:brightness-[1.02] motion-reduce:transition-none"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col border-t border-gold/70 pt-4 sm:pt-5">
                <h3 className="font-serif text-[1.35rem] leading-snug text-navy sm:text-[1.5rem]">
                  {service.name}
                </h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                  {service.description}
                </p>
                <Link
                  href={`/leistungen/${service.slug}`}
                  className="mt-4 inline-flex w-fit text-[0.9375rem] font-medium text-gold-dark underline-offset-4 transition-colors hover:text-navy hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
                >
                  Mehr erfahren
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
