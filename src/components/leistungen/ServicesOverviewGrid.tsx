import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/data/services";

type ServicesOverviewGridProps = {
  services: Service[];
};

export function ServicesOverviewGrid({ services }: ServicesOverviewGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <li key={service.id} className="group flex min-w-0 flex-col">
          <Link
            href={`/leistungen/${service.slug}`}
            className="flex min-w-0 flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                className="object-cover object-center transition-[transform,filter] duration-500 group-hover:brightness-[1.02] motion-reduce:transition-none"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col pt-4 sm:pt-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
                {service.eyebrow}
              </p>
              <h2 className="mt-2 font-serif text-[1.35rem] leading-snug text-navy sm:text-[1.5rem]">
                {service.title}
              </h2>
              <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                {service.description}
              </p>
              <span className="mt-4 inline-flex w-fit text-[0.9375rem] font-medium text-gold-dark underline-offset-4 transition-colors group-hover:text-navy group-hover:underline motion-reduce:transition-none">
                Zur Leistung
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
