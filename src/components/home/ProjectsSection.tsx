import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homepage } from "@/data/homepage";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  const { projects: projectsConfig } = homepage;
  const featured = projects.slice(0, projectsConfig.count);

  return (
    <section
      aria-labelledby="projekte-heading"
      className="bg-navy py-16 text-ivory sm:py-20 lg:py-24"
    >
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <SectionHeading
            id="projekte-heading"
            eyebrow={projectsConfig.title}
            title={projectsConfig.heading}
            intro={projectsConfig.intro}
            tone="on-navy"
          />
          <ButtonLink href="/projekte" variant="inverse" className="w-full shrink-0 sm:w-auto">
            Alle Projekte
          </ButtonLink>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:gap-4">
          {featured.map((project, index) => (
            <li
              key={project.id}
              className={`min-w-0 overflow-hidden ${
                index === 0
                  ? "col-span-2 row-span-2 aspect-[4/5] sm:aspect-[3/4]"
                  : "aspect-square"
              }`}
            >
              <Link
                href="/projekte"
                className="group relative block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Image
                  src={project.image}
                  alt={`Projekt ${project.id} — Polsterarbeit von GH Polsterei`}
                  fill
                  loading="eager"
                  className="object-cover object-center transition-[transform,filter] duration-500 group-hover:brightness-110 motion-reduce:transition-none"
                  sizes={
                    index === 0
                      ? "(max-width: 640px) 100vw, 50vw"
                      : "(max-width: 640px) 50vw, 25vw"
                  }
                />
                <span className="absolute inset-0 bg-navy/0 transition-colors duration-300 group-hover:bg-navy/15 motion-reduce:transition-none" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
