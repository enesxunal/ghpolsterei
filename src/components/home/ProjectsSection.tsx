import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homepage } from "@/data/homepage";
import { allProjects } from "@/data/projects";
import { HomeProjectsGallery } from "./HomeProjectsGallery";

export function ProjectsSection() {
  const { projects: projectsConfig } = homepage;

  return (
    <section
      aria-labelledby="projekte-heading"
      className="bg-dark py-16 text-ivory sm:py-20 lg:py-24"
    >
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <SectionHeading
            id="projekte-heading"
            eyebrow={projectsConfig.title}
            title={projectsConfig.heading}
            intro={projectsConfig.intro}
            tone="on-dark"
          />
          <ButtonLink href="/projekte" variant="inverse" className="w-full shrink-0 sm:w-auto">
            Alle Projekte
          </ButtonLink>
        </div>

        <HomeProjectsGallery projects={allProjects} previewCount={projectsConfig.count} />
      </Container>
    </section>
  );
}
