"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import type { Project } from "@/data/projects";

const layoutClasses = [
  "col-span-2 row-span-2 aspect-[4/5] sm:aspect-[3/4] lg:col-span-6 lg:row-span-2 lg:aspect-auto lg:min-h-[28rem]",
  "aspect-square lg:col-span-3 lg:aspect-[4/5]",
  "aspect-square lg:col-span-3 lg:aspect-[4/5]",
  "aspect-square lg:col-span-4 lg:aspect-[3/4]",
  "aspect-square lg:col-span-4 lg:aspect-[3/4]",
  "aspect-square lg:col-span-4 lg:aspect-[3/4]",
  "col-span-2 aspect-[16/10] lg:col-span-8 lg:aspect-[16/9]",
  "aspect-square lg:col-span-4 lg:aspect-[4/5]",
  "aspect-square lg:col-span-4 lg:aspect-[4/5]",
  "aspect-square lg:col-span-4 lg:aspect-[4/5]",
  "col-span-2 aspect-[4/5] lg:col-span-5 lg:aspect-[3/4]",
  "col-span-2 aspect-[16/10] lg:col-span-7 lg:aspect-[16/10]",
] as const;

function projectAlt(project: Project) {
  return `Projekt ${project.id} — Polsterarbeit von GH Polsterei`;
}

type ProjectsGalleryProps = {
  projects: Project[];
};

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = projects.map((project) => ({
    src: project.image,
    alt: projectAlt(project),
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-12 lg:gap-4">
        {projects.map((project, index) => (
          <li
            key={project.id}
            className={`min-w-0 overflow-hidden ${layoutClasses[index] ?? "aspect-square"}`}
          >
            <button
              type="button"
              className="group relative block h-full w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label={`${projectAlt(project)} vergrößern`}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={project.image}
                alt={projectAlt(project)}
                fill
                className="object-cover object-center transition-[filter] duration-500 group-hover:brightness-110 motion-reduce:transition-none"
                sizes={
                  index === 0
                    ? "(max-width: 1024px) 100vw, 50vw"
                    : index === 6 || index === 11
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 640px) 50vw, 25vw"
                }
              />
              <span className="absolute inset-0 bg-navy/0 transition-colors duration-300 group-hover:bg-navy/15 motion-reduce:transition-none" />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={lightboxIndex !== null}
        images={images}
        index={lightboxIndex ?? 0}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
